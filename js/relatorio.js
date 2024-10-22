//console.log(JSON.parse(localStorage.getItem("register")));


function renderList() {
    const registers = JSON.parse(localStorage.getItem("register")) || [];

    registers.forEach(register => {
        console.log(register);

        const divRegistro = document.createElement("div");
        divRegistro.innerHTML = `
            <p>${register.data} - ${register.hora} | ${register.tipo}</p>
            <p>Comentário: ${register.comentario || "Nenhum comentário"}</p>
        `;

        document.getElementById("registros-relatorio").appendChild(divRegistro);
    });
}

renderList();