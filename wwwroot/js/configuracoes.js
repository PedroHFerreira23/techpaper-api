document.addEventListener("DOMContentLoaded", function () {
  const chaveConfig = "techpaper_configuracoes";

  const configuracaoPadrao = {
    fonteAumentada: false,
    reduzirAnimacoes: false,
    tabelasCompactas: false,
  };

  function carregarConfiguracoes() {
    const dadosSalvos = localStorage.getItem(chaveConfig);

    if (!dadosSalvos) {
      return configuracaoPadrao;
    }

    try {
      return {
        ...configuracaoPadrao,
        ...JSON.parse(dadosSalvos),
      };
    } catch (erro) {
      return configuracaoPadrao;
    }
  }

  function salvarConfiguracoes(configuracoes) {
    localStorage.setItem(chaveConfig, JSON.stringify(configuracoes));
  }

  function aplicarConfiguracoes() {
    const config = carregarConfiguracoes();

    document.body.classList.toggle("fonte-aumentada", config.fonteAumentada);
    document.body.classList.toggle(
      "reduzir-animacoes",
      config.reduzirAnimacoes,
    );
    document.body.classList.toggle(
      "tabelas-compactas",
      config.tabelasCompactas,
    );
  }

  function montarModalConfiguracoes() {
    const modalConfig = document.querySelector("#modalConfig .modal-content");

    if (!modalConfig) {
      return;
    }

    const config = carregarConfiguracoes();

    modalConfig.innerHTML = `
            <button class="modal-close" onclick="fecharModal('modalConfig')">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <h2 class="modal-title config-title">
                <i class="fa-solid fa-gear"></i>
                Configurações
            </h2>

            <p class="config-subtitle">
                Personalize a visualização e a acessibilidade do sistema.
            </p>

            <div class="config-section">
                <h3>
                    <i class="fa-solid fa-eye"></i>
                    Acessibilidade
                </h3>

                <label class="config-option">
                    <div>
                        <strong>Aumentar tamanho da fonte</strong>
                        <span>Melhora a leitura em telas menores.</span>
                    </div>

                    <input type="checkbox" id="configFonteAumentada" ${config.fonteAumentada ? "checked" : ""}>
                </label>

                <label class="config-option">
                    <div>
                        <strong>Reduzir animações</strong>
                        <span>Remove movimentos exagerados dos cards e botões.</span>
                    </div>

                    <input type="checkbox" id="configReduzirAnimacoes" ${config.reduzirAnimacoes ? "checked" : ""}>
                </label>
            </div>

            <div class="config-section">
                <h3>
                    <i class="fa-solid fa-table"></i>
                    Exibição
                </h3>

                <label class="config-option">
                    <div>
                        <strong>Usar tabelas compactas</strong>
                        <span>Reduz espaçamentos para mostrar mais informações.</span>
                    </div>

                    <input type="checkbox" id="configTabelasCompactas" ${config.tabelasCompactas ? "checked" : ""}>
                </label>
            </div>

            <button class="btn-submit btn-full btn-center mt-20" id="btnSalvarConfiguracoes">
    <i class="fa-solid fa-check"></i>
    Aplicar Alterações
</button>

            <p id="configStatus" class="config-status"></p>
        `;

    const btnSalvar = document.getElementById("btnSalvarConfiguracoes");

    btnSalvar.addEventListener("click", function () {
      const novasConfiguracoes = {
        fonteAumentada: document.getElementById("configFonteAumentada").checked,
        reduzirAnimacoes: document.getElementById("configReduzirAnimacoes")
          .checked,
        tabelasCompactas: document.getElementById("configTabelasCompactas")
          .checked,
      };

      salvarConfiguracoes(novasConfiguracoes);
      aplicarConfiguracoes();

      const status = document.getElementById("configStatus");
      status.textContent = "Configurações salvas com sucesso!";

      setTimeout(function () {
        status.textContent = "";
      }, 2500);
    });
  }

  aplicarConfiguracoes();
  montarModalConfiguracoes();
});
