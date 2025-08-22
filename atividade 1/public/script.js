// Arquivo: public/script.js

const API_URL = 'http://localhost:3000';

/**
 * Ponto de entrada principal. O código só roda depois que o HTML da página foi completamente carregado.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Verifica se estamos na página de Pessoas
    if (document.getElementById('pessoa-form')) {
        console.log("Página de Pessoas carregada");
        loadPessoas();
        document.getElementById('pessoa-form').addEventListener('submit', handlePessoaSubmit);
    }
    
    // Verifica se estamos na página de Carros
    if (document.getElementById('carro-form')) {
        console.log("Página de Carros carregada");
        loadCarros();
        document.getElementById('carro-form').addEventListener('submit', handleCarroSubmit);
    }
    
    // Verifica se estamos na página de Associações
    if (document.getElementById('associacao-form')) {
        console.log("Página de Associações carregada");
        loadAssociacoes();
        populateSelects();
        document.getElementById('associacao-form').addEventListener('submit', handleAssociacaoSubmit);
    }
});


// ===============================================
// Funções para a página de PESSOAS
// ===============================================

async function loadPessoas() {
    const response = await fetch(`${API_URL}/pessoas`);
    const pessoas = await response.json();
    const list = document.getElementById('pessoas-list');
    list.innerHTML = '';
    pessoas.forEach(pessoa => {
        const item = document.createElement('li');
        item.textContent = `ID: ${pessoa.id}, Nome: ${pessoa.nome}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deletePessoa(pessoa.id);
        item.appendChild(deleteButton);
        list.appendChild(item);
    });
}

async function handlePessoaSubmit(event) {
    event.preventDefault();
    const nome = document.getElementById('nome-pessoa').value;
    await fetch(`${API_URL}/pessoas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
    });
    document.getElementById('pessoa-form').reset();
    loadPessoas();
}

async function deletePessoa(id) {
    await fetch(`${API_URL}/pessoas/${id}`, { method: 'DELETE' });
    loadPessoas();
}


// ===============================================
// Funções para a página de CARROS
// ===============================================

async function loadCarros() {
    const response = await fetch(`${API_URL}/carros`);
    const carros = await response.json();
    const list = document.getElementById('carros-list');
    list.innerHTML = '';
    carros.forEach(carro => {
        const item = document.createElement('li');
        item.textContent = `ID: ${carro.id}, Modelo: ${carro.modelo}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteCarro(carro.id);
        item.appendChild(deleteButton);
        list.appendChild(item);
    });
}

async function handleCarroSubmit(event) {
    event.preventDefault();
    const modelo = document.getElementById('modelo-carro').value;
    await fetch(`${API_URL}/carros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelo }),
    });
    document.getElementById('carro-form').reset();
    loadCarros();
}

async function deleteCarro(id) {
    await fetch(`${API_URL}/carros/${id}`, { method: 'DELETE' });
    loadCarros();
}


// ===============================================
// Funções para a página de ASSOCIAÇÕES
// ===============================================

async function loadAssociacoes() {
    const response = await fetch(`${API_URL}/associacoes`);
    const associacoes = await response.json();
    const list = document.getElementById('associacoes-list');
    list.innerHTML = '';
    associacoes.forEach(assoc => {
        const item = document.createElement('li');
        // Esta linha acessa assoc.pessoa.nome. Ela só funciona se o back-end enviar o objeto 'pessoa'.
        item.textContent = `Pessoa: ${assoc.pessoa.nome} - Carro: ${assoc.carro.modelo}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteAssociacao(assoc.idpessoa, assoc.idcarro);
        item.appendChild(deleteButton);
        list.appendChild(item);
    });
}

async function populateSelects() {
    // Popula select de pessoas
    const pessoasResponse = await fetch(`${API_URL}/pessoas`);
    const pessoas = await pessoasResponse.json();
    const pessoaSelect = document.getElementById('select-pessoa');
    pessoas.forEach(pessoa => {
        const option = document.createElement('option');
        option.value = pessoa.id;
        option.textContent = pessoa.nome;
        pessoaSelect.appendChild(option);
    });

    // Popula select de carros
    const carrosResponse = await fetch(`${API_URL}/carros`);
    const carros = await carrosResponse.json();
    const carroSelect = document.getElementById('select-carro');
    carros.forEach(carro => {
        const option = document.createElement('option');
        option.value = carro.id;
        option.textContent = carro.modelo;
        carroSelect.appendChild(option);
    });
}

async function handleAssociacaoSubmit(event) {
    event.preventDefault();
    const idpessoa = document.getElementById('select-pessoa').value;
    const idcarro = document.getElementById('select-carro').value;
    
    await fetch(`${API_URL}/associacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idpessoa, idcarro }),
    });
    
    document.getElementById('associacao-form').reset();
    loadAssociacoes();
}

async function deleteAssociacao(idpessoa, idcarro) {
    await fetch(`${API_URL}/associacoes/${idpessoa}/${idcarro}`, { method: 'DELETE' });
    loadAssociacoes();
}