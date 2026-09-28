(() => {
  'use strict';
  const data = window.LAYA_REPLAY;
  const byId = id => document.getElementById(id);
  const canvas = byId('board');
  const ctx = canvas.getContext('2d');
  const dirs = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
  const arrows = {UP:'↑', RIGHT:'→', DOWN:'↓', LEFT:'←'};
  const runs = new Map(data.runs.map(run => [String(run.seed), run]));
  let run = runs.get('19');
  let index = 0;
  let timer = null;

  function stateAt() {
    return index === 0 ? run.initial : run.steps[index - 1];
  }

  function drawBoard() {
    const state = stateAt();
    const cols = run.initial.width;
    const rows = run.initial.height;
    const cell = canvas.width / cols;
    ctx.fillStyle = '#17271d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#28402e';
    ctx.lineWidth = 1;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath(); ctx.moveTo(x * cell + .5, 0); ctx.lineTo(x * cell + .5, rows * cell); ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * cell + .5); ctx.lineTo(cols * cell, y * cell + .5); ctx.stroke();
    }
    const [fx, fy] = state.food;
    ctx.fillStyle = '#ff9e6b';
    ctx.beginPath(); ctx.arc((fx + .5) * cell, (fy + .5) * cell, cell * .28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffc3a4';
    ctx.beginPath(); ctx.arc((fx + .4) * cell, (fy + .4) * cell, cell * .07, 0, Math.PI * 2); ctx.fill();
    [...state.body].reverse().forEach(([x,y], i, arr) => {
      const head = i === arr.length - 1;
      ctx.fillStyle = head ? '#b8f58d' : '#79ca72';
      const inset = head ? 3 : 4;
      ctx.fillRect(x * cell + inset, y * cell + inset, cell - inset * 2, cell - inset * 2);
      if (head) {
        ctx.fillStyle = '#244323';
        ctx.fillRect(x * cell + 11, y * cell + 10, 3, 3);
        ctx.fillRect(x * cell + 19, y * cell + 10, 3, 3);
      }
    });
    canvas.setAttribute('aria-label', `Snake replay at move ${index} of ${run.steps.length}; ${state.score} fruit eaten`);
  }

  function decisionLabel(dir, decision) {
    if (!decision.safe_directions.includes(dir)) return 'Unsafe or blocked';
    if (dir === decision.planner_best) return 'Planner route toward food';
    return 'Safe alternative';
  }

  function updateDecision() {
    const decision = index ? run.steps[index - 1] : null;
    const options = byId('options');
    options.replaceChildren();
    dirs.forEach(dir => {
      const row = document.createElement('div');
      row.className = 'option' + (decision && decision.executed === dir ? ' chosen' : '');
      const probability = decision ? Math.round((decision.probabilities[dir] || 0) * 100) : 0;
      row.innerHTML = `<span class="option-dir">${arrows[dir]}</span><span><span class="option-name">${dir}</span><small>${decision ? decisionLabel(dir, decision) : 'Waiting for a move'}</small><span class="bar"><i style="width:${probability}%"></i></span></span><span class="option-score">${decision ? probability + '%' : '—'}</span>`;
      options.append(row);
    });
    byId('proposed').textContent = decision ? `${arrows[decision.proposed]} ${decision.proposed}` : '—';
    byId('executed').textContent = decision ? `${arrows[decision.executed]} ${decision.executed}` : '—';
    byId('inference').textContent = decision ? `${decision.inference_ms.toFixed(1)} ms` : '—';
    byId('decision-index').textContent = `${String(index).padStart(2,'0')} / ${run.steps.length}`;
    byId('decision-note').textContent = !decision ? 'Press play or step forward to inspect a recorded choice.' : decision.intervened ? 'The safety guard replaced Laya’s proposed move before execution.' : 'Laya’s highest-scored move was executed. Planner hints were part of the input.';
  }

  function render() {
    const state = stateAt();
    drawBoard();
    updateDecision();
    byId('timeline').value = String(index);
    byId('timeline').max = String(run.steps.length);
    byId('move-count').textContent = `MOVE ${String(index).padStart(3,'0')} / ${run.steps.length}`;
    byId('fruit-count').textContent = String(state.score);
    byId('run-status').textContent = index === run.steps.length ? 'ALIVE AT 120-MOVE CAP' : 'RECORDED RUN';
    byId('board-overlay').textContent = index === 0 ? 'READY TO REPLAY' : index === run.steps.length ? 'RUN COMPLETE · 120-MOVE CAP' : `RECORDED MOVE ${String(index).padStart(3,'0')}`;
    byId('back').disabled = index === 0;
    byId('next').disabled = index === run.steps.length;
  }

  function pause() {
    if (timer) clearInterval(timer);
    timer = null;
    byId('play').innerHTML = '▶ <span>Play replay</span>';
  }

  function play() {
    if (timer) { pause(); return; }
    if (index >= run.steps.length) index = 0;
    byId('play').innerHTML = 'Ⅱ <span>Pause replay</span>';
    timer = setInterval(() => {
      index++;
      render();
      if (index >= run.steps.length) pause();
    }, Number(byId('speed').value));
    render();
  }

  byId('play').addEventListener('click', play);
  byId('restart').addEventListener('click', () => { pause(); index = 0; render(); });
  byId('back').addEventListener('click', () => { pause(); index = Math.max(0,index - 1); render(); });
  byId('next').addEventListener('click', () => { pause(); index = Math.min(run.steps.length,index + 1); render(); });
  byId('run-select').addEventListener('change', event => { pause(); run = runs.get(event.target.value); index = 0; render(); });
  byId('timeline').addEventListener('input', event => { pause(); index = Math.max(0, Math.min(run.steps.length,Number(event.target.value))); render(); });
  byId('speed').addEventListener('change', () => { if (timer) { pause(); play(); } });
  render();
})();
