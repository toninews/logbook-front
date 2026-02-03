import { elapsedTime } from "../utils/elapsedTime.js";

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`❌ Teste falhou: ${message}\nEsperado: ${expected}\nRecebido: ${actual}`);
  } else {
    console.log(`✅ Teste passou: ${message}`);
  }
}

// Agora os testes
const agora = new Date();

// Teste 1: menos de 60 segundos
const segundosAtras = new Date(agora.getTime() - 30 * 1000);
assertEqual(elapsedTime(segundosAtras, "pt"), "agora mesmo", "PT - menos de 60 segundos");

// Teste 2: 2 minutos atrás
const doisMinAtras = new Date(agora.getTime() - 2 * 60 * 1000);
assertEqual(elapsedTime(doisMinAtras, "pt"), "há 2 minutos", "PT - 2 minutos atrás");

// Teste 3: 2 minutos atrás em inglês
assertEqual(elapsedTime(doisMinAtras, "en"), "2 minutes ago", "EN - 2 minutos atrás");

// Teste 4: 1 ano atrás
const umAnoAtras = new Date(agora.getTime() - 365 * 24 * 60 * 60 * 1000);
assertEqual(elapsedTime(umAnoAtras, "pt"), "há 1 ano", "PT - 1 ano atrás");

