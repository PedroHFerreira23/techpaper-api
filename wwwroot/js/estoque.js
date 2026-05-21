const API_PRODUTOS = "/api/produtos";

let idProdutoParaDeletar = null;

// ==========================================
// CARREGAR ESTOQUE
// ==========================================
async function carregarEstoque() {
  const tbody = document.getElementById("corpoTabelaEstoque");

  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="7" style="text-align: center; padding: 20px;">
        <i class="fa-solid fa-spinner fa-spin"></i> Carregando estoque...
      </td>
    </tr>
  `;

  try {
    const resposta = await fetch(API_PRODUTOS);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar dados da API");
    }

    const produtos = await resposta.json();

    tbody.innerHTML = "";

    if (produtos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 20px;">
            Nenhum produto cadastrado no momento.
          </td>
        </tr>
      `;
      return;
    }

    produtos.forEach((produto) => {
      let badgeClass = "badge-normal";
      let statusTexto = "Normal";

      if (produto.estoque === 0) {
        badgeClass = "badge-esgotado";
        statusTexto = "Esgotado";
      } else if (produto.estoque < 20) {
        badgeClass = "badge-baixo";
        statusTexto = "Baixo";
      }

      const precoVenda = Number(produto.precoVenda || 0)
        .toFixed(2)
        .replace(".", ",");

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><b>${produto.sku}</b></td>
        <td>${produto.nome}</td>
        <td>${produto.categoria}</td>
        <td>R$ ${precoVenda}</td>
        <td>${produto.estoque}</td>
        <td>
          <span class="status-badge ${badgeClass}">
            ${statusTexto}
          </span>
        </td>
        <td>
          <button class="btn-action" onclick="editarProduto(${produto.id})" title="Editar">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button class="btn-action" onclick="deletarProduto(${produto.id})" title="Excluir" style="color: var(--vermelho-alerta);">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (erro) {
    console.error("Erro ao carregar estoque:", erro);

    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 20px; color: red;">
          Erro ao carregar o estoque.
        </td>
      </tr>
    `;
  }
}

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

  if (tipo === "success") {
    icone = "fa-circle-check";
  }

  if (tipo === "error") {
    icone = "fa-circle-exclamation";
  }

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
// EXCLUIR PRODUTO
// ==========================================
function deletarProduto(id) {
  idProdutoParaDeletar = id;

  const modal = document.getElementById("modalExcluir");

  if (modal) {
    modal.classList.add("active");
  }
}

async function executarExclusao() {
  if (!idProdutoParaDeletar) return;

  try {
    const resposta = await fetch(`${API_PRODUTOS}/${idProdutoParaDeletar}`, {
      method: "DELETE",
    });

    if (resposta.ok) {
      fecharModal("modalExcluir");
      mostrarNotificacao("Produto excluído com sucesso!", "success");
      carregarEstoque();
    } else {
      mostrarNotificacao(
        "Erro ao excluir. Verifique se o produto possui movimentações vinculadas.",
        "error",
      );
    }
  } catch (erro) {
    console.error("Erro ao deletar:", erro);
    mostrarNotificacao("Erro de conexão com a API ao tentar excluir.", "error");
  } finally {
    idProdutoParaDeletar = null;
  }
}

// ==========================================
// MODAL
// ==========================================
function fecharModal(idModal) {
  const modal = document.getElementById(idModal);

  if (modal) {
    modal.classList.remove("active");
  }
}

// ==========================================
// EDITAR PRODUTO
// ==========================================
function editarProduto(id) {
  window.location.href = `produtos.html?id=${id}`;
}

// ==========================================
// BUSCA
// ==========================================
function filtrarEstoque() {
  const input = document.getElementById("inputBusca");

  if (!input) return;

  const termoBusca = input.value.toLowerCase();
  const linhas = document.querySelectorAll("#corpoTabelaEstoque tr");

  linhas.forEach((linha) => {
    if (linha.cells.length < 2) return;

    const sku = linha.cells[0].textContent.toLowerCase();
    const nome = linha.cells[1].textContent.toLowerCase();

    if (sku.includes(termoBusca) || nome.includes(termoBusca)) {
      linha.style.display = "";
    } else {
      linha.style.display = "none";
    }
  });
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", carregarEstoque);
