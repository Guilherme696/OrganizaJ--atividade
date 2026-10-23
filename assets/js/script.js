
const formulario = document.querySelector("#cadastro form");
const tabelaTarefas = document.querySelector("#tarefas tbody");

const campoNome = document.querySelector("#nome");
const campoDescricao = document.querySelector("#descricao");
const campoCategoria = document.querySelector("#categoria");
const campoData = document.querySelector("#dataConclusao");
const campoStatus = document.querySelector("#status");
const campoImportancia = document.querySelector("#importancia");

const campoPesquisa = document.querySelector("#pesquisa");
const campoFiltroCategoria = document.querySelector("#filtroCategoria");
const campoOrdenacao = document.querySelector("#ordenacao");

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

let tarefas = carregarTarefas();
let identificadorEmEdicao = null;

const botaoSalvar =
    formulario.querySelector('button[type="submit"]') ||
    formulario.querySelector('input[type="submit"]') ||
    formulario.querySelector("button:not([type])");

const textoOriginalBotao = botaoSalvar
    ? (botaoSalvar.tagName === "INPUT"
        ? botaoSalvar.value
        : botaoSalvar.textContent)
    : "Cadastrar tarefa";

const botaoCancelarEdicao = document.createElement("button");
botaoCancelarEdicao.type = "button";
botaoCancelarEdicao.textContent = "Cancelar edição";
botaoCancelarEdicao.hidden = true;

if (botaoSalvar) {
    botaoSalvar.insertAdjacentElement("afterend", botaoCancelarEdicao);
}

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

    if (partes.length !== 3) {
        return data;
    }

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

function iniciarEdicao(tarefa) {
    identificadorEmEdicao = tarefa.identificador;

    campoNome.value = tarefa.nome;
    campoDescricao.value = tarefa.descricao || "";
    campoCategoria.value = tarefa.categoria;
    campoData.value = tarefa.dataConclusao || "";
    campoStatus.value = tarefa.status;
    campoImportancia.value = tarefa.importancia;

    if (botaoSalvar) {
        if (botaoSalvar.tagName === "INPUT") {
            botaoSalvar.value = "Salvar alterações";
        } else {
            botaoSalvar.textContent = "Salvar alterações";
        }
    }

    botaoCancelarEdicao.hidden = false;

    document.querySelector("#cadastro").scrollIntoView({
        behavior: "smooth"
    });

    campoNome.focus();
}

function cancelarEdicao() {
    identificadorEmEdicao = null;
    formulario.reset();

    if (botaoSalvar) {
        if (botaoSalvar.tagName === "INPUT") {
            botaoSalvar.value = textoOriginalBotao;
        } else {
            botaoSalvar.textContent = textoOriginalBotao;
        }
    }

    botaoCancelarEdicao.hidden = true;
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

    if (identificadorEmEdicao === identificador) {
        cancelarEdicao();
    }

    salvarTarefas();
    renderizarTarefas();

    alert("Tarefa excluída com sucesso!");
}

// Pesquisa, filtro e ordenação são aplicados em conjunto.
function obterTarefasFiltradas() {
    let resultado = [...tarefas];

    // Pesquisa pelo nome da tarefa.
    const pesquisa = campoPesquisa
        ? campoPesquisa.value.trim().toLowerCase()
        : "";

    if (pesquisa) {
        resultado = resultado.filter(function (tarefa) {
            return tarefa.nome.toLowerCase().includes(pesquisa);
        });
    }

    // Filtro por categoria.
    const categoriaSelecionada = campoFiltroCategoria
        ? campoFiltroCategoria.value.toLowerCase()
        : "";

    if (
        categoriaSelecionada &&
        !["todas", "todos", "todas-categorias", "todos-categorias", "todas as categorias", "todas_as_categorias"].includes(categoriaSelecionada)
    ) {
        resultado = resultado.filter(function (tarefa) {
            return tarefa.categoria.toLowerCase() === categoriaSelecionada;
        });
    }

    // Ordenação.
    const ordenacao = campoOrdenacao
        ? campoOrdenacao.value.toLowerCase()
        : "";

    if (ordenacao) {
        if (ordenacao.includes("nome")) {
            resultado.sort(function (a, b) {
                return a.nome.localeCompare(b.nome, "pt-BR");
            });
        } else if (
            ordenacao.includes("data") ||
            ordenacao.includes("conclusao")
        ) {
            resultado.sort(function (a, b) {
                const dataA = a.dataConclusao || "9999-12-31";
                const dataB = b.dataConclusao || "9999-12-31";

                return dataA.localeCompare(dataB);
            });
        } else if (
            ordenacao.includes("importancia") ||
            ordenacao.includes("prioridade")
        ) {
            const pesos = {
                alta: 3,
                media: 2,
                baixa: 1
            };

            resultado.sort(function (a, b) {
                return (pesos[b.importancia] || 0) -
                    (pesos[a.importancia] || 0);
            });
        } else if (
            ordenacao.includes("identificador") ||
            ordenacao === "id" ||
            ordenacao.includes("numero")
        ) {
            resultado.sort(function (a, b) {
                return a.identificador - b.identificador;
            });
        }
    }

    // Reconhece opções de ordenação decrescente.
    if (
        ordenacao.includes("desc") ||
        ordenacao.includes("decrescente") ||
        ordenacao.includes("maior-menor") ||
        ordenacao.includes("z-a")
    ) {
        resultado.reverse();
    }

    return resultado;
}

function renderizarTarefas() {
    tabelaTarefas.replaceChildren();

    const tarefasExibidas = obterTarefasFiltradas();

    if (tarefasExibidas.length === 0) {
        const linha = document.createElement("tr");
        const celula = criarCelula("Nenhuma tarefa encontrada.");
        celula.colSpan = 7;
        linha.appendChild(celula);
        tabelaTarefas.appendChild(linha);
        return;
    }

    tarefasExibidas.forEach(function (tarefa) {
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
            iniciarEdicao(tarefa);
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

    if (identificadorEmEdicao !== null) {
        const indice = tarefas.findIndex(function (tarefa) {
            return tarefa.identificador === identificadorEmEdicao;
        });

        if (indice !== -1) {
            tarefas[indice] = {
                identificador: identificadorEmEdicao,
                nome: nome,
                descricao: campoDescricao.value.trim(),
                categoria: campoCategoria.value,
                dataConclusao: campoData.value,
                status: campoStatus.value,
                importancia: campoImportancia.value
            };
        }

        salvarTarefas();
        cancelarEdicao();
        renderizarTarefas();

        alert("Tarefa atualizada com sucesso!");
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

    alert("Tarefa cadastrada com sucesso!");
}

// Atualiza a tabela sempre que os controles mudarem.
if (campoPesquisa) {
    campoPesquisa.addEventListener("input", renderizarTarefas);
}

if (campoFiltroCategoria) {
    campoFiltroCategoria.addEventListener("change", renderizarTarefas);
}

if (campoOrdenacao) {
    campoOrdenacao.addEventListener("change", renderizarTarefas);
}

formulario.addEventListener("submit", cadastrarTarefa);
botaoCancelarEdicao.addEventListener("click", cancelarEdicao);

renderizarTarefas();
