import { DAY_SHORT, escapeHTML, iconSvg, loadRoutines, makeId, saveRoutines } from './data.js';

const page = document.body.dataset.category;
const routines = loadRoutines();
const routine = routines.find(item => item.id === page);
const modal = document.querySelector('#routine-modal');
const modalContent = document.querySelector('#modal-content');
let toastTimer;

if (!routine) {
  window.location.replace('/');
} else {
  document.title = `${routine.name} — Ritmo`;
  document.body.style.setProperty('--accent', routine.color);
  document.body.style.setProperty('--accent-soft', `color-mix(in srgb, ${routine.color} 13%, white)`);
  document.querySelector('[data-page-breadcrumb]').textContent = routine.name;
  render();
}

function showToast(message) {
  const region = document.querySelector('#toast-region');
  if (!region) return;
  window.clearTimeout(toastTimer);
  region.innerHTML = `<div class="toast" role="status">${escapeHTML(message)}</div>`;
  toastTimer = window.setTimeout(() => { region.innerHTML = ''; }, 2800);
}

function daysLabel(days) {
  return days.length ? days.slice().sort((a, b) => a - b).map(day => DAY_SHORT[day - 1]).join(' · ') : 'Sem dias definidos';
}

function render() {
  if (!routine) return;
  routine.tasks.sort((a, b) => a.time.localeCompare(b.time));
  const mark = document.querySelector('#detail-mark');
  const title = document.querySelector('#detail-title');
  const description = document.querySelector('#detail-description');
  const goal = document.querySelector('#detail-goal');
  if (mark) mark.innerHTML = iconSvg(routine.icon);
  if (title) title.textContent = routine.name;
  if (description) description.textContent = routine.description;
  if (goal) goal.textContent = routine.goal || 'Sem meta definida — tudo bem.';

  const total = routine.tasks.length;
  const done = routine.tasks.filter(task => task.done).length;
  const progress = total ? Math.round(done / total * 100) : 0;
  document.querySelector('#task-count').textContent = `${total} ${total === 1 ? 'atividade' : 'atividades'}`;
  document.querySelector('#done-count').textContent = `${done} ${done === 1 ? 'passo' : 'passos'}`;
  document.querySelector('#progress-value').textContent = `${progress}%`;
  document.querySelector('#progress-bar').style.width = `${progress}%`;

  const container = document.querySelector('#task-list');
  container.innerHTML = total ? routine.tasks.map(task => `<article class="task-row${task.done ? ' is-done' : ''}" data-task-row="${escapeHTML(task.id)}"><button class="task-check" type="button" data-task-action="toggle" data-task-id="${escapeHTML(task.id)}" aria-pressed="${task.done}" aria-label="${task.done ? 'Marcar como pendente' : 'Marcar como concluída'}: ${escapeHTML(task.title)}">✓</button><div class="task-copy"><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(daysLabel(task.days))}</small></div><time class="task-time">${escapeHTML(task.time)}</time><button class="task-delete" type="button" data-task-action="delete" data-task-id="${escapeHTML(task.id)}" aria-label="Excluir ${escapeHTML(task.title)}">×</button></article>`).join('') : '<div class="task-empty">Este espaço está em branco. Adicione uma ideia acima e comece por onde quiser.</div>';
}

function openEditModal() {
  if (!routine || !modal || !modalContent) return;
  modal.style.setProperty('--accent', routine.color);
  modal.style.setProperty('--accent-soft', `color-mix(in srgb, ${routine.color} 13%, white)`);
  modalContent.innerHTML = `<div class="modal-head"><span class="modal-icon">${iconSvg(routine.icon)}</span><div><p class="modal-eyebrow">UM CANTINHO COM A SUA CARA</p><h2 id="modal-title">Personalizar rotina</h2></div></div><p class="modal-description">Mude o nome, o jeito de descrever essa rotina e o lembrete que combina com seus planos. Suas alterações ficam salvas neste navegador.</p><form class="modal-form" id="detail-edit-form"><label class="span-two">NOME DA ROTINA<input name="name" maxlength="36" required value="${escapeHTML(routine.name)}"></label><label class="span-two">DESCRIÇÃO<textarea name="description" maxlength="150" required>${escapeHTML(routine.description)}</textarea></label><label>META PESSOAL<input name="goal" maxlength="40" value="${escapeHTML(routine.goal)}"></label><label>COR<input type="color" name="color" value="${escapeHTML(routine.color)}" aria-label="Cor da rotina"></label><div class="modal-actions span-two"><span></span><button class="modal-save" type="submit">Salvar mudanças</button></div></form>`;
  modal.showModal();
  modal.querySelector('input[name="name"]')?.focus({ preventScroll: true });
}

document.querySelector('#add-task-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const titleField = document.querySelector('#new-task-title');
  const timeField = document.querySelector('#new-task-time');
  const title = titleField.value.trim();
  const days = [...document.querySelectorAll('input[name="task-day"]:checked')].map(input => Number(input.value));
  if (!title) return;
  if (!days.length) {
    showToast('Escolha ao menos um dia para esta atividade.');
    return;
  }
  routine.tasks.push({ id: makeId(), title, time: timeField.value || '09:00', days, done: false });
  saveRoutines(routines);
  event.target.reset();
  timeField.value = '09:00';
  document.querySelector('input[name="task-day"][value="1"]').checked = true;
  showToast('Atividade adicionada. Um passo de cada vez.');
  render();
  titleField.focus();
});

document.querySelector('#task-list')?.addEventListener('click', event => {
  const button = event.target.closest('[data-task-action]');
  if (!button) return;
  const task = routine.tasks.find(item => item.id === button.dataset.taskId);
  if (!task) return;
  if (button.dataset.taskAction === 'toggle') {
    task.done = !task.done;
    saveRoutines(routines);
    showToast(task.done ? 'Passo concluído. Que bom.' : 'Passo voltou para sua lista.');
  }
  if (button.dataset.taskAction === 'delete') {
    routine.tasks = routine.tasks.filter(item => item.id !== task.id);
    saveRoutines(routines);
    showToast('Atividade removida.');
  }
  render();
});

document.querySelector('#edit-routine')?.addEventListener('click', openEditModal);
modal?.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', event => { if (event.target === modal) modal.close(); });
modal?.addEventListener('submit', event => {
  if (event.target.id !== 'detail-edit-form') return;
  event.preventDefault();
  const fields = new FormData(event.target);
  const name = String(fields.get('name') || '').trim();
  const description = String(fields.get('description') || '').trim();
  const color = String(fields.get('color') || '');
  if (!name || !description) return;
  routine.name = name;
  routine.description = description;
  routine.goal = String(fields.get('goal') || '').trim();
  if (/^#[0-9a-f]{6}$/i.test(color)) routine.color = color;
  saveRoutines(routines);
  modal.close();
  document.body.style.setProperty('--accent', routine.color);
  document.body.style.setProperty('--accent-soft', `color-mix(in srgb, ${routine.color} 13%, white)`);
  showToast('Sua rotina foi atualizada.');
  render();
});
