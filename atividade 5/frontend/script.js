class GerenciadorDiscos {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
        this.form = document.getElementById('disco-form');
        this.tabela = document.getElementById('discos-table');
        this.corpoTabela = document.getElementById('discos-body');
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('error-message');
        this.noDiscos = document.getElementById('no-discos');
        this.stats = document.getElementById('total-discos');
        this.modal = document.getElementById('confirm-modal');
        this.discoParaExcluir = null;

        this.inicializarEventos();
        this.carregarDiscos();
    }

    inicializarEventos() {
        this.form.addEventListener('submit', (e) => this.salvarDisco(e));
        
        document.getElementById('cancel-btn').addEventListener('click', () => this.cancelarEdicao());
        
        document.getElementById('confirm-cancel').addEventListener('click', () => this.fecharModal());
        document.getElementById('confirm-delete').addEventListener('click', () => this.confirmarExclusao());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.fecharModal();
        });
    }

    async carregarDiscos() {
        try {
            this.mostrarEstado('loading');
            
            const resposta = await fetch(`${this.apiUrl}/discos`);
            const resultado = await resposta.json();
            
            if (!resposta.ok) {
                throw new Error(resultado.error || 'Erro ao carregar discos');
            }
            
            if (resultado.success) {
                this.exibirDiscos(resultado.data);
                this.atualizarEstatisticas(resultado.count);
            } else {
                throw new Error(resultado.error);
            }
        } catch (erro) {
            console.error('Erro ao carregar discos:', erro);
            this.mostrarEstado('error');
        }
    }

    exibirDiscos(discos) {
        if (!discos || discos.length === 0) {
            this.mostrarEstado('empty');
            return;
        }

        this.mostrarEstado('loaded');
        this.corpoTabela.innerHTML = '';

        discos.forEach(disco => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${this.escapeHtml(disco.titulo)}</td>
                <td>${this.escapeHtml(disco.artista)}</td>
                <td>${disco.ano}</td>
                <td>${this.escapeHtml(disco.genero)}</td>
                <td>
                    <span class="formato-badge ${disco.formato.toLowerCase()}">
                        ${disco.formato === 'Vinil' ? '🎵' : '💿'} ${disco.formato}
                    </span>
                </td>
                <td>R$ ${disco.preco.toFixed(2)}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="gerenciador.editarDisco('${disco._id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn-delete" onclick="gerenciador.solicitarExclusao('${disco._id}', '${this.escapeHtml(disco.titulo)}', '${this.escapeHtml(disco.artista)}')">
                        🗑️ Excluir
                    </button>
                </td>
            `;
            this.corpoTabela.appendChild(linha);
        });
    }

    async salvarDisco(evento) {
        evento.preventDefault();
        
        const id = document.getElementById('disco-id').value;
        const disco = {
            titulo: document.getElementById('titulo').value.trim(),
            artista: document.getElementById('artista').value.trim(),
            ano: parseInt(document.getElementById('ano').value),
            genero: document.getElementById('genero').value.trim(),
            formato: document.getElementById('formato').value,
            preco: parseFloat(document.getElementById('preco').value)
        };

        if (!disco.titulo || !disco.artista || !disco.genero || !disco.formato) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            let resposta;
            if (id) {
                resposta = await fetch(`${this.apiUrl}/discos/${id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(disco)
                });
            } else {
                resposta = await fetch(`${this.apiUrl}/discos`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(disco)
                });
            }

            const resultado = await resposta.json();
            
            if (!resposta.ok) {
                throw new Error(resultado.error || 'Erro ao salvar disco');
            }

            if (resultado.success) {
                this.limparFormulario();
                this.carregarDiscos();
                this.mostrarMensagem(
                    id ? 'Disco atualizado com sucesso! 🎉' : 'Disco cadastrado com sucesso! 🎉',
                    'success'
                );
            }
        } catch (erro) {
            console.error('Erro ao salvar disco:', erro);
            this.mostrarMensagem(`Erro: ${erro.message}`, 'error');
        }
    }

    async editarDisco(id) {
        try {
            const resposta = await fetch(`${this.apiUrl}/discos/${id}`);
            const resultado = await resposta.json();
            
            if (!resposta.ok || !resultado.success) {
                throw new Error(resultado.error || 'Erro ao carregar disco');
            }

            const disco = resultado.data;
            
            document.getElementById('disco-id').value = id;
            document.getElementById('titulo').value = disco.titulo;
            document.getElementById('artista').value = disco.artista;
            document.getElementById('ano').value = disco.ano;
            document.getElementById('genero').value = disco.genero;
            document.getElementById('formato').value = disco.formato;
            document.getElementById('preco').value = disco.preco;

            document.getElementById('form-title').textContent = '✏️ Editar Disco';
            document.getElementById('submit-btn').innerHTML = '💾 Atualizar Disco';
            document.getElementById('cancel-btn').classList.remove('hidden');

            document.querySelector('.form-section').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        } catch (erro) {
            console.error('Erro ao carregar disco:', erro);
            this.mostrarMensagem('Erro ao carregar disco para edição', 'error');
        }
    }

    solicitarExclusao(id, titulo, artista) {
        this.discoParaExcluir = id;
        document.getElementById('disco-info').textContent = `"${titulo}" - ${artista}`;
        this.modal.classList.remove('hidden');
    }

    async confirmarExclusao() {
        if (!this.discoParaExcluir) return;

        try {
            const resposta = await fetch(`${this.apiUrl}/discos/${this.discoParaExcluir}`, {
                method: 'DELETE'
            });
            
            const resultado = await resposta.json();
            
            if (!resposta.ok || !resultado.success) {
                throw new Error(resultado.error || 'Erro ao excluir disco');
            }

            this.fecharModal();
            this.carregarDiscos();
            this.mostrarMensagem('Disco excluído com sucesso! 🗑️', 'success');
        } catch (erro) {
            console.error('Erro ao excluir disco:', erro);
            this.mostrarMensagem('Erro ao excluir disco', 'error');
            this.fecharModal();
        }
    }

    fecharModal() {
        this.modal.classList.add('hidden');
        this.discoParaExcluir = null;
    }

    cancelarEdicao() {
        this.limparFormulario();
    }

    limparFormulario() {
        this.form.reset();
        document.getElementById('disco-id').value = '';
        document.getElementById('form-title').textContent = '➕ Cadastrar Novo Disco';
        document.getElementById('submit-btn').innerHTML = '💾 Cadastrar Disco';
        document.getElementById('cancel-btn').classList.add('hidden');
    }

    mostrarEstado(estado) {
        this.loading.classList.add('hidden');
        this.errorMessage.classList.add('hidden');
        this.noDiscos.classList.add('hidden');
        this.tabela.classList.add('hidden');

        switch (estado) {
            case 'loading':
                this.loading.classList.remove('hidden');
                break;
            case 'error':
                this.errorMessage.classList.remove('hidden');
                break;
            case 'empty':
                this.noDiscos.classList.remove('hidden');
                break;
            case 'loaded':
                this.tabela.classList.remove('hidden');
                break;
        }
    }

    atualizarEstatisticas(total) {
        this.stats.textContent = `${total} ${total === 1 ? 'disco' : 'discos'}`;
    }

    mostrarMensagem(mensagem, tipo) {
        const mensagemEl = document.createElement('div');
        mensagemEl.className = `mensagem-temporaria ${tipo}`;
        mensagemEl.textContent = mensagem;
        mensagemEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            ${tipo === 'success' ? 'background: var(--success-color);' : 'background: var(--danger-color);'}
        `;

        document.body.appendChild(mensagemEl);

        setTimeout(() => {
            mensagemEl.remove();
        }, 3000);
    }

    escapeHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }
}

const estilosAdicionais = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.formato-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: bold;
}

.formato-badge.vinil {
    background: #e8f4fd;
    color: #2980b9;
    border: 1px solid #2980b9;
}

.formato-badge.cd {
    background: #f0f8ff;
    color: #8e44ad;
    border: 1px solid #8e44ad;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = estilosAdicionais;
document.head.appendChild(styleSheet);

let gerenciador;

document.addEventListener('DOMContentLoaded', () => {
    gerenciador = new GerenciadorDiscos();
});