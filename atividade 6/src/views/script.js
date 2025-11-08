const API_BASE = '/api';

// Elementos DOM
const expenseForm = document.getElementById('expenseForm');
const expensesList = document.getElementById('expensesList');
const totalExpenses = document.getElementById('totalExpenses');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModal = document.querySelector('.close');

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Função para formatar valor monetário
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Buscar e exibir despesas
async function fetchExpenses() {
    try {
        const response = await fetch(`${API_BASE}/expenses`);
        const expenses = await response.json();
        displayExpenses(expenses);
    } catch (error) {
        console.error('Erro ao buscar despesas:', error);
        alert('Erro ao carregar despesas');
    }
}

// Exibir despesas na lista
function displayExpenses(expenses) {
    expensesList.innerHTML = '';
    
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p class="no-expenses">Nenhuma despesa cadastrada</p>';
        return;
    }
    
    expenses.forEach(expense => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'expense-item';
        expenseElement.innerHTML = `
            <div class="expense-info">
                <div class="expense-description">${expense.description}</div>
                <div class="expense-amount">${formatCurrency(expense.amount)}</div>
                <div class="expense-date">${formatDate(expense.date)}</div>
            </div>
            <div class="expense-actions">
                <button class="btn-edit" onclick="openEditModal('${expense._id}')">Alterar</button>
                <button class="btn-delete" onclick="deleteExpense('${expense._id}')">Excluir</button>
            </div>
        `;
        expensesList.appendChild(expenseElement);
    });
}

// Buscar e exibir total das despesas
async function fetchTotalExpenses() {
    try {
        const response = await fetch(`${API_BASE}/expenses/total`);
        const data = await response.json();
        totalExpenses.innerText = `Total das Despesas: ${formatCurrency(data.totalAmount)}`;
    } catch (error) {
        console.error('Erro ao buscar o total das despesas:', error);
    }
}

// Adicionar nova despesa
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    
    // Validações básicas
    if (!description.trim()) {
        alert('Por favor, informe uma descrição');
        return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
        alert('Por favor, informe um valor válido maior que zero');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: description.trim(),
                amount: parseFloat(amount),
                date: date || undefined
            })
        });
        
        if (response.ok) {
            expenseForm.reset();
            fetchExpenses();
            fetchTotalExpenses();
        } else {
            const error = await response.json();
            alert(error.error || 'Erro ao cadastrar despesa');
        }
    } catch (error) {
        console.error('Erro ao cadastrar despesa:', error);
        alert('Erro ao cadastrar despesa');
    }
});

// Abrir modal de edição
async function openEditModal(expenseId) {
    try {
        const response = await fetch(`${API_BASE}/expenses/${expenseId}`);
        const expense = await response.json();
        
        document.getElementById('editId').value = expense._id;
        document.getElementById('editDescription').value = expense.description;
        document.getElementById('editAmount').value = expense.amount;
        
        // Formatar data para o input date
        const date = new Date(expense.date);
        const formattedDate = date.toISOString().split('T')[0];
        document.getElementById('editDate').value = formattedDate;
        
        editModal.style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar despesa para edição:', error);
        alert('Erro ao carregar despesa');
    }
}

// Fechar modal
closeModal.addEventListener('click', () => {
    editModal.style.display = 'none';
});

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Editar despesa
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const description = document.getElementById('editDescription').value;
    const amount = document.getElementById('editAmount').value;
    const date = document.getElementById('editDate').value;
    
    // Validações
    if (!description.trim()) {
        alert('Por favor, informe uma descrição');
        return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
        alert('Por favor, informe um valor válido maior que zero');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/expenses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: description.trim(),
                amount: parseFloat(amount),
                date: date || undefined
            })
        });
        
        if (response.ok) {
            editModal.style.display = 'none';
            fetchExpenses();
            fetchTotalExpenses();
        } else {
            const error = await response.json();
            alert(error.error || 'Erro ao atualizar despesa');
        }
    } catch (error) {
        console.error('Erro ao atualizar despesa:', error);
        alert('Erro ao atualizar despesa');
    }
});

// Excluir despesa
async function deleteExpense(expenseId) {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/expenses/${expenseId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            fetchExpenses();
            fetchTotalExpenses();
        } else {
            const error = await response.json();
            alert(error.error || 'Erro ao excluir despesa');
        }
    } catch (error) {
        console.error('Erro ao excluir despesa:', error);
        alert('Erro ao excluir despesa');
    }
}

// Inicializar aplicação
window.addEventListener('DOMContentLoaded', () => {
    fetchExpenses();
    fetchTotalExpenses();
    
    // Definir data atual como padrão
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
});