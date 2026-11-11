import { DAY_LONG, DAY_SHORT, escapeHTML, fullDate, getMonday, iconSvg, loadRoutines, makeId, saveRoutines } from './data.js';

const grid = document.querySelector('#routine-grid');
const track = document.querySelector('#today-track');
const modal = document.querySelector('#routine-modal');
const modalContent = document.querySelector('#modal-content');
const routines = loadRoutines();
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
  renderHeaderDates();
  renderWeek();
  renderToday();
  renderCards();
}

document.querySelector('#routine-search')?.addEventListener('input', renderCards);
document.querySelector('#customize-all')?.addEventListener('click', openOverviewEditor);
document.querySelector('#customize-shortcut')?.addEventListener('click', openOverviewEditor);

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

renderAll();
