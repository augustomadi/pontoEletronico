// Função para renderizar a lista de registros
function renderList(registros) {
    const tabelaBody = document.querySelector("#tabela-registros tbody");
    tabelaBody.innerHTML = ''; // Limpa a tabela antes de renderizar

    registros.forEach((registro) => {
        const row = document.createElement("tr");

        const imagemCell = registro.imagem 
            ? `<img src="${registro.imagem}" alt="Imagem" style="width: 100px; height: auto;">`
            : "Nenhuma imagem";

        // Verifica se o registro foi feito para uma data passada
        const dataPassadaText = registro.data_passada ? 'Sim' : 'Não';

        row.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.data}</td>
            <td>${registro.hora}</td>
            <td>${registro.tipo}</td>
            <td>${registro.comentario || "Nenhum comentário"}</td>
            <td>${imagemCell}</td>
            <td>${dataPassadaText}</td>
        `;

        tabelaBody.appendChild(row);
    });
}

// Função para aplicar o filtro de datas
function aplicarFiltro() {
    const dataInicial = document.getElementById("data-inicial").value;
    const dataFinal = document.getElementById("data-final").value;

    if (!dataInicial || !dataFinal) {
        alert("Por favor, selecione um período válido para o filtro.");
        return;
    }

    const registros = JSON.parse(localStorage.getItem("register")) || [];

    const registrosFiltrados = registros.filter(registro => {
        const dataRegistro = new Date(registro.data.split('/').reverse().join('-')); // Converte a data para YYYY-MM-DD
        const dataInicio = new Date(dataInicial);
        const dataFim = new Date(dataFinal);

        return dataRegistro >= dataInicio && dataRegistro <= dataFim;
    });

    renderList(registrosFiltrados);
}

// Adiciona o evento de clique no botão de filtro
document.getElementById("btn-filtrar").addEventListener("click", aplicarFiltro);

// Renderiza todos os registros ao carregar a página
renderList(JSON.parse(localStorage.getItem("register")) || []);
