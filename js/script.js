async function register() {
    const name = document.getElementById('name')?.value;
    const address = document.getElementById('address')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    console.log("I came here")

    const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, email, password })
    });

    const message = await response.text();
    document.getElementById('message').textContent = message;
    window.location.href = `http://127.0.0.1:5501/views/login.html`
}
async function login() {
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const message = await response.text();
    document.getElementById('message').textContent = message;

    if (response.ok) {
        window.location.href = 'home.html';
    }
}



document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded successfully!"); // Debugging

    // 🟢 Make editExpense globally accessible
    window.editExpense = function (id) {
        console.log(`Edit button clicked! Redirecting to edit.html?id=${id}`);
        window.location.href = ` http://127.0.0.1:5500/public/edit.html?id=${id}`;
    };

    // 🟢 Login Function
    async function login() {
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const message = await response.text();
        document.getElementById('message').textContent = message;

        if (response.ok) {
            window.location.href = 'home.html';
        }
    }

    // 🟢 Register Function


    // 🟢 Expense Form Submission
    const expenseForm = document.getElementById('expense-form');
    if (expenseForm) {
        expenseForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const title = document.getElementById('title').value;
            const amount = document.getElementById('amount').value;
            const category = document.querySelector('input[name="category"]:checked')?.value;
            const date = document.getElementById('date').value;
            const receipt = document.getElementById('receipt').files[0];

            if (!category) {
                alert("Please select a category.");
                return;
            }

            if (receipt && receipt.size > 2 * 1024 * 1024) { // Check if file is larger than 2MB
                document.getElementById('message').textContent = "File must be less than 2MB.";
                return;
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('amount', amount);
            formData.append('category', category);
            formData.append('date', date);
            formData.append('receipt', receipt);

            const response = await fetch('http://localhost:3000/log-expense', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();
            document.getElementById('message').textContent = result;
        });
    }

    // 🟢 Fetch and Render Expenses
    async function fetchExpenses() {
        try {
            console.log("Fetching expenses...");
            const response = await fetch('http://localhost:3000/api/expenses');
            if (!response.ok) throw new Error("Failed to fetch expenses");

            const expenses = await response.json();
            console.log("Expenses fetched:", expenses);

            const templateElement = document.getElementById('expense-template');
            const expenseList = document.getElementById('expense-list');

            if (!templateElement || !expenseList) {
                console.error("Error: Mustache template or expense list not found.");
                return;
            }

            const template = templateElement.innerHTML;
            const rendered = Mustache.render(template, { expenses });

            expenseList.innerHTML = rendered;
            console.log("Expenses rendered successfully!");

        } catch (error) {
            console.error("Error loading expenses:", error);
        }
    }

    // 🟢 Delete Expense
    window.deleteExpense = async function (id) {
        if (confirm("Are you sure you want to delete this expense?")) {
            const response = await fetch(`http://localhost:3000/api/delete-expense/${id}`, { method: 'DELETE' });

            if (response.ok) {
                alert("Expense deleted successfully!");
                fetchExpenses(); // Refresh list after deletion
            } else {
                alert("Failed to delete expense.");
            }
        }
    };

    // Fetch and render expenses on page load
    if (window.location.pathname.includes("expenses.html")) {
        fetchExpenses();
    }

    // 🟢 Fetch Expense Details for Editing
    async function fetchExpenseDetails() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (!id) {
            alert("Invalid Expense ID");
            window.location.href = "/expenses.html";
            return;
        }

        console.log(`Fetching expense details for ID: ${id}`);

        try {
            const response = await fetch(`http://localhost:3000/api/expense/${id}`);
            if (!response.ok) throw new Error("Failed to fetch expense");

            const expense = await response.json();
            console.log("Fetched expense:", expense);

            // Fill the form fields with the fetched data
            document.getElementById('title').value = expense.title;
            document.getElementById('amount').value = expense.amount;
            document.getElementById('category').value = expense.category;
            document.getElementById('date').value = expense.date;

            // Handle form submission
            document.getElementById('edit-form').addEventListener('submit', async function (event) {
                event.preventDefault();

                const updatedExpense = {
                    title: document.getElementById('title').value,
                    amount: document.getElementById('amount').value,
                    category: document.getElementById('category').value,
                    date: document.getElementById('date').value
                };

                console.log("Updating expense:", updatedExpense);

                const updateResponse = await fetch(`http://localhost:3000/api/update-expense/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedExpense)
                });

                if (updateResponse.ok) {
                    alert("Expense updated successfully!");
                    window.location.href = "/public/expenses.html";
                } else {
                    alert("Failed to update expense.");
                }
            });

        } catch (error) {
            console.error("Error fetching expense:", error);
            alert("Error loading expense data.");
        }
    }

    if (window.location.pathname.includes("edit.html")) {
        fetchExpenseDetails();
    }
});
