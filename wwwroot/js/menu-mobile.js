document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const sidebar = document.querySelector(".sidebar");
  const topbar = document.querySelector(".topbar");

  if (!body.classList.contains("dashboard-page")) return;
  if (!sidebar || !topbar) return;

  if (!document.querySelector(".mobile-menu-btn")) {
    const botaoMenu = document.createElement("button");
    botaoMenu.className = "mobile-menu-btn";
    botaoMenu.setAttribute("type", "button");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
    botaoMenu.innerHTML = '<i class="fa-solid fa-bars"></i>';

    botaoMenu.addEventListener("click", function () {
      body.classList.add("menu-mobile-aberto");
    });

    topbar.prepend(botaoMenu);
  }

  if (!document.querySelector(".mobile-topbar-logo")) {
    const logoMobile = document.createElement("div");
    logoMobile.className = "mobile-topbar-logo";
    logoMobile.innerHTML = `
    <span class="mobile-brand-badge">
        <i class="fa-solid fa-box-open"></i>
    </span>
    <span>TechPaper</span>
`;

    const botaoMenu = document.querySelector(".mobile-menu-btn");

    if (botaoMenu) {
      botaoMenu.insertAdjacentElement("afterend", logoMobile);
    }
  }

  if (!document.querySelector(".mobile-menu-overlay")) {
    const overlay = document.createElement("div");
    overlay.className = "mobile-menu-overlay";

    overlay.addEventListener("click", function () {
      body.classList.remove("menu-mobile-aberto");
    });

    sidebar.insertAdjacentElement("afterend", overlay);
  }

  const linksMenu = sidebar.querySelectorAll(".nav-links a");

  linksMenu.forEach(function (link) {
    link.addEventListener("click", function () {
      body.classList.remove("menu-mobile-aberto");
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      body.classList.remove("menu-mobile-aberto");
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1100) {
      body.classList.remove("menu-mobile-aberto");
    }
  });
});
