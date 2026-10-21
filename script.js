
const pantalla = document.querySelector("#pantalla");
const mensaje = document.querySelector("#mensaje");
const botones = document.querySelector(".botones");

let expresion = "";
let resultadoMostrado = false;

function actualizarPantalla() {
  pantalla.value = expresion || "0";
}

function mostrarError(texto) {
  mensaje.textContent = texto;
}

function agregarValor(valor) {
  mensaje.textContent = "";

  if (resultadoMostrado) {
    if ("0123456789.(".includes(valor)) {
      expresion = "";
    }
    resultadoMostrado = false;
  }

  expresion += valor;
  actualizarPantalla();
}

function calcular() {
  try {
    if (!expresion.trim()) {
      mostrarError("Escribe una operación primero.");
      return;
    }

    if (!/^[0-9+\-*/().%\s]+$/.test(expresion)) {
      throw new Error("Operación no válida.");
    }

    if (/\/\s*0+(?:\.0*)?(?![\d.])/.test(expresion)) {
      throw new Error("No se puede dividir entre cero.");
    }

    const operacion = expresion.replace(
      /(\d+(?:\.\d+)?)%/g,
      "($1/100)"
    );

    // Evalúa únicamente expresiones matemáticas validadas.
    const resultado = Function('"use strict"; return (' + operacion + ')')();

    if (typeof resultado !== "number" || !Number.isFinite(resultado)) {
      throw new Error("El resultado no es válido.");
    }

    expresion = String(Number(resultado.toPrecision(12)));
    actualizarPantalla();
    resultadoMostrado = true;
    mensaje.textContent = "¡Resultado calculado!";
  } catch (error) {
    mostrarError(error.message || "No se pudo calcular.");
  }
}

botones.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");

  if (!boton) return;

  const valor = boton.dataset.value;
  const accion = boton.dataset.action;

  if (valor !== undefined) {
    agregarValor(valor);
    return;
  }

  if (accion === "clear") {
    expresion = "";
    resultadoMostrado = false;
    mensaje.textContent = "";
    actualizarPantalla();
  }

  if (accion === "delete") {
    expresion = expresion.slice(0, -1);
    resultadoMostrado = false;
    mensaje.textContent = "";
    actualizarPantalla();
  }

  if (accion === "calculate") {
    calcular();
  }

  if (accion === "sqrt") {
    try {
      const numero = Number(expresion);

      if (!expresion || !Number.isFinite(numero) || numero < 0) {
        throw new Error("Escribe un número positivo.");
      }

      expresion = String(Number(Math.sqrt(numero).toPrecision(12)));
      actualizarPantalla();
      resultadoMostrado = true;
      mensaje.textContent = "Raíz cuadrada calculada.";
    } catch (error) {
      mostrarError(error.message);
    }
  }

  if (accion === "sign") {
    if (expresion && Number.isFinite(Number(expresion))) {
      expresion = String(-Number(expresion));
      actualizarPantalla();
    }
  }
});

actualizarPantalla();

