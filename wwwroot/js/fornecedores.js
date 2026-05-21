const API_FORNECEDORES = "/api/fornecedores";

let listaFornecedores = [];
let idFornecedorParaExcluir = null;

// ==========================================
// NOTIFICAÇÃO
// ==========================================
function mostrarNotificacao(mensagem, tipo = "info") {
  const container = document.getElementById("toastContainer");

  if (!container) {
    alert(mensagem);
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;

  let icone = "fa-circle-info";

  if (tipo === "success") icone = "fa-circle-check";
  if (tipo === "error") icone = "fa-circle-exclamation";

  toast.innerHTML = `
    <i class="fa-solid ${icone}" style="font-size: 18px;"></i>
    ${mensagem}
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOutToast 0.4s forwards";

    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

// ==========================================
// CARREGAR FORNECEDORES
// ==========================================
async function carregarFornecedores() {
  const tbody = document.getElementById("corpoTabelaFornecedores");

  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align: center; padding: 20px;">
        <i class="fa-solid fa-spinner fa-spin"></i> Carregando fornecedores...
      </td>
    </tr>
  `;

  try {
    const resposta = await fetch(API_FORNECEDORES);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar fornecedores.");
    }

    const fornecedores = await resposta.json();

    listaFornecedores = fornecedores;
    renderizarFornecedores(fornecedores);
  } catch (erro) {
    console.error("Erro ao carregar fornecedores:", erro);

    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 20px; color: red;">
          Erro ao carregar lista.
        </td>
      </tr>
    `;
  }
}

// ==========================================
// RENDERIZAR TABELA
// ==========================================
function renderizarFornecedores(fornecedores) {
  const tbody = document.getElementById("corpoTabelaFornecedores");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (!fornecedores || fornecedores.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 20px;">
          Nenhum fornecedor cadastrado.
        </td>
      </tr>
    `;
    return;
  }

  fornecedores.forEach((fornecedor) => {
    const id = fornecedor.id || fornecedor.Id;
    const cnpj = fornecedor.cnpj || fornecedor.Cnpj || "";
    const razaoSocial = fornecedor.razaoSocial || fornecedor.RazaoSocial || "";
    const nomeFantasia =
      fornecedor.nomeFantasia || fornecedor.NomeFantasia || "";
    const segmento = fornecedor.segmento || fornecedor.Segmento || "";
    const telefone = fornecedor.telefone || fornecedor.Telefone || "";
    const email = fornecedor.email || fornecedor.Email || "";

    const nomeEmpresa = nomeFantasia || razaoSocial;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${cnpj}</td>
      <td><b>${nomeEmpresa}</b></td>
      <td>${segmento}</td>
      <td>${telefone}</td>
      <td>${email}</td>
      <td>
        <button class="btn-action" onclick="editarFornecedor(${id})" title="Editar">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>

        <button class="btn-action" onclick="deletarFornecedor(${id})" title="Excluir" style="color: var(--vermelho-alerta);">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ==========================================
// CADASTRAR FORNECEDOR
// ==========================================
async function cadastrarFornecedor(event) {
  event.preventDefault();

  const dados = {
    cnpj: document.getElementById("cnpj").value.trim(),
    razaoSocial: document.getElementById("razaoSocial").value.trim(),
    nomeFantasia: document.getElementById("nomeFantasia").value.trim(),
    segmento: document.getElementById("categoriaFornecedor").value,
    telefone: document.getElementById("telefone").value.trim(),
    email: document.getElementById("emailContato").value.trim(),
    prazoEntregaDias: parseInt(document.getElementById("prazoEntrega").value),
  };

  try {
    const resposta = await fetch(API_FORNECEDORES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao cadastrar fornecedor.");
    }

    mostrarNotificacao("Fornecedor cadastrado com sucesso!", "success");

    document.getElementById("formCadastroFornecedor").reset();

    carregarFornecedores();
  } catch (erro) {
    console.error("Erro ao cadastrar fornecedor:", erro);
    mostrarNotificacao("Erro ao cadastrar fornecedor.", "error");
  }
}

// ==========================================
// EDITAR FORNECEDOR
// ==========================================
function editarFornecedor(id) {
  const fornecedor = listaFornecedores.find((f) => {
    return (f.id || f.Id) === id;
  });

  if (!fornecedor) {
    mostrarNotificacao("Fornecedor não encontrado para edição.", "error");
    return;
  }

  document.getElementById("cnpj").value =
    fornecedor.cnpj || fornecedor.Cnpj || "";
  document.getElementById("razaoSocial").value =
    fornecedor.razaoSocial || fornecedor.RazaoSocial || "";
  document.getElementById("nomeFantasia").value =
    fornecedor.nomeFantasia || fornecedor.NomeFantasia || "";
  document.getElementById("categoriaFornecedor").value =
    fornecedor.segmento || fornecedor.Segmento || "";
  document.getElementById("telefone").value =
    fornecedor.telefone || fornecedor.Telefone || "";
  document.getElementById("emailContato").value =
    fornecedor.email || fornecedor.Email || "";
  document.getElementById("prazoEntrega").value =
    fornecedor.prazoEntregaDias || fornecedor.PrazoEntregaDias || "";

  const form = document.getElementById("formCadastroFornecedor");

  form.dataset.editandoId = id;

  const botao = form.querySelector(".btn-submit");

  if (botao) {
    botao.innerHTML = `
      <i class="fa-solid fa-floppy-disk"></i>
      Atualizar Fornecedor
    `;
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// ==========================================
// SALVAR OU ATUALIZAR
// ==========================================
async function salvarOuAtualizarFornecedor(event) {
  event.preventDefault();

  const form = document.getElementById("formCadastroFornecedor");
  const idEditando = form.dataset.editandoId;

  const dados = {
    cnpj: document.getElementById("cnpj").value.trim(),
    razaoSocial: document.getElementById("razaoSocial").value.trim(),
    nomeFantasia: document.getElementById("nomeFantasia").value.trim(),
    segmento: document.getElementById("categoriaFornecedor").value,
    telefone: document.getElementById("telefone").value.trim(),
    email: document.getElementById("emailContato").value.trim(),
    prazoEntregaDias: parseInt(document.getElementById("prazoEntrega").value),
  };

  try {
    let resposta;

    if (idEditando) {
      resposta = await fetch(`${API_FORNECEDORES}/${idEditando}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });
    } else {
      resposta = await fetch(API_FORNECEDORES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });
    }

    if (!resposta.ok) {
      throw new Error("Erro ao salvar fornecedor.");
    }

    mostrarNotificacao(
      idEditando
        ? "Fornecedor atualizado com sucesso!"
        : "Fornecedor cadastrado com sucesso!",
      "success",
    );

    form.reset();
    delete form.dataset.editandoId;

    const botao = form.querySelector(".btn-submit");

    if (botao) {
      botao.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Salvar Fornecedor
      `;
    }

    carregarFornecedores();
  } catch (erro) {
    console.error("Erro ao salvar fornecedor:", erro);
    mostrarNotificacao("Erro ao salvar fornecedor.", "error");
  }
}

// ==========================================
// EXCLUIR FORNECEDOR
// ==========================================
function deletarFornecedor(id) {
  idFornecedorParaExcluir = id;

  const modal = document.getElementById("modalExcluir");

  if (modal) {
    modal.classList.add("active");
  }
}

async function executarExclusaoFornecedor() {
  if (!idFornecedorParaExcluir) return;

  try {
    const resposta = await fetch(
      `${API_FORNECEDORES}/${idFornecedorParaExcluir}`,
      {
        method: "DELETE",
      },
    );

    if (!resposta.ok) {
      throw new Error("Erro ao excluir fornecedor.");
    }

    fecharModal("modalExcluir");

    mostrarNotificacao("Fornecedor excluído com sucesso!", "success");

    carregarFornecedores();
  } catch (erro) {
    console.error("Erro ao excluir fornecedor:", erro);
    mostrarNotificacao("Erro ao excluir fornecedor.", "error");
  } finally {
    idFornecedorParaExcluir = null;
  }
}

// ==========================================
// FECHAR MODAL
// ==========================================
function fecharModal(idModal) {
  const modal = document.getElementById(idModal);

  if (modal) {
    modal.classList.remove("active");
  }
}

// ==========================================
// BUSCA
// ==========================================
function filtrarFornecedores() {
  const input = document.getElementById("buscaFornecedor");

  if (!input) return;

  const termo = input.value.toLowerCase();

  const filtrados = listaFornecedores.filter((fornecedor) => {
    const cnpj = (fornecedor.cnpj || fornecedor.Cnpj || "").toLowerCase();
    const razaoSocial = (
      fornecedor.razaoSocial ||
      fornecedor.RazaoSocial ||
      ""
    ).toLowerCase();
    const nomeFantasia = (
      fornecedor.nomeFantasia ||
      fornecedor.NomeFantasia ||
      ""
    ).toLowerCase();
    const segmento = (
      fornecedor.segmento ||
      fornecedor.Segmento ||
      ""
    ).toLowerCase();
    const email = (fornecedor.email || fornecedor.Email || "").toLowerCase();

    return (
      cnpj.includes(termo) ||
      razaoSocial.includes(termo) ||
      nomeFantasia.includes(termo) ||
      segmento.includes(termo) ||
      email.includes(termo)
    );
  });

  renderizarFornecedores(filtrados);
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  carregarFornecedores();

  const form = document.getElementById("formCadastroFornecedor");

  if (form) {
    form.addEventListener("submit", salvarOuAtualizarFornecedor);
  }
});
