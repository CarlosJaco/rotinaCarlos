// Ritmo — JavaScript principal (sem módulos/imports, compatível com HTML aberto em pasta local).

const STORAGE_KEY = 'ritmo-routines-v1';

const SEED_ROUTINES = [
  { id: 'estudo', name: 'Estudo', description: 'Um espaço para aprender sem pressa.', goal: '4 sessões esta semana', color: '#8277dc', icon: 'study', url: '#estudo', tasks: [
    { id: 's1', title: 'Revisar o que aprendi', time: '07:30', days: [1, 3, 5], done: false },
    { id: 's2', title: 'Bloco de foco: matemática', time: '18:30', days: [1, 2, 3, 4, 5], done: false },
    { id: 's3', title: 'Leitura sem distrações', time: '20:00', days: [2, 4], done: false }
  ] },
  { id: 'trabalho', name: 'Trabalho', description: 'Organize as entregas sem esquecer de você.', goal: 'Uma prioridade por vez', color: '#667abf', icon: 'work', url: '#trabalho', tasks: [
    { id: 'w1', title: 'Definir as três prioridades', time: '08:30', days: [1, 2, 3, 4, 5], done: false },
    { id: 'w2', title: 'Pausa para respirar', time: '11:00', days: [1, 2, 3, 4, 5], done: false },
    { id: 'w3', title: 'Fechar o dia com leveza', time: '17:30', days: [1, 2, 3, 4, 5], done: false }
  ] },
  { id: 'lazer', name: 'Lazer', description: 'Seu tempo livre também merece lugar na agenda.', goal: 'Tempo para recarregar', color: '#d99370', icon: 'leisure', url: '#lazer', tasks: [
    { id: 'l1', title: 'Um episódio e um chá', time: '20:30', days: [2, 4, 6], done: false },
    { id: 'l2', title: 'Encontrar quem me faz bem', time: '15:00', days: [6], done: false },
    { id: 'l3', title: 'Uma tarde sem planos', time: '14:00', days: [7], done: false }
  ] },
  { id: 'hobby', name: 'Hobby', description: 'Cultive seus interesses, sem precisar de motivo.', goal: 'Um tempo só seu', color: '#659678', icon: 'hobby', url: '#hobby', tasks: [
    { id: 'h1', title: 'Praticar um pouco de violão', time: '18:00', days: [2, 4], done: false },
    { id: 'h2', title: 'Fotografar uma ideia', time: '10:30', days: [6], done: false },
    { id: 'h3', title: 'Ler por prazer', time: '16:00', days: [7], done: false }
  ] },
  { id: 'esportes', name: 'Esportes', description: 'Mexer o corpo pode ser leve. E pode ser seu.', goal: 'Movimento sem cobrança', color: '#d18d53', icon: 'sports', url: '#esportes', tasks: [
    { id: 'e1', title: 'Uma caminhada ao ar livre', time: '07:00', days: [1, 3, 5], done: false },
    { id: 'e2', title: 'Alongar, no meu tempo', time: '17:00', days: [2, 4, 6], done: false },
    { id: 'e3', title: 'Experimentar uma aula nova', time: '09:30', days: [6], done: false }
  ] },
  { id: 'saude', name: 'Saúde', description: 'Cuidar de você pode começar por algo pequeno.', goal: 'Pequenos cuidados contam', color: '#c86f7d', icon: 'health', url: '#saude', tasks: [
    { id: 'm1', title: 'Um copo de água ao acordar', time: '07:15', days: [1, 2, 3, 4, 5, 6, 7], done: false },
    { id: 'm2', title: 'Pausa para respirar', time: '12:30', days: [1, 2, 3, 4, 5], done: false },
    { id: 'm3', title: 'Preparar uma noite tranquila', time: '21:00', days: [1, 2, 3, 4, 5, 6, 7], done: false }
  ] }
];

const DAY_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const DAY_LONG = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'];

const ICONS = {
  study: '<path d="M3 19.5A2.5 2.5 0 0 1 5.5 17H21"/><path d="M5.5 2H21v20H5.5A2.5 2.5 0 0 1 3 19.5v-15A2.5 2.5 0 0 1 5.5 2Z"/><path d="M8 7h8M8 11h7"/>',
  work: '<rect x="3" y="7" width="18" height="14" rx="2.5"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2"/>',
  leisure: '<path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12"/><circle cx="12" cy="12" r="5"/>',
  hobby: '<path d="M6 4a2 2 0 0 1 4 0v3h4V4a2 2 0 0 1 4 0v5a6 6 0 0 1-12 0V4Z"/><path d="M8 16v4m8-4v4m-8 0h8"/>',
  sports: '<path d="m7 4 4 2 4-2 3 3-2 4 2 4-3 3-4-2-4 2-3-3 2-4-2-4 3-3Z"/><circle cx="11" cy="11" r="2"/><path d="m15 15 3 3"/>',
  health: '<path d="M20.8 8.8c0 5.1-8.8 10.2-8.8 10.2S3.2 13.9 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z"/><path d="M7.5 11.5h3l1.5-3 2 6 1.3-3h2.2"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>'
};

function iconSvg(name, className = '') {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.leisure}</svg>`;
}

function loadRoutines() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length) {
      const defaults = new Map(SEED_ROUTINES.map(item => [item.id, item]));
      return saved.map(item => {
        const fallback = defaults.get(item.id);
        if (!fallback) return item;
        return {
          ...fallback,
          ...item,
          color: /^#[0-9a-f]{6}$/i.test(item.color || '') ? item.color : fallback.color,
          tasks: Array.isArray(item.tasks) ? item.tasks.map(task => ({ ...task, days: Array.isArray(task.days) ? task.days.filter(day => Number(day) >= 1 && Number(day) <= 7).map(Number) : [1] })) : fallback.tasks
        };
      }).concat(SEED_ROUTINES.filter(item => !saved.some(entry => entry.id === item.id)));
    }
  } catch (error) {
    console.warn('As rotinas salvas não puderam ser lidas; usando a organização inicial.', error);
  }
  return structuredClone(SEED_ROUTINES);
}

function saveRoutines(routines) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
    return true;
  } catch (error) {
    console.error('Não foi possível salvar suas alterações neste navegador.', error);
    return false;
  }
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `ritmo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getMonday(date = new Date()) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const day = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - day);
  return monday;
}

function dayIndex(date) {
  return (date.getDay() + 6) % 7;
}

function fullDate(date, options = {}) {
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

// Interações do painel principal.

let grid = document.querySelector('#routine-grid');
let track = document.querySelector('#today-track');
const modal = document.querySelector('#routine-modal');
const modalContent = document.querySelector('#modal-content');
const mainContent = document.querySelector('.main-content');
const dashboardMarkup = mainContent.innerHTML;
const routines = loadRoutines();
let activeCategory = null;
let selectedDate = new Date();
selectedDate.setHours(12, 0, 0, 0);
let toastTimer;

function accentSoft(hex) {
  return `color-mix(in srgb, ${hex} 13%, white)`;
}

function getRoutine(id) {
  return routines.find(item => item.id === id);
}

function persist(message = 'Sua rotina ficou salva neste navegador.') {
  const ok = saveRoutines(routines);
  showToast(ok ? message : 'Não foi possível salvar. Verifique o espaço disponível neste navegador.', !ok);
  renderAll();
}

function showToast(message, isError = false) {
  const region = document.querySelector('#toast-region');
  if (!region) return;
  window.clearTimeout(toastTimer);
  region.innerHTML = `<div class="toast${isError ? ' is-error' : ''}" role="status">${escapeHTML(message)}</div>`;
  toastTimer = window.setTimeout(() => { region.innerHTML = ''; }, 3000);
}

function selectedIndex() {
  return (selectedDate.getDay() + 6) % 7;
}

function renderHeaderDates() {
  const heroDate = document.querySelector('[data-current-date]');
  const heroDay = document.querySelector('[data-current-weekday]');
  if (heroDay) heroDay.textContent = fullDate(selectedDate, { weekday: 'long' }).toLocaleUpperCase('pt-BR');
  if (heroDate) heroDate.textContent = fullDate(selectedDate, { day: 'numeric', month: 'long' }).toLocaleUpperCase('pt-BR');
  const displayDate = document.querySelector('[data-selected-date]');
  if (displayDate) displayDate.textContent = fullDate(selectedDate, { weekday: 'long', day: 'numeric', month: 'short' }).toLocaleUpperCase('pt-BR');
  const title = document.querySelector('#hero-title');
  const isToday = new Date().toDateString() === selectedDate.toDateString();
  if (title) title.innerHTML = isToday ? 'Um dia de cada vez.<br><span>No seu ritmo.</span>' : `${DAY_LONG[selectedIndex()].replace('-feira', '')},<br><span>no seu ritmo.</span>`;
}

function renderWeek() {
  const strip = document.querySelector('#week-days');
  if (!strip) return;
  const monday = getMonday(selectedDate);
  strip.innerHTML = DAY_SHORT.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const active = date.toDateString() === selectedDate.toDateString();
    const hasActivities = routines.some(routine => routine.tasks.some(task => task.days.includes(index + 1)));
    return `<button type="button" class="week-day${active ? ' is-selected' : ''}" data-day-index="${index}" aria-label="${DAY_LONG[index]}, ${date.getDate()}" aria-pressed="${active}"><span><span class="day-letter">${label}</span><span class="day-number">${date.getDate()}</span></span>${hasActivities ? '<span class="day-indicator" aria-hidden="true"></span>' : ''}</button>`;
  }).join('');
  strip.querySelectorAll('[data-day-index]').forEach(button => button.addEventListener('click', () => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + Number(button.dataset.dayIndex));
    selectedDate = date;
    renderAll();
  }));
  const summary = document.querySelector('#week-summary-text');
  if (summary) {
    const allTasks = routines.flatMap(routine => routine.tasks.filter(task => task.days.includes(selectedIndex() + 1)));
    const completed = allTasks.filter(task => task.done).length;
    summary.textContent = allTasks.length ? `${completed} de ${allTasks.length} passos feitos nesse dia` : 'Um dia em aberto, do seu jeito.';
  }
}

function renderToday() {
  if (!track) return;
  const day = selectedIndex() + 1;
  const items = routines.flatMap(routine => routine.tasks
    .filter(task => task.days.includes(day))
    .map(task => ({ routine, task })))
    .sort((left, right) => left.task.time.localeCompare(right.task.time))
    .slice(0, 4);

  if (!items.length) {
    track.innerHTML = '<div class="today-empty">Sem planos por aqui. Um dia em aberto também é um bom plano.</div>';
    return;
  }
  track.innerHTML = items.map(({ routine, task }) => `<article class="today-item" style="--accent:${routine.color}"><div class="today-item-top"><span class="today-node">${iconSvg(routine.icon)}</span><time class="today-time">${escapeHTML(task.time)}</time></div><button class="today-task${task.done ? ' is-done' : ''}" type="button" data-toggle-task="${escapeHTML(task.id)}" data-routine-id="${escapeHTML(routine.id)}" aria-pressed="${task.done}" aria-label="${task.done ? 'Marcar como pendente' : 'Marcar como feito'}: ${escapeHTML(task.title)}">${escapeHTML(task.title)}</button></article>`).join('');
}

function renderCards() {
  if (!grid) return;
  const search = document.querySelector('#routine-search')?.value.trim().toLocaleLowerCase('pt-BR') || '';
  const cards = routines.map(routine => {
    const total = routine.tasks.length;
    const complete = routine.tasks.filter(task => task.done).length;
    const percent = total ? Math.round(complete / total * 100) : 0;
    const next = routine.tasks.filter(task => task.days.includes(selectedIndex() + 1)).sort((a, b) => a.time.localeCompare(b.time))[0];
    const searchable = `${routine.name} ${routine.description} ${routine.tasks.map(task => task.title).join(' ')}`.toLocaleLowerCase('pt-BR');
    const hidden = search && !searchable.includes(search);
    return `<article class="routine-card${hidden ? ' is-hidden-by-search' : ''}" data-routine-card="${escapeHTML(routine.id)}" style="--accent:${routine.color};--accent-soft:${accentSoft(routine.color)};--progress:${percent}%"><button class="card-open" type="button" data-open-routine="${escapeHTML(routine.id)}" aria-label="Abrir detalhes de ${escapeHTML(routine.name)}"></button><div class="card-top"><span class="card-icon">${iconSvg(routine.icon)}</span><a class="card-more card-page" href="${escapeHTML(routine.url)}" aria-label="Abrir página de ${escapeHTML(routine.name)}">↗</a></div><strong class="card-name">${escapeHTML(routine.name)}</strong><p class="card-description">${escapeHTML(routine.description)}</p><div class="card-footer"><span class="card-next">${iconSvg('arrow')}${next ? `${escapeHTML(next.time)} · ${escapeHTML(next.title)}` : `${complete}/${total} passos concluídos`}</span><span class="card-progress" aria-label="${percent}% concluído"><span></span></span></div></article>`;
  });
  const visible = cards.filter((_, index) => !search || `${routines[index].name} ${routines[index].description} ${routines[index].tasks.map(task => task.title).join(' ')}`.toLocaleLowerCase('pt-BR').includes(search));
  grid.innerHTML = `${visible.length ? visible.join('') : ''}<div class="search-empty${visible.length ? '' : ' is-visible'}">Não encontrei nada com esse nome. Tente outro termo.</div>`;
}

function modalTasks(routine) {
  const rows = routine.tasks.slice().sort((a, b) => a.time.localeCompare(b.time));
  return rows.length ? rows.map(task => {
    const days = task.days.map(day => DAY_SHORT[day - 1]).join(', ');
    return `<div class="modal-task-row"><div class="modal-task-copy"><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.time)} · ${escapeHTML(days || 'sem dia definido')}</small></div><button class="modal-task-delete" type="button" data-delete-task="${escapeHTML(task.id)}" data-routine-id="${escapeHTML(routine.id)}" aria-label="Excluir atividade ${escapeHTML(task.title)}">×</button></div>`;
  }).join('') : '<p class="modal-description">Nenhuma atividade ainda. Adicione a primeira abaixo.</p>';
}

function openRoutineModal(id) {
  const routine = getRoutine(id);
  if (!routine || !modal || !modalContent) return;
  modal.style.setProperty('--accent', routine.color);
  modal.style.setProperty('--accent-soft', accentSoft(routine.color));
  modalContent.innerHTML = `<div class="modal-head"><span class="modal-icon">${iconSvg(routine.icon)}</span><div><p class="modal-eyebrow">DO SEU JEITO, SEM PRESSA</p><h2 id="modal-title">${escapeHTML(routine.name)}</h2></div></div><p class="modal-description">Ajuste esse cantinho para ele caber melhor na sua vida. Suas mudanças ficam salvas neste navegador.</p><form class="modal-form" id="routine-edit-form" data-routine-id="${escapeHTML(routine.id)}"><label class="span-two">NOME DA ROTINA<input name="name" maxlength="36" required value="${escapeHTML(routine.name)}"></label><label class="span-two">DESCRIÇÃO<textarea name="description" maxlength="150" required>${escapeHTML(routine.description)}</textarea></label><label>META PESSOAL<input name="goal" maxlength="40" value="${escapeHTML(routine.goal)}" placeholder="Ex.: 3 vezes na semana"></label><label>COR<input type="color" name="color" value="${escapeHTML(routine.color)}" aria-label="Cor da rotina"></label></form><p class="modal-section-title">SUAS ATIVIDADES</p><div class="modal-task-list" id="modal-task-list">${modalTasks(routine)}</div><form class="modal-add-form" id="modal-add-form" data-routine-id="${escapeHTML(routine.id)}"><input name="title" maxlength="80" type="text" placeholder="Adicionar uma atividade" aria-label="Nome da atividade" required><input name="time" type="time" value="09:00" aria-label="Horário"><button type="submit" aria-label="Adicionar atividade">＋</button></form><div class="modal-actions"><a class="modal-detail-link" href="${escapeHTML(routine.url)}">Abrir página completa <span>↗</span></a><button class="modal-save" type="submit" form="routine-edit-form">Salvar mudanças</button></div>`;
  modal.showModal();
  modal.querySelector('input[name="name"]')?.focus({ preventScroll: true });
}

function openOverviewEditor() {
  if (!modal || !modalContent) return;
  modal.style.setProperty('--accent', '#343e86');
  modal.style.setProperty('--accent-soft', '#ebedf8');
  modalContent.innerHTML = `<div class="modal-head"><span class="modal-icon">${iconSvg('hobby')}</span><div><p class="modal-eyebrow">SEU ESPAÇO, DO SEU JEITO</p><h2 id="modal-title">Por onde começamos?</h2></div></div><p class="modal-description">Escolha uma rotina para editar horários, atividades, cor e descrição. As alterações ficam salvas neste navegador.</p><div class="category-picker">${routines.map(routine => `<button type="button" class="category-choice" data-choose-routine="${escapeHTML(routine.id)}" style="--accent:${routine.color};--accent-soft:${accentSoft(routine.color)}"><span class="modal-icon">${iconSvg(routine.icon)}</span><span><strong>${escapeHTML(routine.name)}</strong><span>${routine.tasks.length} atividades · ${routine.goal ? escapeHTML(routine.goal) : 'sem meta'}</span></span></button>`).join('')}</div>`;
  modal.showModal();
}

function renderAll() {
  if (activeCategory) {
    renderCategoryView(activeCategory);
    return;
  }
  grid = document.querySelector('#routine-grid');
  track = document.querySelector('#today-track');
  renderHeaderDates();
  renderWeek();
  renderToday();
  renderCards();
}

document.addEventListener('input', event => { if (event.target.id === 'routine-search') renderCards(); });

document.addEventListener('click', event => {
  const open = event.target.closest('[data-open-routine]');
  if (open) openRoutineModal(open.dataset.openRoutine);
  const choose = event.target.closest('[data-choose-routine]');
  if (choose) openRoutineModal(choose.dataset.chooseRoutine);
  const remove = event.target.closest('[data-delete-task]');
  if (remove) {
    const routine = getRoutine(remove.dataset.routineId);
    if (!routine) return;
    routine.tasks = routine.tasks.filter(task => task.id !== remove.dataset.deleteTask);
    saveRoutines(routines);
    const content = document.querySelector('#modal-task-list');
    if (content) content.innerHTML = modalTasks(routine);
    showToast('Atividade removida. O espaço também faz parte da rotina.');
    renderAll();
  }
  const toggle = event.target.closest('[data-toggle-task]');
  if (toggle) {
    const routine = getRoutine(toggle.dataset.routineId);
    const task = routine?.tasks.find(item => item.id === toggle.dataset.toggleTask);
    if (task) { task.done = !task.done; persist(task.done ? 'Passo concluído. Que bom.' : 'Passo voltou para a lista.'); }
  }
});

modal?.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', event => { if (event.target === modal) modal.close(); });
modal?.addEventListener('submit', event => {
  if (event.target.id === 'routine-edit-form') {
    event.preventDefault();
    const routine = getRoutine(event.target.dataset.routineId);
    if (!routine) return;
    const form = new FormData(event.target);
    const name = String(form.get('name') || '').trim();
    const description = String(form.get('description') || '').trim();
    if (!name || !description) return;
    routine.name = name;
    routine.description = description;
    routine.goal = String(form.get('goal') || '').trim();
    const color = String(form.get('color') || '');
    if (/^#[0-9a-f]{6}$/i.test(color)) routine.color = color;
    saveRoutines(routines);
    modal.close();
    showToast('Rotina atualizada. Ficou com a sua cara.');
    renderAll();
  }
  if (event.target.id === 'modal-add-form') {
    event.preventDefault();
    const routine = getRoutine(event.target.dataset.routineId);
    const form = new FormData(event.target);
    const title = String(form.get('title') || '').trim();
    if (!routine || !title) return;
    routine.tasks.push({ id: makeId(), title, time: String(form.get('time') || '09:00'), days: [1, 2, 3, 4, 5], done: false });
    saveRoutines(routines);
    document.querySelector('#modal-task-list').innerHTML = modalTasks(routine);
    event.target.reset();
    event.target.querySelector('input[name="title"]')?.focus();
    showToast('Atividade incluída na sua rotina.');
    renderAll();
  }
});

function categoryMarkup(routine) {
  return `<header class="topbar"><div class="breadcrumb"><a href="#inicio">Meu espaço</a><span class="crumb-slash">/</span><strong>${escapeHTML(routine.name)}</strong></div><a class="back-link" href="#inicio"><span aria-hidden="true">←</span> Voltar ao painel</a></header><section class="detail-hero" id="detail-hero" style="--accent:${routine.color};--accent-soft:${accentSoft(routine.color)}"><div class="detail-mark">${iconSvg(routine.icon)}</div><div class="detail-kicker">CADA COISA NO SEU TEMPO <span>✳</span></div><h1>${escapeHTML(routine.name)}</h1><p>${escapeHTML(routine.description)}</p><div class="detail-hero-meta"><span class="detail-goal">${escapeHTML(routine.goal || 'Sem meta definida — tudo bem.')}</span><button class="edit-detail" type="button" data-edit-category="${escapeHTML(routine.id)}">Personalizar rotina <span aria-hidden="true">↗</span></button></div><div class="detail-orbit orbit-one"></div><div class="detail-orbit orbit-two"></div><div class="detail-hero-shape" aria-hidden="true"><span class="shape-book">✳</span><span class="shape-leaf">⌁</span><span class="shape-clock">◷</span></div></section><section class="detail-stats" aria-label="Resumo da rotina"><article class="detail-stat"><span class="stat-label">NA SUA LISTA</span><strong data-category-count>0 atividades</strong><small>do jeitinho que você planejou</small></article><article class="detail-stat"><span class="stat-label">JÁ CONCLUÍDAS</span><strong data-category-done>0 passos</strong><small>cada avanço também conta</small></article><article class="detail-stat detail-stat-progress"><span class="stat-label">SEU PROGRESSO</span><strong data-category-progress>0%</strong><div class="progress-track"><span data-category-progress-bar></span></div></article></section><section class="detail-tasks-section"><div class="section-heading"><div><p class="section-kicker">UMA COISA DE CADA VEZ</p><h2>Seus próximos passos</h2></div><a class="return-routines" href="#rotinas">Ver todas as rotinas <span aria-hidden="true">↗</span></a></div><form class="add-task-form" id="add-task-form"><label class="add-task-field"><span class="sr-only">Nova atividade</span><input id="new-task-title" name="title" type="text" maxlength="80" placeholder="Tem algo novo para incluir?" required></label><label class="add-time-field"><span class="sr-only">Horário</span><input id="new-task-time" name="time" type="time" value="09:00" required></label><button class="add-task-button" type="submit"><span aria-hidden="true">＋</span> Adicionar</button></form><div class="weekday-picker" id="weekday-picker"><span class="weekday-label">Em quais dias?</span>${DAY_SHORT.map((day,index) => `<label><input type="checkbox" name="task-day" value="${index + 1}"${index === 0 ? ' checked' : ''}><span>${day}</span></label>`).join('')}</div><div class="task-list" id="task-list" aria-live="polite"></div></section><footer class="footer"><a class="footer-brand" href="#inicio">ritmo.</a><span>Não precisa ser perfeito para ser seu.</span><a href="#detail-hero" class="back-top">Voltar ao topo ↑</a></footer>`;
}

function renderCategoryView(id) {
  const routine = getRoutine(id);
  if (!routine) return showDashboard();
  activeCategory = id;
  document.title = `${routine.name} — Ritmo`;
  document.body.style.setProperty('--accent', routine.color);
  mainContent.innerHTML = categoryMarkup(routine);
  document.querySelectorAll('.category-links .side-link').forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const count = routine.tasks.length;
  const done = routine.tasks.filter(task => task.done).length;
  const percent = count ? Math.round(done / count * 100) : 0;
  document.querySelector('[data-category-count]').textContent = `${count} ${count === 1 ? 'atividade' : 'atividades'}`;
  document.querySelector('[data-category-done]').textContent = `${done} ${done === 1 ? 'passo' : 'passos'}`;
  document.querySelector('[data-category-progress]').textContent = `${percent}%`;
  document.querySelector('[data-category-progress-bar]').style.width = `${percent}%`;
  const taskList = document.querySelector('#task-list');
  taskList.innerHTML = count ? routine.tasks.slice().sort((a,b) => a.time.localeCompare(b.time)).map(task => `<article class="task-row${task.done ? ' is-done' : ''}"><button class="task-check" type="button" data-category-task="toggle" data-task-id="${escapeHTML(task.id)}" aria-pressed="${task.done}" aria-label="${task.done ? 'Marcar como pendente' : 'Marcar como concluída'}: ${escapeHTML(task.title)}">✓</button><div class="task-copy"><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.days.map(day => DAY_SHORT[day - 1]).join(' · ') || 'Sem dias definidos')}</small></div><time class="task-time">${escapeHTML(task.time)}</time><button class="task-delete" type="button" data-category-task="delete" data-task-id="${escapeHTML(task.id)}" aria-label="Excluir ${escapeHTML(task.title)}">×</button></article>`).join('') : '<div class="task-empty">Este espaço está em branco. Adicione uma ideia acima e comece por onde quiser.</div>';
}

function showDashboard() {
  activeCategory = null;
  document.title = 'Ritmo — Sua rotina, no seu ritmo';
  document.body.style.removeProperty('--accent');
  mainContent.innerHTML = dashboardMarkup;
  document.querySelectorAll('.category-links .side-link').forEach(link => {
    link.classList.remove('is-active');
    link.removeAttribute('aria-current');
  });
  document.querySelector('.side-link[href="#inicio"]')?.classList.add('is-active');
  renderAll();
}

function routeFromHash() {
  const route = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (modal.open) modal.close();
  if (routines.some(item => item.id === route)) {
    renderCategoryView(route);
    return;
  }
  if (activeCategory) showDashboard();
  if (route === 'rotinas' || route === 'semana') {
    requestAnimationFrame(() => document.getElementById(route)?.scrollIntoView({ behavior: 'smooth' }));
  }
}

mainContent.addEventListener('submit', event => {
  if (event.target.id !== 'add-task-form' || !activeCategory) return;
  event.preventDefault();
  const routine = getRoutine(activeCategory);
  const title = document.querySelector('#new-task-title').value.trim();
  const time = document.querySelector('#new-task-time').value || '09:00';
  const days = [...document.querySelectorAll('input[name="task-day"]:checked')].map(input => Number(input.value));
  if (!title) return;
  if (!days.length) return showToast('Escolha ao menos um dia para esta atividade.');
  routine.tasks.push({ id: makeId(), title, time, days, done: false });
  saveRoutines(routines);
  renderCategoryView(activeCategory);
  showToast('Atividade adicionada. Um passo de cada vez.');
});

mainContent.addEventListener('click', event => {
  const edit = event.target.closest('[data-edit-category]');
  if (edit) openRoutineModal(edit.dataset.editCategory);
  const taskAction = event.target.closest('[data-category-task]');
  if (taskAction && activeCategory) {
    const routine = getRoutine(activeCategory);
    const task = routine.tasks.find(item => item.id === taskAction.dataset.taskId);
    if (!task) return;
    if (taskAction.dataset.categoryTask === 'toggle') task.done = !task.done;
    if (taskAction.dataset.categoryTask === 'delete') routine.tasks = routine.tasks.filter(item => item.id !== task.id);
    saveRoutines(routines);
    renderCategoryView(activeCategory);
    showToast(task.done ? 'Passo concluído. Que bom.' : taskAction.dataset.categoryTask === 'delete' ? 'Atividade removida.' : 'Passo voltou para sua lista.');
  }
});

document.addEventListener('click', event => {
  if (event.target.closest('#customize-all, #customize-shortcut')) openOverviewEditor();
});
window.addEventListener('hashchange', routeFromHash);
window.addEventListener('popstate', routeFromHash);

if (routines.some(item => item.id === location.hash.replace(/^#/, ''))) routeFromHash();
else renderAll();

document.addEventListener('error', event => {
  if (event.target.matches?.('.hero-art img')) event.target.remove();
}, true);
