const API_LOGIN = "/api/usuarios/login";

document.addEventListener("DOMContentLoaded", function () {
  const formLogin = document.getElementById("formLogin");

  if (formLogin) {
    formLogin.addEventListener("submit", realizarLogin);
  }
});

async function realizarLogin(event) {
  event.preventDefault();

  const email = document.getElementById("emailLogin").value.trim();
  const senha = document.getElementById("senhaLogin").value.trim();

  if (email === "" || senha === "") {
    mostrarMensagemLogin("Preencha o e-mail e a senha.", "error");
    return;
  }

  const btnLogin = document.querySelector(".btn-login");
  const textoOriginal = btnLogin.innerHTML;

  btnLogin.disabled = true;
  btnLogin.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Entrando...`;

  try {
    const resposta = await fetch(API_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: email,
        password: senha,
      }),
    });

    const dados = await resposta.json().catch(() => null);

    if (!resposta.ok) {
      mostrarMensagemLogin(
        dados?.message || "Não foi possível realizar o login.",
        "error",
      );
      return;
    }

    const usuarioRecebido = dados?.usuario || dados;

    if (!usuarioRecebido) {
      mostrarMensagemLogin("A API não retornou os dados do usuário.", "error");
      return;
    }

    const usuario = {
      id: usuarioRecebido.id || usuarioRecebido.Id,
      name: usuarioRecebido.name || usuarioRecebido.Name,
      login: usuarioRecebido.login || usuarioRecebido.Login,
      role: usuarioRecebido.role || usuarioRecebido.Role,
    };

    if (!usuario.name || !usuario.login) {
      mostrarMensagemLogin(
        "Dados do usuário incompletos. Verifique o retorno da API.",
        "error",
      );
      console.log("Retorno da API:", dados);
      return;
    }

    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("usuario");
    localStorage.removeItem("user");
    localStorage.removeItem("techpaper_usuario");
    localStorage.removeItem("usuarioAtual");

    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    mostrarMensagemLogin(`Bem-vindo, ${usuario.name}!`, "success");

    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 800);
  } catch (erro) {
    console.error("Erro no login:", erro);
    mostrarMensagemLogin(
      "Erro de conexão com o servidor. Verifique se a API está aberta.",
      "error",
    );
  } finally {
    btnLogin.disabled = false;
    btnLogin.innerHTML = textoOriginal;
  }
}

function mostrarMensagemLogin(mensagem, tipo = "info") {
  const container = document.getElementById("toastContainer");

  if (!container) {
    alert(mensagem);
    return;
  }

  container.innerHTML = "";

  const toast = document.createElement("div");
  toast.className = `login-toast ${tipo}`;

  let icone = "fa-circle-info";

  if (tipo === "success") {
    icone = "fa-circle-check";
  }

  if (tipo === "error") {
    icone = "fa-circle-exclamation";
  }

  toast.innerHTML = `
        <i class="fa-solid ${icone}"></i>
        <span>${mensagem}</span>
    `;

  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add("saindo");

    setTimeout(function () {
      toast.remove();
    }, 300);
  }, 3500);
}
