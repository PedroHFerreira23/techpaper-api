document.addEventListener("DOMContentLoaded", function () {
  adicionarAreaRastreioRelatorio();
  atualizarRastreioRelatorio();

  const gerarOriginal = window.gerarRelatorio;

  if (typeof gerarOriginal === "function") {
    window.gerarRelatorio = function () {
      gerarOriginal();

      setTimeout(function () {
        atualizarRastreioRelatorio();
      }, 100);
    };
  }

  window.exportarPDF = function () {
    atualizarRastreioRelatorio();

    const titulo =
      document.getElementById("tituloResultado")?.innerText ||
      "Relatório Gerencial";
    const tabela = document.getElementById("tabelaRelatorio");
    const rastreio = obterDadosRastreio();

    if (!tabela) {
      alert("Nenhuma tabela encontrada para exportar.");
      return;
    }

    const janela = window.open("", "_blank");

    janela.document.write(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>${titulo}</title>

                <style>
                    * {
                        box-sizing: border-box;
                        font-family: Arial, sans-serif;
                    }

                    body {
                        margin: 30px;
                        color: #333;
                        background: #fff;
                    }

                    .cabecalho {
                        text-align: center;
                        margin-bottom: 25px;
                    }

                    .cabecalho h1 {
                        color: #1565c0;
                        font-size: 22px;
                        margin-bottom: 5px;
                    }

                    .cabecalho h2 {
                        color: #525c6c;
                        font-size: 16px;
                        margin: 0;
                    }

                    .rastreio {
                        border: 1px solid #d9e6f7;
                        background: #f7fbff;
                        border-radius: 8px;
                        padding: 12px;
                        margin-bottom: 18px;
                        font-size: 12px;
                    }

                    .rastreio p {
                        margin: 4px 0;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 11px;
                    }

                    th {
                        background: #1565c0;
                        color: #fff;
                        padding: 8px;
                        border: 1px solid #d9d9d9;
                        text-align: left;
                    }

                    td {
                        padding: 7px;
                        border: 1px solid #d9d9d9;
                        text-align: left;
                    }

                    tr:nth-child(even) td {
                        background: #f8f9fa;
                    }

                    .rodape {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 11px;
                        color: #777;
                    }

                    @page {
                        size: A4 portrait;
                        margin: 18mm;
                    }

                    @media print {
                        body {
                            margin: 0;
                        }
                    }
                </style>
            </head>

            <body>
                <div class="cabecalho">
                    <h1>TechPaper - Sistema de Gestão</h1>
                    <h2>${titulo}</h2>
                </div>

                <div class="rastreio">
                    <p><strong>Usuário responsável:</strong> ${rastreio.usuario}</p>
                    <p><strong>id_usuario:</strong> ${rastreio.idUsuario}</p>
                    <p><strong>Data de emissão:</strong> ${rastreio.data}</p>
                </div>

                ${tabela.outerHTML}

                <div class="rodape">
                    Relatório gerado pelo sistema TechPaper.
                </div>

                <script>
                    window.onload = function () {
                        window.print();
                    };
                <\/script>
            </body>
            </html>
        `);

    janela.document.close();
  };

  window.exportarExcel = function () {
    atualizarRastreioRelatorio();

    const titulo =
      document.getElementById("tituloResultado")?.innerText ||
      "Relatório Gerencial";
    const tabela = document.getElementById("tabelaRelatorio");
    const rastreio = obterDadosRastreio();

    if (!tabela) {
      alert("Nenhuma tabela encontrada para exportar.");
      return;
    }

    const conteudoExcel = `
            <html>
            <head>
                <meta charset="UTF-8">
            </head>
            <body>
                <table>
                    <tr>
                        <th colspan="10">TechPaper - Sistema de Gestão</th>
                    </tr>
                    <tr>
                        <td colspan="10">${titulo}</td>
                    </tr>
                    <tr>
                        <td><strong>Usuário responsável</strong></td>
                        <td>${rastreio.usuario}</td>
                    </tr>
                    <tr>
                        <td><strong>id_usuario</strong></td>
                        <td>${rastreio.idUsuario}</td>
                    </tr>
                    <tr>
                        <td><strong>Data de emissão</strong></td>
                        <td>${rastreio.data}</td>
                    </tr>
                    <tr></tr>
                </table>

                ${tabela.outerHTML}
            </body>
            </html>
        `;

    const blob = new Blob([conteudoExcel], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "relatorio-techpaper.xls";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
});

function adicionarAreaRastreioRelatorio() {
  const areaResultados = document.getElementById("areaResultados");

  if (!areaResultados) {
    return;
  }

  if (document.getElementById("rastreioRelatorio")) {
    return;
  }

  const rastreio = document.createElement("div");
  rastreio.id = "rastreioRelatorio";
  rastreio.className = "rastreio-relatorio";

  rastreio.innerHTML = `
        <span><strong>Usuário:</strong> <b id="relatorioUsuario">-</b></span>
        <span><strong>id_usuario:</strong> <b id="relatorioIdUsuario">-</b></span>
        <span><strong>Data:</strong> <b id="relatorioData">-</b></span>
    `;

  areaResultados.prepend(rastreio);
}

function atualizarRastreioRelatorio() {
  const dados = obterDadosRastreio();

  const usuario = document.getElementById("relatorioUsuario");
  const idUsuario = document.getElementById("relatorioIdUsuario");
  const data = document.getElementById("relatorioData");

  if (usuario) usuario.textContent = dados.usuario;
  if (idUsuario) idUsuario.textContent = dados.idUsuario;
  if (data) data.textContent = dados.data;
}

function obterDadosRastreio() {
  const usuario = obterUsuarioLogado();
  const agora = new Date();

  return {
    usuario: usuario.nome,
    idUsuario: usuario.idUsuario,
    data: agora.toLocaleString("pt-BR"),
  };
}

function obterUsuarioLogado() {
  const possiveisChaves = [
    "usuarioLogado",
    "usuario",
    "user",
    "techpaper_usuario",
    "usuarioAtual",
  ];

  for (const chave of possiveisChaves) {
    const valor = localStorage.getItem(chave);

    if (!valor) {
      continue;
    }

    try {
      const dados = JSON.parse(valor);

      return {
        nome:
          dados.nome ||
          dados.nomeCompleto ||
          dados.name ||
          dados.email ||
          "Usuário do Sistema",

        idUsuario:
          dados.id_usuario ||
          dados.idUsuario ||
          dados.id ||
          dados.email ||
          dados.nome ||
          "usuario_sistema",
      };
    } catch (erro) {
      return {
        nome: valor,
        idUsuario: valor,
      };
    }
  }

  const textoUsuario =
    document.querySelector(".user-trigger span")?.innerText || "";

  if (textoUsuario.trim() !== "") {
    const nomeLimpo = textoUsuario
      .replace("Olá,", "")
      .replace("Olá", "")
      .trim();

    return {
      nome: nomeLimpo || "Usuário do Sistema",
      idUsuario: nomeLimpo || "usuario_sistema",
    };
  }

  return {
    nome: "Pedro Admin",
    idUsuario: "Pedro Admin",
  };
}
