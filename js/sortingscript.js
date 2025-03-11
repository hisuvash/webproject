// /public/js/sortingscript.js - Sorting Feature for Expenses Table
let expensesData = []; // Store fetched expenses for sorting
let isAmountAscending = true; // Toggle state for amount sorting
let isDateAscending = true;   // Toggle state for date sorting

// Fetch and render expenses
async function fetchExpenses() {
    try {
        console.log("Fetching expenses...");
        const response = await fetch('http://localhost:3000/api/expenses');
        if (!response.ok) throw new Error("Failed to fetch expenses");

        expensesData = await response.json();
        console.log("Expenses fetched:", expensesData);

        renderExpenses(expensesData);
    } catch (error) {
        console.error("Error loading expenses:", error);
    }
}

// Function to render expenses using Mustache
function renderExpenses(expenses) {
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
}

// Toggle sorting functions
function sortByAmount() {
    expensesData.sort((a, b) => {
        return isAmountAscending
            ? parseFloat(a.amount) - parseFloat(b.amount)
            : parseFloat(b.amount) - parseFloat(a.amount);
    });

    isAmountAscending = !isAmountAscending; // Toggle order
    updateSortArrows();
    renderExpenses(expensesData);
}

function sortByDate() {
    expensesData.sort((a, b) => {
        return isDateAscending
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
    });

    isDateAscending = !isDateAscending; // Toggle order
    updateSortArrows();
    renderExpenses(expensesData);
}

// Function to update sorting arrows
function updateSortArrows() {
    document.getElementById("sort-amount").innerText = isAmountAscending ? "↓" : "↑";
    document.getElementById("sort-date").innerText = isDateAscending ? "↓" : "↑";
}

// Fetch expenses on page load
fetchExpenses();


// Function to download table data as CSV
function downloadCSV() {
    if (expensesData.length === 0) {
        alert("No data available to download.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add table headers
    csvContent += "Title,Amount,Category,Date,Receipt\n";

    // Add table rows
    expensesData.forEach(expense => {
        let row = [
            `"${expense.title}"`, 
            `"${expense.amount}"`, 
            `"${expense.category}"`, 
            `"${expense.date}"`, 
            `"${expense.receipt || 'No Receipt'}"`
        ].join(",");
        csvContent += row + "\n";
    });

    // Create a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "all_expenses.csv");
    document.body.appendChild(link);

    // Trigger the download
    link.click();
    document.body.removeChild(link);
}
