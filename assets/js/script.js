"use strict";

const CHAVE_ARMAZENAMENTO = "organizaJaTarefas";

const formulario = document.querySelector("#formTarefa");
const campoIdentificador = document.querySelector("#identificador");
const campoNome = document.querySelector("#nome");
const campoDescricao = document.querySelector("#descricao");
const campoCategoria = document.querySelector("#categoria");
const campoData = document.querySelector("#dataConclusao");
const campoStatus = document.querySelector("#status");
const campoImportancia = document.querySelector("#importancia");

const tituloFormulario = document.querySelector("#tituloFormulario");
const botaoSalvar = document.querySelector("#botaoSalvar");
const botaoCancelarEdicao = document.querySelector("#botaoCancelarEdicao");
const mensagemFormulario = document.querySelector("#mensagemFormulario");

const campoPesquisa = document.querySelector("#pesquisa");
const campoFiltroCategoria = document.querySelector("#filtroCategoria");
const campoFiltroStatus = document.querySelector("#filtroStatus");
const campoOrdenacao = document.querySelector("#ordenacao");

const listaTarefas = document.querySelector("#listaTarefas");
const mensagemLista = document.querySelector("#mensagemLista");

const totalTarefas = document.querySelector("#totalTarefas");
const totalPendentes = document.querySelector("#totalPendentes");
const totalConcluidas = document.querySelector("#totalConcluidas");

const conteudoDetalhes = document.querySelector("#conteudoDetalhes");

const tarefasIniciais = [
    {
        id: 1,
        nome: "Estudar HTML",
        descricao: "Revisar a estrutura das páginas HTML e seus elementos.",
        categoria: "Estudos",
        dataConclusao: "2026-10-25",
        status: "Pendente",
        importancia: "Alta"
    },
    {
        id: 2,
        nome: "Fazer trabalho da faculdade",
        descricao: "Avançar nas atividades e trabalhos da faculdade.",
        categoria: "Estudos",
        dataConclusao: "2026-10-28",
        status: "Em andamento",
        importancia: "Alta"
    },
    {
        id: 3,
        nome: "Organizar documentos",
        descricao: "Separar e organizar os documentos pessoais.",
        categoria: "Pessoal",
        dataConclusao: "2026-10-30",
        status: "Pendente",
        importancia: "Média"
    }
];

let tarefas = carregarTarefas();

function carregarTarefas() {
    try {
        const dadosSalvos = localStorage.getItem(CHAVE_ARMAZENAMENTO);

        if (dadosSalvos === null) {
            localStorage.setItem(
                CHAVE_ARMAZENAMENTO,
                JSON.stringify(tarefasIniciais)
            );

            return tarefasIniciais.map(tarefa => ({ ...tarefa }));
        }

        const tarefasSalvas = JSON.parse(dadosSalvos);

        if (!Array.isArray(tarefasSalvas)) {
            throw new Error("Os dados armazenados não são válidos.");
        }

        return tarefasSalvas.filter(tarefa =>
            tarefa &&
            Number.isInteger(tarefa.id) &&
            typeof tarefa.nome === "string" &&
            typeof tarefa.descricao === "string" &&
            typeof tarefa.categoria === "string" &&
            typeof tarefa.dataConclusao === "string" &&
            typeof tarefa.status === "string" &&
            typeof tarefa.importancia === "string"
        );
    } catch (erro) {
        console.error("Erro ao carregar as tarefas:", erro);

        return tarefasIniciais.map(tarefa => ({ ...tarefa }));
    }
}

function salvarTarefas() {
    try {
        localStorage.setItem(
            CHAVE_ARMAZENAMENTO,
            JSON.stringify(tarefas)
        );

        return true;
    } catch (erro) {
        console.error("Erro ao salvar as tarefas:", erro);
        mostrarMensagem(
            "Não foi possível salvar os dados neste navegador.",
            "erro"
        );

        return false;
    }
}

function mostrarMensagem(texto, tipo = "") {
    mensagemFormulario.textContent = texto;
    mensagemFormulario.className = "mensagem";

    if (tipo) {
        mensagemFormulario.classList.add(tipo);
    }
}

function formatarData(data) {
    if (!data) {
        return "Não informada";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function criarElemento(tag, texto, classe = "") {
    const elemento = document.createElement(tag);

    if (texto !== undefined && texto !== null) {
        elemento.textContent = texto;
    }

    if (classe) {
        elemento.className = classe;
    }

    return elemento;
}

function criarBotao(texto, classe, acao, id) {
    const botao = criarElemento("button", texto, `botao botao-pequeno ${classe}`);

    botao.type = "button";
    botao.dataset.acao = acao;
    botao.dataset.id = String(id);

    return botao;
}

function obterProximoId() {
    if (tarefas.length === 0) {
        return 1;
    }

    return Math.max(...tarefas.map(tarefa => tarefa.id)) + 1;
}

function cadastrarTarefa(evento) {
    evento.preventDefault();

    if (!formulario.reportValidity()) {
        return;
    }

    const nome = campoNome.value.trim();
    const descricao = campoDescricao.value.trim();
    const categoria = campoCategoria.value;
    const dataConclusao = campoData.value;
    const status = campoStatus.value;
    const importancia = campoImportancia.value;

    if (!nome || !descricao) {
        mostrarMensagem(
            "Preencha o nome e a descrição da tarefa.",
            "erro"
        );
        return;
    }

    const identificador = campoIdentificador.value;

    if (identificador) {
        const id = Number(identificador);
        const indice = tarefas.findIndex(tarefa => tarefa.id === id);

        if (indice === -1) {
            mostrarMensagem(
                "Não foi possível encontrar a tarefa para edição.",
                "erro"
            );
            cancelarEdicao();
            return;
        }

        const tarefaAnterior = tarefas[indice];

        tarefas[indice] = {
            id,
            nome,
            descricao,
            categoria,
            dataConclusao,
            status,
            importancia
        };

        if (!salvarTarefas()) {
            tarefas[indice] = tarefaAnterior;
            return;
        }

        cancelarEdicao();
        mostrarMensagem("Tarefa atualizada com sucesso!", "sucesso");
    } else {
        const novaTarefa = {
            id: obterProximoId(),
            nome,
            descricao,
            categoria,
            dataConclusao,
            status,
            importancia
        };

        tarefas.push(novaTarefa);

        if (!salvarTarefas()) {
            tarefas.pop();
            return;
        }

        formulario.reset();
        campoStatus.value = "Pendente";
        campoImportancia.value = "Média";

        mostrarMensagem("Tarefa cadastrada com sucesso!", "sucesso");
    }

    renderizarTarefas();
}

formulario.addEventListener("submit", cadastrarTarefa);

function iniciarEdicao(id) {
    const tarefa = tarefas.find(item => item.id === id);

    if (!tarefa) {
        mostrarMensagem("Tarefa não encontrada.", "erro");
        return;
    }

    campoIdentificador.value = tarefa.id;
    campoNome.value = tarefa.nome;
    campoDescricao.value = tarefa.descricao;
    campoCategoria.value = tarefa.categoria;
    campoData.value = tarefa.dataConclusao;
    campoStatus.value = tarefa.status;
    campoImportancia.value = tarefa.importancia;

    tituloFormulario.textContent = "Editar tarefa";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelarEdicao.hidden = false;

    mostrarMensagem("Altere os campos e salve as modificações.");

    document.querySelector("#cadastro").scrollIntoView({
        behavior: "smooth"
    });

    campoNome.focus();
}

function cancelarEdicao() {
    formulario.reset();

    campoIdentificador.value = "";
    campoStatus.value = "Pendente";
    campoImportancia.value = "Média";

    tituloFormulario.textContent = "Cadastrar nova tarefa";
    botaoSalvar.textContent = "Cadastrar tarefa";
    botaoCancelarEdicao.hidden = true;

    mostrarMensagem("");
}

botaoCancelarEdicao.addEventListener("click", cancelarEdicao);

function excluirTarefa(id) {
    const tarefa = tarefas.find(item => item.id === id);

    if (!tarefa) {
        mostrarMensagem("Tarefa não encontrada.", "erro");
        return;
    }

    const confirmou = window.confirm(
        `Deseja realmente excluir a tarefa "${tarefa.nome}"?`
    );

    if (!confirmou) {
        return;
    }

    const tarefasAnteriores = [...tarefas];

    tarefas = tarefas.filter(item => item.id !== id);

    if (!salvarTarefas()) {
        tarefas = tarefasAnteriores;
        return;
    }

    if (Number(campoIdentificador.value) === id) {
        cancelarEdicao();
    }

    conteudoDetalhes.replaceChildren(
        criarElemento("p", "Nenhuma tarefa selecionada.")
    );

    renderizarTarefas();
    mostrarMensagem("Tarefa excluída com sucesso!", "sucesso");
}

function mostrarDetalhes(id) {
    const tarefa = tarefas.find(item => item.id === id);

    if (!tarefa) {
        return;
    }

    conteudoDetalhes.replaceChildren();

    conteudoDetalhes.append(
        criarElemento("h3", tarefa.nome),
        criarElemento("p", `Identificador: ${tarefa.id}`),
        criarElemento("p", `Descrição: ${tarefa.descricao}`),
        criarElemento("p", `Categoria: ${tarefa.categoria}`),
        criarElemento("p", `Data de conclusão: ${formatarData(tarefa.dataConclusao)}`),
        criarElemento("p", `Status: ${tarefa.status}`),
        criarElemento("p", `Importância: ${tarefa.importancia}`)
    );

    document.querySelector("#detalhes").scrollIntoView({
        behavior: "smooth"
    });
}

function obterTarefasFiltradas() {
    const pesquisa = campoPesquisa.value.trim().toLocaleLowerCase("pt-BR");
    const categoria = campoFiltroCategoria.value;
    const status = campoFiltroStatus.value;
    const ordenacao = campoOrdenacao.value;

    const resultado = tarefas.filter(tarefa => {
        const correspondePesquisa =
            tarefa.nome.toLocaleLowerCase("pt-BR").includes(pesquisa) ||
            tarefa.descricao.toLocaleLowerCase("pt-BR").includes(pesquisa);

        const correspondeCategoria =
            categoria === "" || tarefa.categoria === categoria;

        const correspondeStatus =
            status === "" || tarefa.status === status;

        return correspondePesquisa &&
            correspondeCategoria &&
            correspondeStatus;
    });

    const importanciaOrdem = {
        "Baixa": 1,
        "Média": 2,
        "Alta": 3
    };

    resultado.sort((a, b) => {
        switch (ordenacao) {
            case "data-asc":
                return a.dataConclusao.localeCompare(b.dataConclusao);

            case "data-desc":
                return b.dataConclusao.localeCompare(a.dataConclusao);

            case "nome-asc":
                return a.nome.localeCompare(b.nome, "pt-BR");

            case "nome-desc":
                return b.nome.localeCompare(a.nome, "pt-BR");

            case "importancia-asc":
                return importanciaOrdem[a.importancia] -
                    importanciaOrdem[b.importancia];

            case "importancia-desc":
                return importanciaOrdem[b.importancia] -
                    importanciaOrdem[a.importancia];

            case "id-asc":
                return a.id - b.id;

            case "id-desc":
                return b.id - a.id;

            default:
                return 0;
        }
    });

    return resultado;
}

campoPesquisa.addEventListener("input", renderizarTarefas);
campoFiltroCategoria.addEventListener("change", renderizarTarefas);
campoFiltroStatus.addEventListener("change", renderizarTarefas);
campoOrdenacao.addEventListener("change", renderizarTarefas);

function renderizarTarefas() {
    const tarefasExibidas = obterTarefasFiltradas();

    listaTarefas.replaceChildren();

    totalTarefas.textContent = tarefas.length;
    totalPendentes.textContent = tarefas.filter(
        tarefa => tarefa.status === "Pendente"
    ).length;
    totalConcluidas.textContent = tarefas.filter(
        tarefa => tarefa.status === "Concluída"
    ).length;

    mensagemLista.hidden = tarefasExibidas.length > 0;

    tarefasExibidas.forEach(tarefa => {
        const linha = document.createElement("tr");

        const celulaNome = document.createElement("td");
        celulaNome.append(
            criarElemento("strong", tarefa.nome),
            document.createElement("br"),
            criarElemento("small", tarefa.descricao)
        );

        const celulaCategoria = criarElemento("td", tarefa.categoria);
        const celulaData = criarElemento("td", formatarData(tarefa.dataConclusao));

        const celulaStatus = document.createElement("td");
        let classeStatus = "status-pendente";

        if (tarefa.status === "Em andamento") {
            classeStatus = "status-andamento";
        } else if (tarefa.status === "Concluída") {
            classeStatus = "status-concluida";
        }

        celulaStatus.append(
            criarElemento("span", tarefa.status, `status ${classeStatus}`)
        );

        const celulaImportancia = document.createElement("td");
        const classesImportancia = {
            "Baixa": "importancia-baixa",
            "Média": "importancia-media",
            "Alta": "importancia-alta"
        };

        celulaImportancia.append(
            criarElemento(
                "span",
                tarefa.importancia,
                `importancia ${classesImportancia[tarefa.importancia] || ""}`
            )
        );

        const celulaAcoes = document.createElement("td");
        const grupoAcoes = criarElemento("div", undefined, "acoes-tarefa");

        grupoAcoes.append(
            criarBotao("Detalhes", "botao-detalhes", "detalhes", tarefa.id),
            criarBotao("Editar", "botao-editar", "editar", tarefa.id),
            criarBotao("Excluir", "botao-excluir", "excluir", tarefa.id)
        );

        celulaAcoes.append(grupoAcoes);

        linha.append(
            celulaNome,
            celulaCategoria,
            celulaData,
            celulaStatus,
            celulaImportancia,
            celulaAcoes
        );

        listaTarefas.append(linha);
    });
}

listaTarefas.addEventListener("click", evento => {
    const botao = evento.target.closest("button[data-acao]");

    if (!botao) {
        return;
    }

    const id = Number(botao.dataset.id);
    const acao = botao.dataset.acao;

    if (!Number.isInteger(id)) {
        return;
    }

    if (acao === "detalhes") {
        mostrarDetalhes(id);
    } else if (acao === "editar") {
        iniciarEdicao(id);
    } else if (acao === "excluir") {
        excluirTarefa(id);
    }
});

const botaoCarregarFrase = document.querySelector("#carregarFrase");
const textoFrase = document.querySelector("#textoFrase");
const autorFrase = document.querySelector("#autorFrase");
const estadoFrase = document.querySelector("#estadoFrase");

async function carregarFraseMotivacional() {
    botaoCarregarFrase.disabled = true;
    estadoFrase.textContent = "Carregando frase...";
    estadoFrase.className = "mensagem";

    try {
        const resposta = await fetch("https://dummyjson.com/quotes/random");

        if (!resposta.ok) {
            throw new Error("Não foi possível consultar a API.");
        }

        const dados = await resposta.json();

        if (
            typeof dados.quote !== "string" ||
            typeof dados.author !== "string" ||
            !dados.quote.trim() ||
            !dados.author.trim()
        ) {
            throw new Error("A API retornou dados inválidos.");
        }

        textoFrase.textContent = dados.quote;
        autorFrase.textContent = `— ${dados.author}`;
        estadoFrase.textContent = "Frase carregada com sucesso!";
        estadoFrase.classList.add("sucesso");
    } catch (erro) {
        console.error("Erro ao carregar frase:", erro);

        textoFrase.textContent =
            "Não foi possível carregar a frase agora. Tente novamente.";

        autorFrase.textContent = "";
        estadoFrase.textContent =
            "Verifique sua conexão com a internet e tente novamente.";
        estadoFrase.classList.add("erro");
    } finally {
        botaoCarregarFrase.disabled = false;
    }
}

botaoCarregarFrase.addEventListener("click", carregarFraseMotivacional);
renderizarTarefas();
