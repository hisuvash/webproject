async function addBudgetLimit() {
    
    
    const category = document.getElementById("category").value;
    const amount = document.getElementById("amount").value;
    const month = document.getElementById("month").value;
    const notes = document.getElementById("notes").value;
    
    const response = await fetch('http://localhost:3000/api/budget/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount, month, notes })
    });
    
    const message = await response.text();
    document.getElementById('message').textContent = message;
    fetchBudgetLimits();
}

async function fetchBudgetLimits() {
    const response = await fetch('http://localhost:3000/api/budget/get');
    const data = await response.json();
    
    const templateElement = document.getElementById('budget-template');
    const budgetList = document.getElementById('budget-list');
    
    if (!templateElement || !budgetList) {
        console.error("Error: Mustache template or budget list not found.");
        return;
    }
    
    const template = templateElement.innerHTML;
    const rendered = Mustache.render(template, { budgetLimits: data });
    budgetList.innerHTML = rendered;
}

// document.getElementById("budget-form").addEventListener("submit", addBudgetLimit);
fetchBudgetLimits();

