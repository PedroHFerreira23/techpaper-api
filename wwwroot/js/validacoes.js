document.addEventListener("DOMContentLoaded", function () {
  configurarCamposNumericos();
  configurarCamposMonetarios();
  configurarCamposDocumentoTelefone();
});

function bloquearTeclasInvalidas(event) {
  const teclasBloqueadas = ["e", "E", "+", "-"];

  if (teclasBloqueadas.includes(event.key)) {
    event.preventDefault();
  }
}

function permitirApenasNumeros(input) {
  if (!input) return;

  input.setAttribute("inputmode", "numeric");
  input.setAttribute("autocomplete", "off");

  input.addEventListener("keydown", bloquearTeclasInvalidas);

  input.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });

  input.addEventListener("paste", function (event) {
    event.preventDefault();

    const texto = (event.clipboardData || window.clipboardData).getData("text");
    this.value = texto.replace(/\D/g, "");
  });
}

function permitirApenasValorMonetario(input) {
  if (!input) return;

  input.setAttribute("inputmode", "decimal");
  input.setAttribute("autocomplete", "off");

  input.addEventListener("keydown", bloquearTeclasInvalidas);

  input.addEventListener("input", function () {
    let valor = this.value;

    valor = valor.replace(",", ".");
    valor = valor.replace(/[^0-9.]/g, "");

    const partes = valor.split(".");

    if (partes.length > 2) {
      valor = partes[0] + "." + partes.slice(1).join("");
    }

    if (valor.includes(".")) {
      const [inteiro, decimal] = valor.split(".");
      valor = inteiro + "." + decimal.substring(0, 2);
    }

    this.value = valor;
  });

  input.addEventListener("blur", function () {
    if (this.value !== "") {
      this.value = parseFloat(this.value).toFixed(2);
    }
  });

  input.addEventListener("paste", function (event) {
    event.preventDefault();

    const texto = (event.clipboardData || window.clipboardData).getData("text");
    let valor = texto.replace(",", ".").replace(/[^0-9.]/g, "");

    const partes = valor.split(".");

    if (partes.length > 2) {
      valor = partes[0] + "." + partes.slice(1).join("");
    }

    this.value = valor;
  });
}

function configurarCamposNumericos() {
  const camposNumericos = [
    "estoqueInicial",
    "quantidadeMovimentacao",
    "prazoEntrega",
  ];

  camposNumericos.forEach(function (id) {
    permitirApenasNumeros(document.getElementById(id));
  });
}

function configurarCamposMonetarios() {
  const camposMonetarios = ["precoCusto", "precoVenda"];

  camposMonetarios.forEach(function (id) {
    permitirApenasValorMonetario(document.getElementById(id));
  });
}

function configurarCamposDocumentoTelefone() {
  const campoCnpj = document.getElementById("cnpj");
  const campoTelefone = document.getElementById("telefone");

  if (campoCnpj) {
    campoCnpj.setAttribute("inputmode", "numeric");

    campoCnpj.addEventListener("input", function () {
      let valor = this.value.replace(/\D/g, "");

      valor = valor.substring(0, 14);

      valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
      valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");

      this.value = valor;
    });
  }

  if (campoTelefone) {
    campoTelefone.setAttribute("inputmode", "numeric");

    campoTelefone.addEventListener("input", function () {
      let valor = this.value.replace(/\D/g, "");

      valor = valor.substring(0, 11);

      if (valor.length <= 10) {
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
      }

      this.value = valor;
    });
  }
}
