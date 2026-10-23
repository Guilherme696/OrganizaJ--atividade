
const formulario = document.querySelector("#cadastro form");
const tabelaTarefas = document.querySelector("#tarefas tbody");

const campoIdentificador = document.querySelector("#identificador");
const campoNome = document.querySelector("#nome");
const campoDescricao = document.querySelector("#descricao");
const campoCategoria = document.querySelector("#categoria");
const campoData = document.querySelector("#dataConclusao");
const campoStatus = document.querySelector("#status");
const campoImportancia = document.querySelector("#importancia");

let tarefas = [
    {
        identificador: 1,
        nome: "Estudar HTML",
        descricao: "Estudar os principais elementos HTML e sua utilização.",
        categoria: "estudos",
        dataConclusao: "2026-10-05",
        status: "pendente",
        importancia: "alta"
    },
    {
        identificador: 2,
        nome: "Fazer trabalho da faculdade",
        descricao: "Desenvolver o trabalho da faculdade.",
        categoria: "estudos",
        dataConclusao: "2026-10-10",
        status: "andamento",
        importancia: "alta"
    },
    {
        identificador: 3,
        nome: "Organizar documentos",
        descricao: "Organizar documentos pessoais.",
        categoria: "pessoal",
        dataConclusao: "2026-10-15",
        status: "concluida",
        importancia: "media"
    }
];

function formatarCategoria(categoria) {
    const categorias = {
        estudos: "Estudos",
        trabalho: "Trabalho",
        pessoal: "Pessoal",
        outros: "Outros"
    };

    return categorias[categoria] || categoria;
}

function formatarStatus(status) {
    const statusTarefas = {
        pendente: "Pendente",
        andamento: "Em andamento",
        concluida: "Concluída"
    };

    return statusTarefas[status] || status;
}

function formatarImportancia(importancia) {
    const importancias = {
        baixa: "Baixa",
        media: "Média",
        alta: "Alta"
    };

    return importancias[importancia] || importancia;
}

function formatarData(data) {
    if (!data) {
        return "Não definida";
    }

    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function criarCelula(texto) {
    const celula = document.createElement("td");
    celula.textContent = texto;
    return celula;
}

function renderizarTarefas() {
    tabelaTarefas.replaceChildren();

    tarefas.forEach(function (tarefa) {
        const linha = document.createElement("tr");

        linha.appendChild(criarCelula(tarefa.identificador));
        linha.appendChild(criarCelula(tarefa.nome));
        linha.appendChild(criarCelula(formatarCategoria(tarefa.categoria)));
        linha.appendChild(criarCelula(formatarData(tarefa.dataConclusao)));
        linha.appendChild(criarCelula(formatarStatus(tarefa.status)));
        linha.appendChild(criarCelula(formatarImportancia(tarefa.importancia)));

        const celulaAcoes = document.createElement("td");

        const botaoDetalhes = document.createElement("button");
        botaoDetalhes.type = "button";
        botaoDetalhes.textContent = "Ver detalhes";
        botaoDetalhes.addEventListener("click", function () {
            alert("Detalhes da tarefa: " + tarefa.nome);
        });

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";
        botaoEditar.addEventListener("click", function () {
            alert("A edição será implementada na próxima etapa.");
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.addEventListener("click", function () {
            alert("A exclusão será implementada na próxima etapa.");
        });

        celulaAcoes.append(
            botaoDetalhes,
            botaoEditar,
            botaoExcluir
        );

        linha.appendChild(celulaAcoes);
        tabelaTarefas.appendChild(linha);
    });
}

function cadastrarTarefa(evento) {
    evento.preventDefault();

    const nome = campoNome.value.trim();

    if (!nome) {
        alert("Informe o nome da tarefa.");
        campoNome.focus();
        return;
    }

    if (!campoCategoria.value || !campoStatus.value || !campoImportancia.value) {
        alert("Preencha a categoria, o status e a importância.");
        return;
    }

    const proximoIdentificador = tarefas.length > 0
        ? Math.max(...tarefas.map(tarefa => tarefa.identificador)) + 1
        : 1;

    const novaTarefa = {
        identificador: proximoIdentificador,
        nome: nome,
        descricao: campoDescricao.value.trim(),
        categoria: campoCategoria.value,
        dataConclusao: campoData.value,
        status: campoStatus.value,
        importancia: campoImportancia.value
    };

    tarefas.push(novaTarefa);

    renderizarTarefas();
    formulario.reset();

    alert("Tarefa cadastrada com sucesso!");
}

formulario.addEventListener("submit", cadastrarTarefa);

renderizarTarefas();
