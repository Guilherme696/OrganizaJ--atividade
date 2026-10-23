
const formulario = document.querySelector("#cadastro form");
const tabelaTarefas = document.querySelector("#tarefas tbody");

const campoNome = document.querySelector("#nome");
const campoDescricao = document.querySelector("#descricao");
const campoCategoria = document.querySelector("#categoria");
const campoData = document.querySelector("#dataConclusao");
const campoStatus = document.querySelector("#status");
const campoImportancia = document.querySelector("#importancia");

const CHAVE_ARMAZENAMENTO = "organizaJaTarefas";

const tarefasIniciais = [
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

// Recupera as tarefas salvas ou inicia com as tarefas de exemplo.
function carregarTarefas() {
    const dadosSalvos = localStorage.getItem(CHAVE_ARMAZENAMENTO);

    if (dadosSalvos !== null) {
        try {
            const tarefasSalvas = JSON.parse(dadosSalvos);

            if (Array.isArray(tarefasSalvas)) {
                return tarefasSalvas;
            }
        } catch (erro) {
            console.error("Erro ao recuperar tarefas:", erro);
        }
    }

    localStorage.setItem(
        CHAVE_ARMAZENAMENTO,
        JSON.stringify(tarefasIniciais)
    );

    return [...tarefasIniciais];
}

let tarefas = carregarTarefas();

// Salva a lista atual no navegador.
function salvarTarefas() {
    localStorage.setItem(
        CHAVE_ARMAZENAMENTO,
        JSON.stringify(tarefas)
    );
}

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

function mostrarDetalhes(tarefa) {
    alert(
        "Detalhes da tarefa\n\n" +
        "Identificador: " + tarefa.identificador + "\n" +
        "Nome: " + tarefa.nome + "\n" +
        "Descrição: " + (tarefa.descricao || "Sem descrição") + "\n" +
        "Categoria: " + formatarCategoria(tarefa.categoria) + "\n" +
        "Data de conclusão: " + formatarData(tarefa.dataConclusao) + "\n" +
        "Status: " + formatarStatus(tarefa.status) + "\n" +
        "Importância: " + formatarImportancia(tarefa.importancia)
    );
}

function excluirTarefa(identificador) {
    const confirmar = confirm(
        "Tem certeza de que deseja excluir esta tarefa?"
    );

    if (!confirmar) {
        return;
    }

    tarefas = tarefas.filter(function (tarefa) {
        return tarefa.identificador !== identificador;
    });

    salvarTarefas();
    renderizarTarefas();

    alert("Tarefa excluída com sucesso!");
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
            mostrarDetalhes(tarefa);
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
            excluirTarefa(tarefa.identificador);
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

    if (
        !campoCategoria.value ||
        !campoStatus.value ||
        !campoImportancia.value
    ) {
        alert("Preencha a categoria, o status e a importância.");
        return;
    }

    const proximoIdentificador = tarefas.length > 0
        ? Math.max(...tarefas.map(function (tarefa) {
            return tarefa.identificador;
        })) + 1
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

    salvarTarefas();
    renderizarTarefas();
    formulario.reset();

    alert("Tarefa cadastrada e salva com sucesso!");
}

formulario.addEventListener("submit", cadastrarTarefa);

renderizarTarefas();
