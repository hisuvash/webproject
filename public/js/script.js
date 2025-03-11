
// 🟢 Expense Form Submission
const expenseForm = document.getElementById('expense-form');
if (expenseForm) {
    expenseForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        const receipt = document.getElementById('receipt').files[0];

        if (!category) {
            alert("Please select a category.");
            return;
        }

        if (receipt && receipt.size > 2 * 1024 * 1024) { // File size > 2MB
            document.getElementById('message').textContent = "File must be less than 2MB.";
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('amount', amount);
        formData.append('category', category);
        formData.append('date', date);
        formData.append('receipt', document.getElementById('receipt').files[0]);

        console.log("I am calling for expense enter");

        const response = await fetch('http://localhost:3000/api/expenses/addExpense', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const result = await response.text();
        document.getElementById('message').textContent = result;
        window.location.href = "../views/expenses.html";
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

// 🟢 Edit Expense
window.editExpense = function (id) {
    console.log(`Edit button clicked! Redirecting to edit.html?id=${id}`);
    window.location.href = `http://localhost:5501/public/views/edit.html?id=${id}`;
};

document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded successfully!");

    // 🟢 Delete Expense
    window.deleteExpense = async function (id) {
        if (confirm("Are you sure you want to delete this expense?")) {
            const response = await fetch(`http://localhost:3000/api/expenses/delete-expense/${id}`, { method: 'DELETE' });

            if (response.ok) {
                alert("Expense deleted successfully!");
                fetchExpenses();
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
            const response = await fetch(`http://localhost:3000/api/expenses/getById/${id}`);
            if (!response.ok) throw new Error("Failed to fetch expense");

            const expense = await response.json();
            console.log("Fetched expense:", expense);

            document.getElementById('title').value = expense.title;
            document.getElementById('amount').value = expense.amount;
            document.getElementById('category').value = expense.category;
            document.getElementById('date').value = expense.date;

            document.getElementById('edit-form').addEventListener('submit', async function (event) {
                event.preventDefault();

                const updatedExpense = {
                    title: document.getElementById('title').value,
                    amount: document.getElementById('amount').value,
                    category: document.getElementById('category').value,
                    date: document.getElementById('date').value
                };

                console.log("Updating expense:", updatedExpense);

                const updateResponse = await fetch(`http://localhost:3000/api/expenses/update-expenses/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedExpense)
                });

                if (updateResponse.ok) {
                    window.location.href = "../views/expenses.html";
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

// 🟢 Search Expenses
const searchForm = document.getElementById("search-form");

if (searchForm) {
    searchForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const category = document.getElementById("category").value;

        try {
            const response = await fetch(`http://localhost:3000/api/expenses/search?category=${category}`);
            const data = await response.json();

            if (!response.ok) {
                alert("Error fetching data");
                return;
            }

            const rendered = Mustache.render(document.getElementById("expense-template").innerHTML, { expenses: data });
            console.log("Expenses rendered successfully!");
            document.getElementById("expense-results").innerHTML = rendered;
        } catch (error) {
            console.error("Error fetching expenses:", error);
            alert("Failed to fetch expenses.");
        }
    });
}

// 🟢 Export to CSV
document.addEventListener("DOMContentLoaded", function () {
    let exportButton = document.getElementById("export-csv");

    if (exportButton) {
        exportButton.addEventListener("click", function () {
            let table = document.querySelector("table");
            if (!table) return;

            let csvContent = Array.from(table.rows)
                .map(row => Array.from(row.cells).map(cell => cell.innerText.replace(/,/g, "")).join(","))
                .join("\n");

            let blob = new Blob([csvContent], { type: "text/csv" });
            let url = URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = "category_expenses.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }
});
