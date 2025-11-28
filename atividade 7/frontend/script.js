const API_BASE = 'http://localhost:3000/api';

// Elementos DOM
let currentEditingId = null;

// Formatadores
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
};

// Mensagens
function showMessage(message, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message ${type} show`;
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 4000);
}

// Carregar eventos
async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE}/events`);
        const result = await response.json();
        
        if (result.success) {
            displayEvents(result.data);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        showMessage('Erro ao carregar eventos: ' + error.message, 'error');
    }
}

// Pesquisar eventos
async function searchEvents() {
    const searchInput = document.getElementById('search-input').value.trim();
    
    if (!searchInput) {
        loadEvents();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/events/search?titulo=${encodeURIComponent(searchInput)}`);
        const result = await response.json();
        
        if (result.success) {
            displayEvents(result.data);
            showMessage(`${result.data.length} evento(s) encontrado(s)`);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        showMessage('Erro ao pesquisar eventos: ' + error.message, 'error');
    }
}

// Exibir eventos
function displayEvents(events) {
    const eventsList = document.getElementById('events-list');
    
    if (events.length === 0) {
        eventsList.innerHTML = `
            <div class="empty-state">
                <h3>Nenhum evento encontrado</h3>
                <p>Adicione um novo evento usando o formulário acima.</p>
            </div>
        `;
        return;
    }
    
    eventsList.innerHTML = events.map(event => `
        <div class="event-card">
            <div class="event-title">${event.titulo}</div>
            ${event.descricao ? `<div class="event-description">${event.descricao}</div>` : ''}
            <div class="event-details">
                <div>📅 ${formatDate(event.data)}</div>
                <div>📍 ${event.local}</div>
            </div>
            <div class="event-price">${formatCurrency(event.valor)}</div>
            <div class="event-actions">
                <button class="edit-btn" onclick="editEvent('${event._id}')">✏️ Editar</button>
                <button class="delete-btn" onclick="deleteEvent('${event._id}')">🗑️ Excluir</button>
            </div>
        </div>
    `).join('');
}

// Adicionar/Editar evento
document.getElementById('event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        data: document.getElementById('data').value,
        local: document.getElementById('local').value,
        valor: parseFloat(document.getElementById('valor').value)
    };
    
    try {
        let response;
        
        if (currentEditingId) {
            // Editar
            response = await fetch(`${API_BASE}/events/${currentEditingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            // Adicionar
            response = await fetch(`${API_BASE}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message);
            resetForm();
            loadEvents();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        showMessage('Erro ao salvar evento: ' + error.message, 'error');
    }
});

// Editar evento
async function editEvent(id) {
    try {
        const response = await fetch(`${API_BASE}/events/${id}`);
        const result = await response.json();
        
        if (result.success) {
            const event = result.data;
            currentEditingId = event._id;
            
            // Preencher formulário
            document.getElementById('event-id').value = event._id;
            document.getElementById('titulo').value = event.titulo;
            document.getElementById('descricao').value = event.descricao || '';
            document.getElementById('local').value = event.local;
            document.getElementById('valor').value = event.valor;
            
            // Formatar data para o input datetime-local
            const date = new Date(event.data);
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const localDate = new Date(date.getTime() - timezoneOffset);
            document.getElementById('data').value = localDate.toISOString().slice(0, 16);
            
            // Atualizar UI
            document.getElementById('form-title').textContent = 'Editar Evento';
            document.getElementById('submit-btn').textContent = 'Atualizar Evento';
            document.getElementById('cancel-btn').style.display = 'inline-block';
            
            // Rolagem suave para o formulário
            document.querySelector('.form-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        showMessage('Erro ao carregar evento: ' + error.message, 'error');
    }
}

// Excluir evento
async function deleteEvent(id) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/events/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message);
            loadEvents();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        showMessage('Erro ao excluir evento: ' + error.message, 'error');
    }
}

// Cancelar edição
document.getElementById('cancel-btn').addEventListener('click', resetForm);

// Resetar formulário
function resetForm() {
    document.getElementById('event-form').reset();
    document.getElementById('event-id').value = '';
    currentEditingId = null;
    
    document.getElementById('form-title').textContent = 'Adicionar Evento';
    document.getElementById('submit-btn').textContent = 'Adicionar Evento';
    document.getElementById('cancel-btn').style.display = 'none';
}

// Busca ao pressionar Enter
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchEvents();
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
});