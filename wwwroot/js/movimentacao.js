// ==========================================
// CONFIGURAÇÕES DAS APIs
// ==========================================
const API_MOVIMENTACOES = "/api/movimentacoes";
const API_PRODUTOS = "/api/produtos";

// ==========================================
// PEGAR USUÁRIO LOGADO
// ==========================================
function obterUsuarioLogado() {
  const chavesPossiveis = [
    "usuarioLogado",
    "usuario",
    "user",
    "techpaper_usuario",
    "usuarioAtual",
  ];

  for (const chave of chavesPossiveis) {
    const valor = localStorage.getItem(chave);

    if (!valor) continue;

    try {
      const dados = JSON.parse(valor);

      return {
        nome:
          dados.name ||
          dados.nome ||
          dados.Name ||
          dados.nomeCompleto ||
          dados.login ||
          dados.Login ||
          "Usuário do Sistema",

        usuarioId:
          dados.login ||
          dados.Login ||
          dados.id_usuario ||
          dados.idUsuario ||
          dados.Id ||
          dados.id ||
          "usuario_sistema",
      };
    } catch (erro) {
      return {
        nome: valor,
        usuarioId: valor,
      };
    }
  }

  const textoUsuario =
    document.querySelector(".user-trigger span")?.innerText || "";

  const nomeLimpo = textoUsuario.replace("Olá,", "").replace("Olá", "").trim();

  return {
    nome: nomeLimpo || "Usuário do Sistema",
    usuarioId: nomeLimpo || "usuario_sistema",
  };
}

// ==========================================
// 1. SISTEMA DE NOTIFICAÇÕES
// ==========================================
function mostrarNotificacao(mensagem, tipo = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;

  let icone = "fa-circle-info";
  if (tipo === "success") icone = "fa-circle-check";
  if (tipo === "error") icone = "fa-circle-exclamation";

  toast.innerHTML = `<i class="fa-solid ${icone}"></i> ${mensagem}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOutToast 0.4s forwards";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ==========================================
// 2. PREENCHER O DROPDOWN DE PRODUTOS
// ==========================================
async function carregarProdutosSelect() {
  const select = document.getElementById("produtoSelect");
  if (!select) return;

  try {
    const resposta = await fetch(API_PRODUTOS);

    if (resposta.ok) {
      const produtos = await resposta.json();

      select.innerHTML =
        '<option value="" disabled selected>Selecione o produto...</option>';

      produtos.forEach((p) => {
        const option = document.createElement("option");

        option.value = p.id;
        option.textContent = `${p.sku} - ${p.nome} (Estoque atual: ${p.estoque})`;

        select.appendChild(option);
      });
    }
  } catch (erro) {
    console.error("Erro ao buscar produtos:", erro);
    select.innerHTML =
      '<option value="" disabled selected>Erro ao carregar produtos</option>';
  }
}

// ==========================================
// 3. REGISTRAR NOVA MOVIMENTAÇÃO
// ==========================================
async function registrarMovimentacao(event) {
  event.preventDefault();

  const btnSubmit = event.target.querySelector(".btn-submit");
  const textoOriginal = btnSubmit.innerHTML;

  btnSubmit.disabled = true;
  btnSubmit.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';
  btnSubmit.style.opacity = "0.7";

  const usuario = obterUsuarioLogado();

  const dados = {
    tipo: document.getElementById("tipoMovimentacao").value,
    produtoId: parseInt(document.getElementById("produtoSelect").value),
    quantidade: parseInt(
      document.getElementById("quantidadeMovimentacao").value,
    ),
    motivo:
      document.getElementById("motivoMovimentacao").value || "Não informado",

    // CAMPOS NOVOS PARA RASTREIO
    responsavel: usuario.nome,
    usuarioId: usuario.usuarioId,
  };

  try {
    const resposta = await fetch(API_MOVIMENTACOES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (resposta.ok) {
      mostrarNotificacao("Movimentação registrada com sucesso!", "success");

      document.getElementById("formMovimentacao").reset();

      carregarHistoricoMovimentacoes();
      carregarProdutosSelect();
    } else {
      const erroData = await resposta.text();
      mostrarNotificacao(erroData, "error");
    }
  } catch (erro) {
    console.error("Erro:", erro);
    mostrarNotificacao("Erro de conexão com o servidor.", "error");
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = textoOriginal;
    btnSubmit.style.opacity = "1";
  }
}

// ==========================================
// 4. CARREGAR HISTÓRICO NA TABELA
// ==========================================
async function carregarHistoricoMovimentacoes() {
  const tbody = document.getElementById("corpoTabelaMovimentacao");
  if (!tbody) return;

  tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center; padding: 20px;">
                <i class="fa-solid fa-spinner fa-spin"></i> Carregando histórico...
            </td>
        </tr>
    `;

  try {
    const resposta = await fetch(API_MOVIMENTACOES);

    if (!resposta.ok) {
      throw new Error("Erro na API");
    }

    const movimentacoes = await resposta.json();
    tbody.innerHTML = "";

    if (movimentacoes.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px;">
                        Nenhuma movimentação registrada hoje.
                    </td>
                </tr>
            `;
      return;
    }

    movimentacoes.forEach((m) => {
      const dataObjeto = new Date(m.dataHora);

      const dataFormatada =
        dataObjeto.toLocaleDateString("pt-BR") +
        " - " +
        dataObjeto.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

      let badgeHTML = "";
      let sinalMatematico = "";

      if (m.tipo === "Entrada") {
        badgeHTML = `
                    <span class="status-badge" style="background-color: #e8f8f5; color: #27ae60;">
                        <i class="fa-solid fa-arrow-down"></i> Entrada
                    </span>
                `;

        sinalMatematico = "+";
      } else {
        badgeHTML = `
                    <span class="status-badge" style="background-color: #fceceb; color: var(--vermelho-alerta);">
                        <i class="fa-solid fa-arrow-up"></i> Saída
                    </span>
                `;

        sinalMatematico = "-";
      }

      const responsavel =
        m.responsavel ||
        m.Responsavel ||
        m.usuarioId ||
        m.UsuarioId ||
        "Não identificado";

      const tr = document.createElement("tr");

      tr.innerHTML = `
                <td>${dataFormatada}</td>
                <td><b>${m.produtoNome || m.ProdutoNome}</b></td>
                <td>${badgeHTML}</td>
                <td style="font-weight: bold;">${sinalMatematico}${m.quantidade || m.Quantidade}</td>
                <td>${m.motivo || m.Motivo}</td>
                <td>${responsavel}</td>
            `;

      tbody.appendChild(tr);
    });
  } catch (erro) {
    console.error("Erro histórico:", erro);

    tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: red;">
                    Erro ao carregar o histórico.
                </td>
            </tr>
        `;
  }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  carregarProdutosSelect();
  carregarHistoricoMovimentacoes();

  const form = document.getElementById("formMovimentacao");

  if (form) {
    form.addEventListener("submit", registrarMovimentacao);
  }
});
