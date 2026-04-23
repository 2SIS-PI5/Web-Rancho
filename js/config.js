/**
 * RANCHO COMANCHE — Configuração Central de API
 *
 * Este arquivo centraliza a URL do backend.
 * Troque apenas aqui quando mudar o ambiente (dev → produção).
 *
 * INCLUA ESTE ARQUIVO ANTES DE api-service.js e auth.js
 * nos HTMLs:
 *   <script src="../js/config.js"></script>
 *   <script src="../js/api-service.js"></script>
 *   <script src="../js/auth.js"></script>
 */

const RC_CONFIG = {
  // ── URL do Backend ────────────────────────────────────────────
  // Desenvolvimento (IntelliJ rodando local)
  API_URL: 'http://localhost:8080/api',

  // Produção — troque quando fizer deploy:
  // API_URL: 'https://api.ranchocomanche.com.br/api',

  // ── Versão do App ─────────────────────────────────────────────
  VERSION: '1.0.0',

  // ── Timeout de requests (ms) ──────────────────────────────────
  REQUEST_TIMEOUT: 10000,

  // ── Modo Demo ─────────────────────────────────────────────────
  // true  → usa localStorage quando backend offline (desenvolvimento)
  // false → exibe erro real quando backend está indisponível
  DEMO_MODE_ENABLED: true,
};

// Exporta para uso nos outros scripts
window.RC_CONFIG = RC_CONFIG;

console.info(
  `%c🤠 Rancho Comanche v${RC_CONFIG.VERSION}`,
  'color: #b5451b; font-weight: bold; font-size: 14px;'
);
console.info(`%cBackend: ${RC_CONFIG.API_URL}`, 'color: #666;');
