document.addEventListener("DOMContentLoaded", function () {
  const paginaLogin = document.body.classList.contains("login-page");

  if (paginaLogin) {
    return;
  }

  const usuarioLogado = obterUsuarioLogado();

  if (!usuarioLogado) {
    window.location.href = "login.html";
    return;
  }

  atualizarNomeUsuario(usuarioLogado);
  configurarLogout();
});

function obterUsuarioLogado() {
  const dados = localStorage.getItem("usuarioLogado");

  if (!dados) {
    return null;
  }

  try {
    return JSON.parse(dados);
  } catch (erro) {
    localStorage.removeItem("usuarioLogado");
    return null;
  }
}

function atualizarNomeUsuario(usuario) {
  const spansUsuario = document.querySelectorAll(".user-trigger span");

  spansUsuario.forEach(function (span) {
    span.textContent = `Olá, ${usuario.name || usuario.login || "Usuário"}`;
  });

  const inputsModal = document.querySelectorAll("#modalMeusDados input");

  if (inputsModal.length >= 3) {
    inputsModal[0].value = usuario.name || "";
    inputsModal[1].value = usuario.login || "";
    inputsModal[2].value = usuario.role || "";
  }
}

function configurarLogout() {
  const linksLogout = document.querySelectorAll(".logout");

  linksLogout.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      localStorage.removeItem("usuarioLogado");
      localStorage.removeItem("usuario");
      localStorage.removeItem("user");
      localStorage.removeItem("techpaper_usuario");
      localStorage.removeItem("usuarioAtual");

      window.location.href = "login.html";
    });
  });
}
