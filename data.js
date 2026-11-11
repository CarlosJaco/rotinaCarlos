export const STORAGE_KEY = 'ritmo-routines-v1';

export const SEED_ROUTINES = [
  { id: 'estudo', name: 'Estudo', description: 'Um espaço para aprender sem pressa.', goal: '4 sessões esta semana', color: '#8277dc', icon: 'study', url: '/estudo.html', tasks: [
    { id: 's1', title: 'Revisar o que aprendi', time: '07:30', days: [1, 3, 5], done: false },
    { id: 's2', title: 'Bloco de foco: matemática', time: '18:30', days: [1, 2, 3, 4, 5], done: false },
    { id: 's3', title: 'Leitura sem distrações', time: '20:00', days: [2, 4], done: false }
  ] },
  { id: 'trabalho', name: 'Trabalho', description: 'Organize as entregas sem esquecer de você.', goal: 'Uma prioridade por vez', color: '#667abf', icon: 'work', url: '/trabalho.html', tasks: [
    { id: 'w1', title: 'Definir as três prioridades', time: '08:30', days: [1, 2, 3, 4, 5], done: false },
    { id: 'w2', title: 'Pausa para respirar', time: '11:00', days: [1, 2, 3, 4, 5], done: false },
    { id: 'w3', title: 'Fechar o dia com leveza', time: '17:30', days: [1, 2, 3, 4, 5], done: false }
  ] },
  { id: 'lazer', name: 'Lazer', description: 'Seu tempo livre também merece lugar na agenda.', goal: 'Tempo para recarregar', color: '#d99370', icon: 'leisure', url: '/lazer.html', tasks: [
    { id: 'l1', title: 'Um episódio e um chá', time: '20:30', days: [2, 4, 6], done: false },
    { id: 'l2', title: 'Encontrar quem me faz bem', time: '15:00', days: [6], done: false },
    { id: 'l3', title: 'Uma tarde sem planos', time: '14:00', days: [7], done: false }
  ] },
  { id: 'hobby', name: 'Hobby', description: 'Cultive seus interesses, sem precisar de motivo.', goal: 'Um tempo só seu', color: '#659678', icon: 'hobby', url: '/hobby.html', tasks: [
    { id: 'h1', title: 'Praticar um pouco de violão', time: '18:00', days: [2, 4], done: false },
    { id: 'h2', title: 'Fotografar uma ideia', time: '10:30', days: [6], done: false },
    { id: 'h3', title: 'Ler por prazer', time: '16:00', days: [7], done: false }
  ] },
  { id: 'esportes', name: 'Esportes', description: 'Mexer o corpo pode ser leve. E pode ser seu.', goal: 'Movimento sem cobrança', color: '#d18d53', icon: 'sports', url: '/esportes.html', tasks: [
    { id: 'e1', title: 'Uma caminhada ao ar livre', time: '07:00', days: [1, 3, 5], done: false },
    { id: 'e2', title: 'Alongar, no meu tempo', time: '17:00', days: [2, 4, 6], done: false },
    { id: 'e3', title: 'Experimentar uma aula nova', time: '09:30', days: [6], done: false }
  ] },
  { id: 'saude', name: 'Saúde', description: 'Cuidar de você pode começar por algo pequeno.', goal: 'Pequenos cuidados contam', color: '#c86f7d', icon: 'health', url: '/saude.html', tasks: [
    { id: 'm1', title: 'Um copo de água ao acordar', time: '07:15', days: [1, 2, 3, 4, 5, 6, 7], done: false },
    { id: 'm2', title: 'Pausa para respirar', time: '12:30', days: [1, 2, 3, 4, 5], done: false },
    { id: 'm3', title: 'Preparar uma noite tranquila', time: '21:00', days: [1, 2, 3, 4, 5, 6, 7], done: false }
  ] }
];

export const DAY_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
export const DAY_LONG = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'];

export const ICONS = {
  study: '<path d="M3 19.5A2.5 2.5 0 0 1 5.5 17H21"/><path d="M5.5 2H21v20H5.5A2.5 2.5 0 0 1 3 19.5v-15A2.5 2.5 0 0 1 5.5 2Z"/><path d="M8 7h8M8 11h7"/>',
  work: '<rect x="3" y="7" width="18" height="14" rx="2.5"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2"/>',
  leisure: '<path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12"/><circle cx="12" cy="12" r="5"/>',
  hobby: '<path d="M6 4a2 2 0 0 1 4 0v3h4V4a2 2 0 0 1 4 0v5a6 6 0 0 1-12 0V4Z"/><path d="M8 16v4m8-4v4m-8 0h8"/>',
  sports: '<path d="m7 4 4 2 4-2 3 3-2 4 2 4-3 3-4-2-4 2-3-3 2-4-2-4 3-3Z"/><circle cx="11" cy="11" r="2"/><path d="m15 15 3 3"/>',
  health: '<path d="M20.8 8.8c0 5.1-8.8 10.2-8.8 10.2S3.2 13.9 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z"/><path d="M7.5 11.5h3l1.5-3 2 6 1.3-3h2.2"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>'
};

export function iconSvg(name, className = '') {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.leisure}</svg>`;
}

export function loadRoutines() {
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

export function saveRoutines(routines) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
    return true;
  } catch (error) {
    console.error('Não foi possível salvar suas alterações neste navegador.', error);
    return false;
  }
}

export function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

export function makeId() {
  return globalThis.crypto?.randomUUID?.() || `ritmo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getMonday(date = new Date()) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const day = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - day);
  return monday;
}

export function dayIndex(date) {
  return (date.getDay() + 6) % 7;
}

export function fullDate(date, options = {}) {
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}
