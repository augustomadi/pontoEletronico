const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano");
const horaMinSeg = document.getElementById("hora-min-seg");

const btnBaterPonto = document.getElementById("btn-bater-ponto");
btnBaterPonto.addEventListener("click", register);

const dialogPonto = document.getElementById("dialog-ponto");

const btnDialogFechar = document.getElementById("btn-dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});

const nextRegister = {
    "entrada": "intervalo",
    "intervalo": "volta-intervalo", 
    "volta-intervalo": "saida", 
    "saida": "entrada",
    "falta": "entrada"
}

let registerLocalStorage = getRegisterLocalStorage();

const dialogData = document.getElementById("dialog-data");
const dialogHora = document.getElementById("dialog-hora");

const divAlertaRegistroPonto = document.getElementById("alerta-registro-ponto");

diaSemana.textContent = getWeekDay();
diaMesAno.textContent = getCurrentDate();

async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            }
            resolve(userLocation);
        },
        (error) => {
            reject("Erro ao recuperar a localização " + error);
        });
    });
}

const btnCloseAlertRegister = document.getElementById("alerta-registro-ponto-fechar");
btnCloseAlertRegister.addEventListener("click", () => {
    divAlertaRegistroPonto.classList.remove("show");
    divAlertaRegistroPonto.classList.add("hidden");
});

function getNextId() {
    let lastId = localStorage.getItem("lastId");

    if (!lastId) {
        lastId = 0; 
    }

    const nextId = parseInt(lastId) + 1;

    localStorage.setItem("lastId", nextId);

    return nextId;
}

const btnDialogBaterPonto = document.getElementById("btn-dialog-bater-ponto");
const selectTipoPonto = document.getElementById("tipos-ponto");
const divComentarioPonto = document.getElementById("div-comentario-opcional");
const comentarioPontoTextarea = document.getElementById("comentario-opcional-textarea");
const divAnexoImagem = document.getElementById("div-anexo-imagem");
const divJustificativaPonto = document.getElementById("div-justificativa-ponto");
const justificativaPontoTextarea = document.getElementById("justificativa-ponto-textarea");

// Função para mostrar/ocultar os campos
selectTipoPonto.addEventListener("change", function() {
    const typeRegister = selectTipoPonto.value;

    // Sempre mostra o campo de comentário
    divComentarioPonto.style.display = "block";

    // Mostra o campo de justificativa apenas para "falta"
    if (typeRegister === "falta") {
        divJustificativaPonto.style.display = "block"; // Mostra o campo de justificativa
    } else {
        divJustificativaPonto.style.display = "none"; // Esconde o campo de justificativa
        justificativaPontoTextarea.value = "";  // Limpa o campo de justificativa se não for "falta"
    }

    // Mostra o campo de imagem para todos os tipos
    divAnexoImagem.style.display = "block"; 
});

btnDialogBaterPonto.addEventListener("click", async () => {
    const dataPonto = document.getElementById("data-ponto").value;
    const typeRegister = selectTipoPonto.value;

    // Captura os valores dos campos de justificativa e comentário
    const justificativa = (typeRegister === "falta") ? justificativaPontoTextarea.value.trim() : null;
    const comentarioOpcional = comentarioPontoTextarea.value.trim();

    // Verifica se o input de imagem existe e captura o arquivo (anexoImagem)
    const anexoImagemInput = document.getElementById("anexo-imagem");
    const anexoImagem = anexoImagemInput ? anexoImagemInput.files[0] : null;

    if (!dataPonto) {
        alert("Por favor, escolha uma data e hora.");
        return;
    }

    const selectedDate = new Date(dataPonto);
    const currentDate = new Date();

    // Verifica se a data escolhida é futura
    if (selectedDate > currentDate) {
        alert("Você não pode registrar pontos em datas futuras.");
        return;
    }

    // Verifica se o tipo de ponto é "Falta" e se a justificativa foi preenchida
    if (typeRegister === "falta" && !justificativa) {
        alert("Em caso de falta, escreva sua justificativa.");
        return;
    }

    const dataPassada = selectedDate < currentDate.setHours(0, 0, 0, 0); // Ignora a hora ao comparar

    let userCurrentPosition = await getCurrentPosition();

    let pontoId = getNextId();

    let ponto = {
        "id": pontoId, 
        "data": selectedDate.toLocaleDateString(),
        "hora": selectedDate.toLocaleTimeString(),
        "localizacao": userCurrentPosition,
        "tipo": typeRegister,
        "justificativa": justificativa ? justificativa : null,
        "comentario_opcional": comentarioOpcional ? comentarioOpcional : null,  // Adiciona o comentário opcional
        "imagem": anexoImagem ? anexoImagem.name : null,  // Se houver imagem, salva o nome dela
        "data_passada": dataPassada // Marca se a data é passada
    };

    saveRegisterLocalStorage(ponto);

    localStorage.setItem("lastDateRegister", ponto.data);
    localStorage.setItem("lastTimeRegister", ponto.hora);

    dialogPonto.close();

    divAlertaRegistroPonto.classList.remove("hidden");
    divAlertaRegistroPonto.classList.add("show");

    setTimeout(() => {
        divAlertaRegistroPonto.classList.remove("show");
        divAlertaRegistroPonto.classList.add("hidden");
    }, 5000);
});

function saveRegisterLocalStorage(register) {
    const typeRegister = document.getElementById("tipos-ponto");
    registerLocalStorage.push(register); // Array
    localStorage.setItem("register", JSON.stringify(registerLocalStorage));
    localStorage.setItem("lastTypeRegister", typeRegister.value);
} 

function getRegisterLocalStorage() {
    let registers = localStorage.getItem("register");

    if (!registers) {
        return [];
    }

    return JSON.parse(registers); 
}

function register() {
    dialogData.textContent = "Data: " + getCurrentDate();
    dialogHora.textContent = "Hora: " + getCurrentHour();
    
    let lastTypeRegister = localStorage.getItem("lastTypeRegister");
    if (lastTypeRegister) {
        const typeRegister = document.getElementById("tipos-ponto");
        typeRegister.value = nextRegister[lastTypeRegister];
        let lastRegisterText = "Último registro: " + localStorage.getItem("lastDateRegister") + " - " + localStorage.getItem("lastTimeRegister") + " | " + localStorage.getItem("lastTypeRegister");
        document.getElementById("dialog-last-register").textContent = lastRegisterText;
    }

    setInterval(() => {
        dialogHora.textContent = "Hora: " + getCurrentHour();
    }, 1000);

    dialogPonto.showModal();
}

function getWeekDay() {
    const date = new Date();
    let days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return days[date.getDay()];
}

function getCurrentHour() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

function getCurrentDate() {
    const date = new Date();
    return String(date.getDate()).padStart(2, '0') + "/" + String((date.getMonth() + 1)).padStart(2, '0') + "/" + String(date.getFullYear()).padStart(2, '0');
}

function printCurrentHour() {
    horaMinSeg.textContent = getCurrentHour();
}

const btnDataHoraAtual = document.getElementById("btn-data-hora-atual");
btnDataHoraAtual.addEventListener("click", () => {
    const dataPonto = document.getElementById("data-ponto");
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    dataPonto.value = formattedDate;
});

printCurrentHour();
setInterval(printCurrentHour, 1000);
