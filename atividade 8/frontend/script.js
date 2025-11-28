const API_BASE = '/api';

// Carregar dados iniciais
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    loadStatistics();
});

// Carregar estatísticas
async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE}/orders/statistics`);
        const result = await response.json();
        
        if (result.success) {
            displayStatistics(result.data);
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Exibir estatísticas
function displayStatistics(stats) {
    const statsContainer = document.getElementById('statistics');
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-label">Total de Ordens</div>
            <div class="stat-value">${stats.total}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Ordens Abertas</div>
            <div class="stat-value">${stats.abertas}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Em Andamento</div>
            <div class="stat-value">${stats.emAndamento}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Concluídas</div>
            <div class="stat-value">${stats.concluidas}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Alta Prioridade</div>
            <div class="stat-value">${stats.altaPrioridade}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Valor Total (R$)</div>
            <div class="stat-value">${stats.valorTotal.toFixed(2)}</div>
        </div>
    `;
}

// Carregar ordens
async function loadOrders() {
    try {
        const searchTitle = document.getElementById('searchTitle').value;
        const filterStatus = document.getElementById('filterStatus').value;
        const filterPrioridade = document.getElementById('filterPrioridade').value;
        
        let url = `${API_BASE}/orders?`;
        const params = [];
        
        if (searchTitle) params.push(`titulo=${encodeURIComponent(searchTitle)}`);
        if (filterStatus) params.push(`status=${encodeURIComponent(filterStatus)}`);
        if (filterPrioridade) params.push(`prioridade=${encodeURIComponent(filterPrioridade)}`);
        
        url += params.join('&');
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            displayOrders(result.data);
        }
    } catch (error) {
        console.error('Erro ao carregar ordens:', error);
    }
}

// Exibir ordens
function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>Nenhuma ordem de serviço encontrada.</p>';
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-title">${order.titulo}</div>
                <div class="order-status status-${order.status.replace(' ', '-')}">
                    ${order.status}
                </div>
            </div>
            
            <div class="order-details">
                <p><strong>Descrição:</strong> ${order.descricao}</p>
                <p><strong>Setor:</strong> ${order.setorSolicitante}</p>
                <p><strong>Responsável:</strong> ${order.responsavel || 'Não atribuído'}</p>
                <p><strong>Data de Abertura:</strong> ${new Date(order.dataAbertura).toLocaleDateString()}</p>
                <p><strong>Prazo Estimado:</strong> ${order.prazoEstimado ? new Date(order.prazoEstimado).toLocaleDateString() : 'Não definido'}</p>
                <p><strong>Valor:</strong> R$ ${order.valorServico.toFixed(2)}</p>
            </div>
            
            <div class="order-footer">
                <span class="order-priority prioridade-${order.prioridade}">
                    Prioridade: ${order.prioridade}
                </span>
                
                <div class="order-actions">
                    <button class="btn-edit" onclick="editOrder('${order._id}')">Editar</button>
                    <button class="btn-delete" onclick="deleteOrder('${order._id}')">Excluir</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Criar nova ordem
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const orderData = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        prioridade: document.getElementById('prioridade').value,
        setorSolicitante: document.getElementById('setorSolicitante').value,
        responsavel: document.getElementById('responsavel').value || undefined,
        prazoEstimado: document.getElementById('prazoEstimado').value || undefined,
        valorServico: parseFloat(document.getElementById('valorServico').value)
    };
    
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Ordem criada com sucesso!');
            this.reset();
            loadOrders();
            loadStatistics();
        } else {
            alert('Erro ao criar ordem: ' + result.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao criar ordem de serviço');
    }
});

// Editar ordem
async function editOrder(orderId) {
    const newStatus = prompt('Novo status (aberta, em andamento, concluída):');
    const newResponsavel = prompt('Novo responsável:');
    
    if (newStatus) {
        try {
            const updateData = { status: newStatus };
            if (newResponsavel) updateData.responsavel = newResponsavel;
            
            const response = await fetch(`${API_BASE}/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Ordem atualizada com sucesso!');
                loadOrders();
                loadStatistics();
            } else {
                alert('Erro ao atualizar ordem: ' + result.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao atualizar ordem');
        }
    }
}

// Excluir ordem
async function deleteOrder(orderId) {
    if (confirm('Tem certeza que deseja excluir esta ordem?')) {
        try {
            const response = await fetch(`${API_BASE}/orders/${orderId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Ordem excluída com sucesso!');
                loadOrders();
                loadStatistics();
            } else {
                alert('Erro ao excluir ordem: ' + result.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir ordem');
        }
    }
}