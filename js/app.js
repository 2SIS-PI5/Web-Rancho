/**
 * RANCHO COMANCHE — App Principal
 * Lógica de CRUD de Freelancers, Escala e Dashboard.
 * Integra com CEP API (api/cep.js) e API Service (js/api-service.js).
 */

// ══════════════════════════════════════════════════════════════
// CONFIGURAÇÃO DO RESTAURANTE
// ══════════════════════════════════════════════════════════════

const RANCHO = {
  nome:      'Rancho Comanche',
  cep:       '09834-203',
  latitude:  -23.513870,   // fallback — atualizado automaticamente abaixo
  longitude: -46.861780
};

// Atualiza coordenadas do Rancho pelo CEP real na inicialização
async function inicializarCoordsRancho() {
  try {
    const coords = await buscarCoordenadasPorEndereco(null, null, null, RANCHO.cep.replace('-', ''));
    RANCHO.latitude  = coords.latitude;
    RANCHO.longitude = coords.longitude;
    console.info(`📍 Rancho coords: ${coords.latitude}, ${coords.longitude}`);
  } catch (e) {
    console.warn('Usando coordenadas fixas do Rancho (fallback):', e.message);
  }
}

// ══════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  // Verifica autenticação
  const token = localStorage.getItem('rc_token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  // Atualiza coords do restaurante pelo CEP
  await inicializarCoordsRancho();

  // Carrega dados do usuário
  loadUserInfo();

  // Inicia filtro de mês atual na escala
  const mesAtual = new Date().toISOString().slice(0, 7);
  document.getElementById('esc-filter-mes').value = mesAtual;

  // Atualiza data do dashboard
  document.getElementById('dash-date').textContent =
    new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  // Carrega dados
  await Promise.all([renderFreelancers(), renderEscalas()]);
  updateDashboard();
  renderPagamentos();
});

function loadUserInfo() {
  const raw  = localStorage.getItem('rc_user');
  const user = raw ? JSON.parse(raw) : { name: 'Usuário', role: 'Gestor' };

  document.getElementById('user-name-label').textContent = user.name || user.email || 'Usuário';
  document.getElementById('user-role-label').textContent = user.role || 'Gestor';

  const initials = (user.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  document.getElementById('user-avatar-initials').textContent = initials;
}

// ══════════════════════════════════════════════════════════════
// NAVEGAÇÃO
// ══════════════════════════════════════════════════════════════

const VIEW_CONFIG = {
  dashboard:    { title: 'Dashboard',           subtitle: 'Visão geral do sistema' },
  freelancers:  { title: 'Gestão de Freelancers', subtitle: 'Profissionais cadastrados' },
  escala:       { title: 'Gestão de Escala',    subtitle: 'Organização dos turnos' },
  pagamentos:   { title: 'Pagamentos',          subtitle: 'Controle financeiro' }
};

function showView(name) {
  // Esconde todas as views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Ativa a view correta
  document.getElementById('view-' + name).classList.add('active');
  document.getElementById('nav-' + name).classList.add('active');

  const cfg = VIEW_CONFIG[name] || {};
  document.getElementById('page-title').textContent    = cfg.title    || name;
  document.getElementById('page-subtitle').textContent = cfg.subtitle || '';

  closeSidebar();
}

// Sidebar mobile
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('visible');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('visible');
}

function logout() {
  localStorage.removeItem('rc_token');
  localStorage.removeItem('rc_user');
  window.location.href = 'index.html';
}

// ══════════════════════════════════════════════════════════════
// MODAL HELPERS
// ══════════════════════════════════════════════════════════════

function abrirModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// Fechar modal ao clicar no overlay
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Fechar com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

// ══════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ══════════════════════════════════════════════════════════════

function showToast(msg, type = 'success', duration = 3500) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;

  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle' };
  toast.innerHTML = '<i class="fa ' + (icons[type] || 'fa-info-circle') + '"></i> ' + msg;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ══════════════════════════════════════════════════════════════
// MODAL ALERT HELPER
// ══════════════════════════════════════════════════════════════

function showModalAlert(alertId, msg, type = 'error') {
  const el = document.getElementById(alertId);
  el.className = 'alert alert-' + type;
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  el.innerHTML = '<i class="fa ' + icon + '"></i> ' + msg;
}

function clearModalAlert(alertId) {
  const el = document.getElementById(alertId);
  el.className = 'alert hidden';
  el.textContent = '';
}

function setFieldError(id, on) {
  const el = document.getElementById(id);
  if (!el) return;
  el.closest('.form-group').classList.toggle('has-error', on);
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════

async function updateDashboard() {
  const freelancers = await FreelancerAPI.listar();
  const escalas     = await EscalaAPI.listar();

  const ativos      = freelancers.filter(f => f.status === 'ativo').length;
  const proximos    = freelancers.filter(f => (f.distanciaKm || 999) <= 15).length;

  const mesAtual    = new Date().toISOString().slice(0, 7);
  const escalasMes  = escalas.filter(e => (e.data || '').startsWith(mesAtual));
  const gastoMes    = escalasMes.reduce((sum, e) => sum + (parseFloat(e.valorTotal) || 0), 0);

  // Stats globais
  document.getElementById('stat-total-freelancers').textContent = freelancers.length;
  document.getElementById('stat-ativos').textContent = ativos;
  document.getElementById('stat-escalas-mes').textContent = escalasMes.length;
  document.getElementById('stat-gasto-mes').textContent = 'R$ ' + gastoMes.toFixed(2).replace('.', ',');

  // Badges sidebar
  document.getElementById('badge-freelancers').textContent = freelancers.length;
  document.getElementById('badge-escala').textContent = escalas.filter(e => e.status === 'pendente').length;

  // Próximas escalas (próximas 5)
  const hoje = new Date().toISOString().slice(0, 10);
  const proxEscalas = escalas
    .filter(e => e.data >= hoje && e.status !== 'cancelado')
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 4);

  const proxEl = document.getElementById('dash-proximas-escalas');
  if (proxEscalas.length === 0) {
    proxEl.innerHTML = '<div class="empty-state" style="padding:30px 20px;"><div class="empty-icon">📅</div><p>Nenhuma escala agendada</p></div>';
  } else {
    proxEl.innerHTML = proxEscalas.map(e => {
      const fl = freelancers.find(f => f.id === e.freelancerId) || {};
      return `
        <div class="schedule-card ${e.status}" style="margin-bottom:8px;">
          <div class="sc-time">
            <div class="time-range">${e.horaInicio || '--'}</div>
            <div class="time-hours">${formatDate(e.data)}</div>
          </div>
          <div class="sc-info">
            <div class="sc-name">${fl.nome || '—'}</div>
            <div class="sc-meta">${e.funcao || fl.especialidade || '—'}</div>
          </div>
          <span class="badge ${statusBadge(e.status)}">${e.status}</span>
        </div>`;
    }).join('');
  }

  // Freelancers recentes
  const recentes = [...freelancers].reverse().slice(0, 4);
  const recEl = document.getElementById('dash-freelancers-recentes');
  if (recentes.length === 0) {
    recEl.innerHTML = '<div class="empty-state" style="padding:30px 20px;"><div class="empty-icon">👥</div><p>Nenhum freelancer</p></div>';
  } else {
    recEl.innerHTML = `
      <table class="data-table">
        <tbody>
          ${recentes.map(f => `
            <tr>
              <td><div class="person-cell">
                <div class="avatar ${avatarColor(f.id)}">${initials(f.nome)}</div>
                <div><div class="person-name">${f.nome}</div><div class="person-sub">${f.especialidade || '—'}</div></div>
              </div></td>
              <td><span class="badge ${f.status === 'ativo' ? 'badge-success' : 'badge-neutral'}">${f.status}</span></td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }
}

// ══════════════════════════════════════════════════════════════
// FREELANCERS CRUD
// ══════════════════════════════════════════════════════════════

async function renderFreelancers() {
  const all    = await FreelancerAPI.listar();
  const search = (document.getElementById('fl-search')?.value || '').toLowerCase();
  const status = document.getElementById('fl-filter-status')?.value || '';
  const esp    = document.getElementById('fl-filter-esp')?.value    || '';

  const filtered = all.filter(f => {
    const matchSearch = !search ||
      (f.nome       || '').toLowerCase().includes(search) ||
      (f.email      || '').toLowerCase().includes(search) ||
      (f.especialidade || '').toLowerCase().includes(search);
    const matchStatus = !status || f.status === status;
    const matchEsp    = !esp    || f.especialidade === esp;
    return matchSearch && matchStatus && matchEsp;
  });

  // Stats
  document.getElementById('fl-total').textContent   = all.length;
  document.getElementById('fl-ativos').textContent  = all.filter(f => f.status === 'ativo').length;
  document.getElementById('fl-proximos').textContent = all.filter(f => (f.distanciaKm || 999) <= 15).length;

  const tbody = document.getElementById('fl-tbody');
  document.getElementById('fl-count-label').textContent = `${filtered.length} freelancer${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7">
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <h4>${search || status || esp ? 'Nenhum resultado encontrado' : 'Nenhum freelancer cadastrado'}</h4>
          <p>${search || status || esp ? 'Tente ajustar os filtros.' : 'Clique em "Novo Freelancer" para começar.'}</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(f => {
    const distText = f.distanciaKm != null
      ? `${f.distanciaKm} km`
      : '<span class="text-muted text-sm">—</span>';
    const distClass = f.distanciaKm == null ? '' :
      f.distanciaKm <= 5  ? 'text-success' :
      f.distanciaKm <= 15 ? '' : 'text-error';

    return `
      <tr>
        <td>
          <div class="person-cell">
            <div class="avatar ${avatarColor(f.id)}">${initials(f.nome)}</div>
            <div>
              <div class="person-name">${esc(f.nome)}</div>
              <div class="person-sub">${esc(f.email || '—')}</div>
            </div>
          </div>
        </td>
        <td>${esc(f.especialidade || '—')}</td>
        <td>${esc(f.telefone || '—')}</td>
        <td>
          <div style="font-size:0.82rem; color:var(--text-mid);">${esc(f.cidade ? f.cidade + ' - ' + f.estado : '—')}</div>
          <div class="${distClass} fw-semi text-sm">${distText}</div>
        </td>
        <td class="fw-semi">${f.valorHora ? 'R$ ' + parseFloat(f.valorHora).toFixed(2).replace('.', ',') : '—'}</td>
        <td><span class="badge ${f.status === 'ativo' ? 'badge-success' : 'badge-neutral'}">${f.status || 'ativo'}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-ghost" onclick="editarFreelancer(${f.id})" title="Editar">
              <i class="fa fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-ghost" style="color:var(--error);" onclick="confirmarExclusaoFreelancer(${f.id})" title="Excluir">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

// ── Abrir modal de novo freelancer ──
function abrirModalFreelancer() {
  limparFormFreelancer();
  document.getElementById('modal-fl-title').textContent    = 'Novo Freelancer';
  document.getElementById('modal-fl-subtitle').textContent = 'Preencha os dados do profissional';
  document.getElementById('btn-fl-save-text').textContent  = 'Salvar';
  abrirModal('modal-freelancer');
}

// ── Editar freelancer ──
async function editarFreelancer(id) {
  limparFormFreelancer();
  const f = (await FreelancerAPI.listar()).find(f => f.id === id);
  if (!f) { showToast('Freelancer não encontrado.', 'error'); return; }

  document.getElementById('fl-id').value             = f.id;
  document.getElementById('fl-nome').value           = f.nome           || '';
  document.getElementById('fl-cpf').value            = f.cpf            || '';
  document.getElementById('fl-telefone').value       = f.telefone       || '';
  document.getElementById('fl-email').value          = f.email          || '';
  document.getElementById('fl-especialidade').value  = f.especialidade  || '';
  document.getElementById('fl-valor-hora').value     = f.valorHora      || '';
  document.getElementById('fl-status').value         = f.status         || 'ativo';
  document.getElementById('fl-observacoes').value    = f.observacoes    || '';
  document.getElementById('fl-cep').value            = f.cep            || '';
  document.getElementById('fl-logradouro').value     = f.logradouro     || '';
  document.getElementById('fl-numero').value         = f.numero         || '';
  document.getElementById('fl-complemento').value    = f.complemento    || '';
  document.getElementById('fl-bairro').value         = f.bairro         || '';
  document.getElementById('fl-uf').value             = f.estado         || '';
  document.getElementById('fl-cidade').value         = f.cidade         || '';
  document.getElementById('fl-latitude').value       = f.latitude       || '';
  document.getElementById('fl-longitude').value      = f.longitude      || '';
  document.getElementById('fl-distancia-km').value   = f.distanciaKm    || '';

  if (f.cep) {
    const preview = document.getElementById('fl-address-preview');
    const cidade  = f.cidade ? `${f.cidade} - ${f.estado}` : '';
    document.getElementById('fl-addr-full').textContent = f.logradouro ? `${f.logradouro}, ${f.numero || 'S/N'} — ${cidade}` : cidade;
    if (f.distanciaKm) mostrarDistanciaPreview(f.distanciaKm);
    preview.classList.add('visible');
  }

  document.getElementById('modal-fl-title').textContent    = 'Editar Freelancer';
  document.getElementById('modal-fl-subtitle').textContent = 'Atualize os dados do profissional';
  document.getElementById('btn-fl-save-text').textContent  = 'Atualizar';
  abrirModal('modal-freelancer');
}

// ── Salvar freelancer ──
async function salvarFreelancer() {
  clearModalAlert('modal-fl-alert');

  const nome = document.getElementById('fl-nome').value.trim();
  const tel  = document.getElementById('fl-telefone').value.trim();
  const esp  = document.getElementById('fl-especialidade').value;
  const vHora = document.getElementById('fl-valor-hora').value;
  const cep   = document.getElementById('fl-cep').value.trim();

  let valid = true;
  if (!nome)  { setFieldError('fl-nome', true);          valid = false; } else setFieldError('fl-nome', false);
  if (!tel)   { setFieldError('fl-telefone', true);      valid = false; } else setFieldError('fl-telefone', false);
  if (!esp)   { setFieldError('fl-especialidade', true); valid = false; } else setFieldError('fl-especialidade', false);
  if (!vHora) { setFieldError('fl-valor-hora', true);    valid = false; } else setFieldError('fl-valor-hora', false);
  if (!cep || cep.replace(/\D/g,'').length !== 8) { setFieldError('fl-cep', true); valid = false; } else setFieldError('fl-cep', false);

  if (!valid) { showModalAlert('modal-fl-alert', 'Preencha todos os campos obrigatórios.'); return; }

  const dados = {
    nome,
    cpf:          document.getElementById('fl-cpf').value.trim(),
    telefone:     tel,
    email:        document.getElementById('fl-email').value.trim(),
    especialidade: esp,
    valorHora:    parseFloat(vHora),
    status:       document.getElementById('fl-status').value,
    observacoes:  document.getElementById('fl-observacoes').value.trim(),
    cep:          document.getElementById('fl-cep').value.trim(),
    logradouro:   document.getElementById('fl-logradouro').value,
    numero:       document.getElementById('fl-numero').value.trim(),
    complemento:  document.getElementById('fl-complemento').value.trim(),
    bairro:       document.getElementById('fl-bairro').value,
    cidade:       document.getElementById('fl-cidade').value,
    estado:       document.getElementById('fl-uf').value,
    latitude:     parseFloat(document.getElementById('fl-latitude').value) || null,
    longitude:    parseFloat(document.getElementById('fl-longitude').value) || null,
    distanciaKm:  parseFloat(document.getElementById('fl-distancia-km').value) || null,
  };

  setBtnLoading('btn-salvar-freelancer', 'btn-fl-save-text', 'btn-fl-spinner', true);

  try {
    const id = document.getElementById('fl-id').value;
    if (id) {
      await FreelancerAPI.atualizar(parseInt(id), dados);
      showToast('Freelancer atualizado com sucesso!', 'success');
    } else {
      await FreelancerAPI.criar(dados);
      showToast('Freelancer cadastrado com sucesso!', 'success');
    }

    fecharModal('modal-freelancer');
    await renderFreelancers();
    updateDashboard();
  } catch (err) {
    showModalAlert('modal-fl-alert', err.message || 'Erro ao salvar.');
  } finally {
    setBtnLoading('btn-salvar-freelancer', 'btn-fl-save-text', 'btn-fl-spinner', false);
  }
}

// ── Confirmar exclusão ──
function confirmarExclusaoFreelancer(id) {
  document.getElementById('confirm-title').textContent = 'Excluir freelancer?';
  document.getElementById('confirm-msg').textContent   = 'Todas as escalas associadas serão afetadas. Esta ação não pode ser desfeita.';

  const btn = document.getElementById('btn-confirmar-delete');
  btn.onclick = async () => {
    fecharModal('modal-confirmar');
    try {
      await FreelancerAPI.excluir(id);
      showToast('Freelancer excluído.', 'success');
      await renderFreelancers();
      updateDashboard();
    } catch (err) {
      showToast(err.message || 'Erro ao excluir.', 'error');
    }
  };

  abrirModal('modal-confirmar');
}

// ── CEP autocomplete no modal de freelancer ──
document.getElementById('fl-cep').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
  this.value = v;
  if (v.replace('-', '').length === 8) buscarCepFreelancer();
});

async function buscarCepFreelancer() {
  const cepVal = document.getElementById('fl-cep').value.replace(/\D/g, '');
  if (cepVal.length !== 8) return;

  const statusEl = document.getElementById('fl-cep-status');
  statusEl.className = 'cep-status loading';
  statusEl.innerHTML = '<span class="cep-spinner"></span> Buscando...';

  try {
    const dados = await buscarEnderecoPorCep(cepVal);

    document.getElementById('fl-logradouro').value = dados.logradouro || '';
    document.getElementById('fl-bairro').value     = dados.bairro     || '';
    document.getElementById('fl-cidade').value     = dados.cidade     || '';
    document.getElementById('fl-uf').value         = dados.estado     || '';

    statusEl.className = 'cep-status success';
    statusEl.innerHTML = '<i class="fa fa-check-circle"></i> Endereço encontrado';

    // Busca coordenadas e calcula distância
    try {
      const coords = await buscarCoordenadasPorEndereco(
        dados.enderecoCompleto,
        dados.cidade,
        dados.estado,
        cepVal
      );
      document.getElementById('fl-latitude').value  = coords.latitude;
      document.getElementById('fl-longitude').value = coords.longitude;

      const dist = calcularDistanciaHaversine(
        RANCHO.latitude, RANCHO.longitude,
        coords.latitude, coords.longitude
      );
      document.getElementById('fl-distancia-km').value = dist;
      mostrarDistanciaPreview(dist);
    } catch (e) {
      console.warn('Coordenadas não encontradas:', e.message);
    }

    // Preview
    const preview = document.getElementById('fl-address-preview');
    document.getElementById('fl-addr-full').textContent = dados.enderecoCompleto;
    preview.classList.add('visible');

    setFieldError('fl-cep', false);
    document.getElementById('fl-numero').focus();
  } catch (err) {
    statusEl.className = 'cep-status error';
    statusEl.innerHTML = '<i class="fa fa-times-circle"></i> ' + err.message;
    document.getElementById('fl-address-preview').classList.remove('visible');
  }
}

function mostrarDistanciaPreview(dist) {
  const chip = document.getElementById('fl-dist-badge');
  const row  = document.getElementById('fl-dist-row');
  let cls = '', label = '';

  if (dist <= 5)       { cls = 'dist-near';   label = '🟢 ' + dist + ' km — Muito próximo'; }
  else if (dist <= 15) { cls = 'dist-medium'; label = '🟡 ' + dist + ' km — Distância média'; }
  else                 { cls = 'dist-far';    label = '🔴 ' + dist + ' km — Distante'; }

  chip.className = 'distance-chip ' + cls;
  chip.textContent = label;
  row.style.display = 'flex';
}

// ── Limpar form freelancer ──
function limparFormFreelancer() {
  document.getElementById('form-freelancer').reset();
  document.getElementById('fl-id').value = '';
  document.getElementById('fl-address-preview').classList.remove('visible');
  document.getElementById('fl-cep-status').innerHTML = '';
  document.getElementById('fl-dist-badge').textContent = '';
  document.getElementById('fl-dist-row').style.display = 'none';
  clearModalAlert('modal-fl-alert');
  document.querySelectorAll('#form-freelancer .form-group').forEach(g => g.classList.remove('has-error'));
}

// ══════════════════════════════════════════════════════════════
// ESCALA CRUD — Modelo Figma
// Escala = evento do dia. Funcionários são adicionados separadamente.
// ══════════════════════════════════════════════════════════════

async function renderEscalas() {
  const all        = await EscalaAPI.listar();
  const freelancers = await FreelancerAPI.listar();
  const search     = (document.getElementById('esc-search')?.value || '').toLowerCase();
  const filtroMes  = document.getElementById('esc-filter-mes')?.value || '';
  const filtroSt   = document.getElementById('esc-filter-status')?.value || '';

  const filtered = all.filter(e => {
    const data = e.dataEscala || e.data || '';
    const matchMes = !filtroMes || data.startsWith(filtroMes);
    const matchSt  = !filtroSt  || (e.statusEscala || e.status || '').toLowerCase() === filtroSt.toLowerCase();
    return matchMes && matchSt;
  }).sort((a, b) => {
    const da = a.dataEscala || a.data || '';
    const db = b.dataEscala || b.data || '';
    return da.localeCompare(db);
  });

  // ── Stats ──
  document.getElementById('esc-total').textContent       = all.length;
  document.getElementById('esc-confirmadas').textContent = all.filter(e => (e.statusEscala||e.status||'').toLowerCase() === 'realizada').length;
  document.getElementById('esc-pendentes').textContent   = all.filter(e => (e.statusEscala||e.status||'').toLowerCase() === 'agendada').length;

  const el = document.getElementById('esc-list');

  if (filtered.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <h4>${filtroMes || filtroSt ? 'Nenhum resultado' : 'Nenhuma escala cadastrada'}</h4>
        <p>${filtroMes || filtroSt ? 'Ajuste os filtros.' : 'Clique em "Nova Escala" para começar.'}</p>
      </div>`;
    return;
  }

  // Renderiza cards — funcionários carregados assincronamente
  el.innerHTML = filtered.map(e => {
    const data   = e.dataEscala || e.data || '';
    const status = (e.statusEscala || e.status || 'Agendada');
    const statusLower = status.toLowerCase();
    const badgeClass = statusLower === 'realizada' ? 'badge-success'
                     : statusLower === 'cancelada' ? 'badge-error'
                     : 'badge-warning';
    const dur = calcularDuracao(
      typeof e.horaInicio === 'string' ? e.horaInicio.slice(0,5) : '',
      typeof e.horaFim    === 'string' ? e.horaFim.slice(0,5)    : ''
    );
    return `
      <div class="escala-day-card" id="escala-card-${e.id}">
        <div class="escala-day-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
          <div>
            <div class="escala-day-title">${formatDate(data)}</div>
            <div class="escala-day-date">
              ${(e.horaInicio||'').slice(0,5)} – ${(e.horaFim||'').slice(0,5)}
              ${dur ? `<span style="color:var(--text-muted);margin-left:6px;">(${dur}h)</span>` : ''}
              ${e.observacoes ? `<span style="color:var(--text-muted);margin-left:8px;">· ${esc(e.observacoes)}</span>` : ''}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="badge ${badgeClass}">${status}</span>
            <button class="btn btn-sm btn-outline" onclick="abrirGerenciarFuncionarios(${e.id})" title="Gerenciar equipe">
              <i class="fa fa-users"></i> Equipe
            </button>
            <button class="btn btn-sm btn-ghost" onclick="abrirEditarEscala(${e.id})" title="Editar">
              <i class="fa fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-ghost" style="color:var(--error);" onclick="confirmarExclusaoEscala(${e.id})" title="Excluir">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="escala-funcionarios-container" id="esc-fns-${e.id}">
          <div style="padding:12px 20px;color:var(--text-muted);font-size:.85rem;">
            <i class="fa fa-spinner fa-spin"></i> Carregando equipe...
          </div>
        </div>
      </div>`;
  }).join('');

  // Carrega funcionários de cada escala em paralelo
  await Promise.all(filtered.map(e => carregarFuncionariosNoCard(e, freelancers)));
}

// ── Carrega e renderiza os funcionários dentro do card de uma escala ──
async function carregarFuncionariosNoCard(escala, freelancers) {
  const container = document.getElementById(`esc-fns-${escala.id}`);
  if (!container) return;

  let vincs = [];
  try {
    vincs = await EscalaFuncionarioAPI.listar(escala.id);
  } catch (e) { vincs = []; }

  if (vincs.length === 0) {
    container.innerHTML = `
      <div style="padding:14px 20px;color:var(--text-muted);font-size:.85rem;display:flex;align-items:center;gap:8px;">
        <i class="fa fa-user-plus"></i>
        Nenhum funcionário escalado.
        <button class="btn btn-sm btn-primary" onclick="abrirGerenciarFuncionarios(${escala.id})" style="margin-left:8px;">
          <i class="fa fa-plus"></i> Adicionar
        </button>
      </div>`;
    return;
  }

  // Agrupa por setor
  const grupos = {};
  let totalGeral = 0;
  vincs.forEach(v => {
    const setor = v.setorNome || 'Sem setor';
    if (!grupos[setor]) grupos[setor] = [];
    grupos[setor].push(v);
    totalGeral += parseFloat(v.valorTotal || 0);
  });

  const setorColors = {
    'Cozinha': '#2563EB', 'Garçom': '#16A34A', 'Atividades': '#9333EA',
    'Bar': '#D97706', 'Recepção': '#0891B2'
  };

  const html = Object.entries(grupos).map(([setor, lista]) => {
    const cor = setorColors[setor] || '#6B7280';
    const subtotal = lista.reduce((s, v) => s + parseFloat(v.valorTotal || 0), 0);
    return `
      <div class="escala-area-section">
        <div class="escala-area-title" style="color:${cor};display:flex;align-items:center;justify-content:space-between;">
          <span><i class="fa fa-circle" style="font-size:.55rem;margin-right:6px;"></i>${setor}</span>
          <span style="font-weight:600;">R$ ${subtotal.toFixed(2)}</span>
        </div>
        ${lista.map(v => {
          const fl = freelancers.find(f => f.id === v.freelancerId) || {};
          const nome = v.freelancerNome || fl.nome || 'Funcionário';
          const valor = parseFloat(v.valorTotal || 0).toFixed(2);
          return `
            <div class="escala-person">
              <div class="escala-person-name">${esc(nome)}</div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:.82rem;font-weight:600;color:var(--success);">R$ ${valor}</span>
                <button class="escala-person-btn remove" onclick="removerFuncionarioEscala(${escala.id}, ${v.id})" title="Remover">
                  <i class="fa fa-times" style="font-size:.75rem;"></i>
                </button>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  }).join('');

  const footer = `
    <div style="padding:10px 20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;font-size:.85rem;">
      <span style="color:var(--text-muted);">${vincs.length} funcionário${vincs.length !== 1 ? 's' : ''} escalado${vincs.length !== 1 ? 's' : ''}</span>
      <span style="font-weight:700;color:var(--primary);">Total: R$ ${totalGeral.toFixed(2)}</span>
    </div>`;

  container.innerHTML = html + footer;

  // Atualiza stat de gasto total
  atualizarGastoEscala();
}

// ── Atualiza o stat de custo total das escalas ──
async function atualizarGastoEscala() {
  try {
    const escalas = await EscalaAPI.listar();
    let total = 0;
    await Promise.all(escalas.map(async e => {
      try {
        const vincs = await EscalaFuncionarioAPI.listar(e.id);
        vincs.forEach(v => { total += parseFloat(v.valorTotal || 0); });
      } catch {}
    }));
    const el = document.getElementById('esc-gasto');
    if (el) el.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
  } catch {}
}

// ── Abrir modal de NOVA escala ──
function abrirModalEscala() {
  limparFormEscala();
  document.getElementById('modal-esc-title').textContent    = 'Nova Escala';
  document.getElementById('modal-esc-subtitle').textContent = 'Defina a data e o horário do evento';
  document.getElementById('btn-esc-save-text').textContent  = 'Salvar Escala';
  document.getElementById('esc-data').value = new Date().toISOString().slice(0, 10);
  abrirModal('modal-escala');
}

// ── Abrir modal para EDITAR escala existente ──
async function abrirEditarEscala(id) {
  limparFormEscala();
  const list = await EscalaAPI.listar();
  const e = list.find(e => e.id === id);
  if (!e) { showToast('Escala não encontrada.', 'error'); return; }

  document.getElementById('esc-id').value          = e.id;
  document.getElementById('esc-data').value        = e.dataEscala || e.data || '';
  document.getElementById('esc-hora-inicio').value = (e.horaInicio||'').slice(0,5);
  document.getElementById('esc-hora-fim').value    = (e.horaFim||'').slice(0,5);
  document.getElementById('esc-status').value      = e.statusEscala || e.status || 'Agendada';
  document.getElementById('esc-observacoes').value = e.observacoes || '';

  calcularValorEscala();

  document.getElementById('modal-esc-title').textContent    = 'Editar Escala';
  document.getElementById('modal-esc-subtitle').textContent = 'Atualize os dados do evento';
  document.getElementById('btn-esc-save-text').textContent  = 'Atualizar';
  abrirModal('modal-escala');
}

// ── Salvar escala (criar ou atualizar) ──
async function salvarEscala() {
  clearModalAlert('modal-esc-alert');

  const data       = document.getElementById('esc-data').value;
  const horaInicio = document.getElementById('esc-hora-inicio').value;
  const horaFim    = document.getElementById('esc-hora-fim').value;

  let valid = true;
  if (!data)       { setFieldError('esc-data', true);       valid = false; } else setFieldError('esc-data', false);
  if (!horaInicio) { setFieldError('esc-hora-inicio', true); valid = false; } else setFieldError('esc-hora-inicio', false);
  if (!horaFim)    { setFieldError('esc-hora-fim', true);   valid = false; } else setFieldError('esc-hora-fim', false);

  if (!valid) { showModalAlert('modal-esc-alert', 'Preencha todos os campos obrigatórios.'); return; }
  if (horaFim <= horaInicio) {
    showModalAlert('modal-esc-alert', 'O horário de término deve ser após o início.');
    return;
  }

  const toSeconds = h => h.length === 5 ? h + ':00' : h;

  const dados = {
    dataEscala:  data,
    horaInicio:  toSeconds(horaInicio),
    horaFim:     toSeconds(horaFim),
    statusEscala: document.getElementById('esc-status').value,
    observacoes: document.getElementById('esc-observacoes').value.trim(),
  };

  setBtnLoading('btn-salvar-escala', 'btn-esc-save-text', 'btn-esc-spinner', true);

  try {
    const id = document.getElementById('esc-id').value;
    let escala;
    if (id) {
      escala = await EscalaAPI.atualizar(parseInt(id), dados);
      showToast('Escala atualizada!', 'success');
      fecharModal('modal-escala');
    } else {
      escala = await EscalaAPI.criar(dados);
      showToast('Escala criada! Agora adicione os funcionários.', 'success');
      fecharModal('modal-escala');
      // Abre o modal de gerenciar funcionários automaticamente
      setTimeout(() => abrirGerenciarFuncionarios(escala.id || escala), 300);
    }
    await renderEscalas();
    updateDashboard();
    renderPagamentos();
  } catch (err) {
    showModalAlert('modal-esc-alert', err.message || 'Erro ao salvar escala.');
  } finally {
    setBtnLoading('btn-salvar-escala', 'btn-esc-save-text', 'btn-esc-spinner', false);
  }
}

// ── Abrir modal de GERENCIAR FUNCIONÁRIOS de uma escala ──
async function abrirGerenciarFuncionarios(escalaId) {
  // Salva o escalaId no modal
  document.getElementById('modal-gf-escala-id').value = escalaId;

  // Busca dados da escala para o header
  try {
    const list = await EscalaAPI.listar();
    const e = list.find(e => e.id === escalaId || e.id === parseInt(escalaId));
    if (e) {
      const data = formatDate(e.dataEscala || e.data || '');
      const hIni = (e.horaInicio||'').slice(0,5);
      const hFim = (e.horaFim||'').slice(0,5);
      document.getElementById('modal-gf-header').textContent = `${data} · ${hIni} – ${hFim}`;
    }
  } catch {}

  // Popula selects de funcionários e setores
  await populateGFSelects(escalaId);

  // Renderiza a lista atual
  await renderFuncionariosNaEscala(escalaId);

  abrirModal('modal-gerenciar-funcionarios');
}

// ── Popula os selects do modal de funcionários ──
async function populateGFSelects(escalaId) {
  const [fls, setores] = await Promise.all([
    FreelancerAPI.listar(),
    SetorAPI.listar()
  ]);

  const ativos = fls.filter(f => f.status === 'ativo');

  const selFl = document.getElementById('gf-freelancer');
  selFl.innerHTML = '<option value="">Selecione o funcionário...</option>' +
    ativos.map(f => `<option value="${f.id}" data-valor="${f.valorHora || 0}">${esc(f.nome)} — ${esc(f.especialidade||'')}</option>`).join('');

  const selSt = document.getElementById('gf-setor');
  selSt.innerHTML = '<option value="">Selecione o setor...</option>' +
    setores.map(s => `<option value="${s.id}">${esc(s.nome)}</option>`).join('');

  selFl.onchange = calcularGFValor;
}

// ── Calcula o valor estimado no modal de funcionários ──
function calcularGFValor() {
  const selFl  = document.getElementById('gf-freelancer');
  const option = selFl.selectedOptions[0];
  const vHora  = option ? parseFloat(option.dataset.valor || 0) : 0;

  const escalaId = document.getElementById('modal-gf-escala-id').value;

  // Tenta calcular pela duração da escala
  EscalaAPI.listar().then(list => {
    const e = list.find(e => e.id === parseInt(escalaId) || e.id === escalaId);
    const dur = e ? calcularDuracao((e.horaInicio||'').slice(0,5), (e.horaFim||'').slice(0,5)) : null;
    const total = dur && vHora ? (dur * vHora) : null;

    document.getElementById('gf-valor-hora-display').textContent = vHora ? 'R$ ' + vHora.toFixed(2) : '—';
    document.getElementById('gf-duracao-display').textContent    = dur ? dur + 'h' : '—';
    document.getElementById('gf-total-display').textContent      = total ? 'R$ ' + total.toFixed(2) : '—';
  }).catch(() => {});
}

// ── Adicionar funcionário à escala ──
async function adicionarFuncionarioEscala() {
  const escalaId   = parseInt(document.getElementById('modal-gf-escala-id').value);
  const freelId    = document.getElementById('gf-freelancer').value;
  const setorId    = document.getElementById('gf-setor').value;

  if (!freelId) { showToast('Selecione o funcionário.', 'warning'); return; }
  if (!setorId) { showToast('Selecione o setor.', 'warning'); return; }

  const btn = document.getElementById('btn-adicionar-fn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

  try {
    await EscalaFuncionarioAPI.adicionar(escalaId, {
      freelancerId: parseInt(freelId),
      setorId: parseInt(setorId)
    });
    showToast('Funcionário adicionado!', 'success');
    document.getElementById('gf-freelancer').value = '';
    document.getElementById('gf-setor').value = '';
    document.getElementById('gf-valor-hora-display').textContent = '—';
    document.getElementById('gf-duracao-display').textContent    = '—';
    document.getElementById('gf-total-display').textContent      = '—';
    await renderFuncionariosNaEscala(escalaId);
    // Atualiza também o card na tela de escalas
    const escalas = await EscalaAPI.listar();
    const freelancers = await FreelancerAPI.listar();
    const escala = escalas.find(e => e.id === escalaId);
    if (escala) carregarFuncionariosNoCard(escala, freelancers);
  } catch (err) {
    showToast(err.message || 'Erro ao adicionar.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-plus"></i> Adicionar';
  }
}

// ── Remover funcionário de uma escala ──
async function removerFuncionarioEscala(escalaId, vinculoId) {
  try {
    await EscalaFuncionarioAPI.remover(escalaId, vinculoId);
    showToast('Funcionário removido.', 'success');
    await renderFuncionariosNaEscala(escalaId);
    // Atualiza o card na tela
    const escalas = await EscalaAPI.listar();
    const freelancers = await FreelancerAPI.listar();
    const escala = escalas.find(e => e.id === escalaId);
    if (escala) carregarFuncionariosNoCard(escala, freelancers);
  } catch (err) {
    showToast(err.message || 'Erro ao remover.', 'error');
  }
}

// ── Renderiza lista de funcionários DENTRO do modal de gerenciar ──
async function renderFuncionariosNaEscala(escalaId) {
  const container = document.getElementById('gf-lista');
  if (!container) return;

  container.innerHTML = '<div style="padding:12px;color:var(--text-muted);font-size:.85rem;"><i class="fa fa-spinner fa-spin"></i> Carregando...</div>';

  let vincs = [];
  try { vincs = await EscalaFuncionarioAPI.listar(escalaId); } catch {}

  if (vincs.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:24px;">
        <div class="empty-icon">👥</div>
        <h4>Nenhum funcionário ainda</h4>
        <p>Use o formulário acima para adicionar.</p>
      </div>`;
    return;
  }

  // Agrupa por setor
  const grupos = {};
  let totalGeral = 0;
  vincs.forEach(v => {
    const setor = v.setorNome || 'Sem setor';
    if (!grupos[setor]) grupos[setor] = [];
    grupos[setor].push(v);
    totalGeral += parseFloat(v.valorTotal || 0);
  });

  const setorColors = {
    'Cozinha': '#2563EB', 'Garçom': '#16A34A', 'Atividades': '#9333EA',
    'Bar': '#D97706', 'Recepção': '#0891B2'
  };

  container.innerHTML = Object.entries(grupos).map(([setor, lista]) => {
    const cor = setorColors[setor] || '#6B7280';
    return `
      <div style="margin-bottom:16px;">
        <div style="font-size:.72rem;font-weight:700;color:${cor};text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;padding:6px 12px;background:${cor}18;border-radius:6px;">
          ${setor} — ${lista.length} funcionário${lista.length !== 1 ? 's' : ''}
        </div>
        ${lista.map(v => {
          const nome  = v.freelancerNome || 'Funcionário';
          const valor = parseFloat(v.valorTotal || 0).toFixed(2);
          const dist  = v.freelancerDistancia != null ? `${v.freelancerDistancia} km` : '';
          return `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--border-light);border-radius:8px;margin-bottom:6px;">
              <div>
                <div style="font-size:.88rem;font-weight:600;">${esc(nome)}</div>
                ${dist ? `<div style="font-size:.75rem;color:var(--text-muted);">${dist} do Rancho</div>` : ''}
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:.85rem;font-weight:700;color:var(--success);">R$ ${valor}</span>
                <button onclick="removerFuncionarioEscala(${escalaId}, ${v.id})"
                        style="width:28px;height:28px;border-radius:50%;border:none;background:var(--error-bg);color:var(--error);cursor:pointer;display:flex;align-items:center;justify-content:center;"
                        title="Remover">
                  <i class="fa fa-times" style="font-size:.75rem;"></i>
                </button>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  }).join('') + `
    <div style="padding:10px 12px;border-top:1px solid var(--border);margin-top:8px;display:flex;justify-content:space-between;font-size:.85rem;">
      <span style="color:var(--text-muted);">${vincs.length} funcionário${vincs.length !== 1 ? 's' : ''} total</span>
      <span style="font-weight:700;color:var(--primary);">Custo: R$ ${totalGeral.toFixed(2)}</span>
    </div>`;
}

function confirmarExclusaoEscala(id) {
  document.getElementById('confirm-title').textContent = 'Excluir escala?';
  document.getElementById('confirm-msg').textContent   = 'Todos os funcionários vinculados serão removidos. Esta ação não pode ser desfeita.';

  const btn = document.getElementById('btn-confirmar-delete');
  btn.onclick = async () => {
    fecharModal('modal-confirmar');
    try {
      await EscalaAPI.excluir(id);
      showToast('Escala excluída.', 'success');
      await renderEscalas();
      updateDashboard();
      renderPagamentos();
    } catch (err) {
      showToast(err.message || 'Erro ao excluir.', 'error');
    }
  };
  abrirModal('modal-confirmar');
}

function limparFormEscala() {
  document.getElementById('form-escala').reset();
  document.getElementById('esc-id').value = '';
  document.getElementById('esc-duracao').textContent = '—';
  document.getElementById('esc-valor-hora-display').textContent = '—';
  document.getElementById('esc-total-display').textContent = '—';
  clearModalAlert('modal-esc-alert');
  document.querySelectorAll('#form-escala .form-group').forEach(g => g.classList.remove('has-error'));
}

// ══════════════════════════════════════════════════════════════
// PAGAMENTOS
// ══════════════════════════════════════════════════════════════

async function renderPagamentos() {
  const escalas     = await EscalaAPI.listar();
  const freelancers = await FreelancerAPI.listar();

  const confirmadas = escalas.filter(e => e.status === 'confirmado');
  const pagamentos  = lsGet('rc_pagamentos');

  const totalPago    = pagamentos.filter(p => p.statusPagamento === 'pago').reduce((s, p) => s + (p.total || 0), 0);
  const totalPendente = confirmadas.reduce((s, e) => s + (parseFloat(e.valorTotal) || 0), 0);

  document.getElementById('pag-pago').textContent     = 'R$ ' + totalPago.toFixed(2).replace('.', ',');
  document.getElementById('pag-pendente').textContent = 'R$ ' + totalPendente.toFixed(2).replace('.', ',');
  document.getElementById('pag-escalas').textContent  = confirmadas.length;
  document.getElementById('pag-freelancers').textContent = freelancers.filter(f => f.status === 'ativo').length;

  const tbody = document.getElementById('pag-tbody');

  if (confirmadas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">
      <div class="empty-icon">💰</div>
      <h4>Nenhum pagamento registrado</h4>
      <p>Confirme escalas para gerar registros de pagamento</p>
    </div></td></tr>`;
    return;
  }

  tbody.innerHTML = confirmadas.map(e => {
    const fl = freelancers.find(f => f.id === e.freelancerId) || {};
    const dur = calcularDuracao(e.horaInicio, e.horaFim);
    const pag = pagamentos.find(p => p.escalaId === e.id);
    const statusPag = pag?.statusPagamento || 'pendente';

    return `<tr>
      <td><div class="person-cell">
        <div class="avatar ${avatarColor(fl.id)}">${initials(fl.nome || '?')}</div>
        <div>
          <div class="person-name">${esc(fl.nome || '—')}</div>
          <div class="person-sub">${esc(fl.especialidade || '—')}</div>
        </div>
      </div></td>
      <td>${formatDate(e.data)} · ${e.horaInicio || '--'}–${e.horaFim || '--'}</td>
      <td>${dur ? dur + 'h' : '—'}</td>
      <td>${fl.valorHora ? 'R$ ' + parseFloat(fl.valorHora).toFixed(2).replace('.', ',') : '—'}</td>
      <td class="fw-bold">${e.valorTotal ? 'R$ ' + parseFloat(e.valorTotal).toFixed(2).replace('.', ',') : '—'}</td>
      <td><span class="badge ${statusPag === 'pago' ? 'badge-success' : 'badge-warning'}">${statusPag}</span></td>
      <td>
        <div class="table-actions">
          ${statusPag !== 'pago'
            ? `<button class="btn btn-sm btn-success" onclick="marcarPago(${e.id})">
                 <i class="fa fa-check"></i> Pagar
               </button>`
            : '<span class="text-success text-sm fw-semi"><i class="fa fa-check-circle"></i> Pago</span>'}
        </div>
      </td>
    </tr>`;
  }).join('');
}

async function marcarPago(escalaId) {
  try {
    let pagamentos = lsGet('rc_pagamentos');
    const idx = pagamentos.findIndex(p => p.escalaId === escalaId);
    if (idx >= 0) {
      pagamentos[idx].statusPagamento = 'pago';
      pagamentos[idx].dataPagamento   = new Date().toISOString();
    } else {
      pagamentos.push({ id: nextId(pagamentos), escalaId, statusPagamento: 'pago', dataPagamento: new Date().toISOString() });
    }
    lsSet('rc_pagamentos', pagamentos);
    showToast('Pagamento registrado!', 'success');
    renderPagamentos();
  } catch (err) {
    showToast('Erro ao registrar pagamento.', 'error');
  }
}

// ══════════════════════════════════════════════════════════════
// UTILITÁRIOS
// ══════════════════════════════════════════════════════════════

function calcularDuracao(inicio, fim) {
  if (!inicio || !fim) return null;
  const [h1, m1] = inicio.split(':').map(Number);
  const [h2, m2] = fim.split(':').map(Number);
  const mins = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (mins <= 0) return null;
  return parseFloat((mins / 60).toFixed(1));
}

function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function statusBadge(status) {
  const map = {
    confirmado: 'badge-success',
    pendente:   'badge-warning',
    cancelado:  'badge-error'
  };
  return map[status] || 'badge-neutral';
}

function initials(nome) {
  if (!nome) return '?';
  return nome.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function avatarColor(id) {
  const colors = ['av-1', 'av-2', 'av-3', 'av-4', 'av-5', 'av-6', 'av-7'];
  return colors[(id || 0) % colors.length];
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setBtnLoading(btnId, textId, spinnerId, on) {
  const btn = document.getElementById(btnId);
  if (btn) btn.disabled = on;
  const textEl = document.getElementById(textId);
  if (textEl) textEl.textContent = on ? 'Salvando...' : textEl.dataset.orig || textEl.textContent;
  const spinEl = document.getElementById(spinnerId);
  if (spinEl) spinEl.classList.toggle('hidden', !on);
}

function lsGet(key, def = []) {
  try { return JSON.parse(localStorage.getItem(key)) || def; }
  catch { return def; }
}

function lsSet(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function nextId(list) {
  return list.length ? Math.max(...list.map(i => i.id || 0)) + 1 : 1;
}
