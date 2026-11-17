// The ScryPad Tour: a short step-by-step pop-up.
// Shows on someone's very first visit, and any time from Help › Show the ScryPad Tour.
import { createElement, Columns2, MousePointerClick, BookOpen, Save } from 'lucide';

type IconNode = Parameters<typeof createElement>[0];

interface TourStep {
  title: string;
  /** Trusted HTML written by ScryPad itself. */
  body: string;
  icon?: IconNode;
  wisp?: boolean;
}

const STEPS: TourStep[] = [
  {
    wisp: true,
    title: 'Welcome to ScryPad',
    body: '<p>Write HTML on one side and watch your page come to life on the other.</p><p>This quick tour takes about a minute.</p>',
  },
  {
    icon: Columns2,
    title: 'Code Meets Preview',
    body: '<p>Every change shows up in the preview as you type. No uploading, no refreshing, no guessing!</p><p>Pick <b>Split</b>, <b>Code</b> or <b>Preview</b> in the toolbar. On a phone, the tabs at the bottom switch between them.</p>',
  },
  {
    icon: MousePointerClick,
    title: 'Click to Edit',
    body: '<p>Click any text in the preview and change it right there. Your code updates to match.</p><p>Bold, italic, color and <b>Styles</b> live in the Tweak part of the toolbar.</p>',
  },
  {
    icon: BookOpen,
    title: 'Learn as You Go',
    body: '<p>Click something in the preview and the <b>Tag Bar</b> under it says what that tag is and what it\'s for.</p><p>Want the whole collection? <b>Insert › Tag Guide</b> lists every tag with an example to copy.</p>',
  },
  {
    icon: Save,
    title: 'Save and Share',
    body: '<p>Save with <b>Ctrl+S</b>. ScryPad keeps a draft while you work, so a closed tab won\'t take your progress with it.</p><p>You can find this tour again in <b>Help › Show the ScryPad Tour</b>. Happy building!</p>',
  },
];

const SEEN_KEY = 'scrypad_toured';
let tourOpen = false;

export function isTourOpen(): boolean { return tourOpen; }

export function hasSeenTour(): boolean {
  try { return localStorage.getItem(SEEN_KEY) === 'yes'; } catch { return true; }
}

function markSeen() {
  try { localStorage.setItem(SEEN_KEY, 'yes'); } catch { /* blocked storage: nothing to do */ }
}

export function showTour(): Promise<void> {
  if (tourOpen) return Promise.resolve();
  tourOpen = true;
  return new Promise((resolve) => {
    const prevFocus = document.activeElement as HTMLElement | null;
    let i = 0;

    const backdrop = document.createElement('div');
    backdrop.className = 'sp-dialog-backdrop';
    const box = document.createElement('div');
    box.className = 'sp-dialog sp-tour';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'sp-tour-title');

    const art = document.createElement('div');
    art.className = 'tour-art';
    const step = document.createElement('div');
    step.className = 'tour-count';
    step.setAttribute('aria-live', 'polite');
    const h = document.createElement('h2');
    h.id = 'sp-tour-title';
    const body = document.createElement('div');
    body.className = 'sp-body';
    const dots = document.createElement('div');
    dots.className = 'tour-dots';
    dots.setAttribute('aria-hidden', 'true');
    STEPS.forEach(() => dots.appendChild(document.createElement('span')));

    const actions = document.createElement('div');
    actions.className = 'sp-actions tour-actions';
    const skip = document.createElement('button');
    skip.className = 'blank-link tour-skip';
    skip.textContent = 'Skip Tour';
    const back = document.createElement('button');
    back.className = 'btn-hud btn-hud-ghost';
    back.textContent = 'Back';
    const next = document.createElement('button');
    next.className = 'btn-hud btn-hud-primary';
    actions.append(skip, back, next);

    box.append(art, step, h, body, dots, actions);
    backdrop.appendChild(box);
    document.body.appendChild(backdrop);

    const render = () => {
      const s = STEPS[i];
      art.innerHTML = '';
      if (s.wisp) {
        // ScryPad's code eye  < ( ✦ ) >  drawn in the same line style as the other cards
        const tile = document.createElement('div');
        tile.className = 'tour-tile';
        tile.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 6.5 22 11" style="width:44px;height:22px" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="ScryPad">'
          + '<path d="M5 8 2 12l3 4"/><path d="m19 8 3 4-3 4"/>'
          + '<path d="M7 12c1.6-3.6 8.4-3.6 10 0-1.6 3.6-8.4 3.6-10 0Z"/>'
          + '<path d="M12 9.6c0 1.6.8 2.4 2.4 2.4-1.6 0-2.4.8-2.4 2.4 0-1.6-.8-2.4-2.4-2.4 1.6 0 2.4-.8 2.4-2.4Z" fill="currentColor" stroke-width="1"/>'
          + '</svg>';
        art.appendChild(tile);
      } else if (s.icon) {
        const tile = document.createElement('div');
        tile.className = 'tour-tile';
        tile.appendChild(createElement(s.icon));
        art.appendChild(tile);
      }
      step.textContent = `Step ${i + 1} of ${STEPS.length}`;
      h.textContent = s.title;
      body.innerHTML = s.body;
      dots.querySelectorAll('span').forEach((d, n) => d.classList.toggle('on', n === i));
      back.style.visibility = i === 0 ? 'hidden' : 'visible';
      const last = i === STEPS.length - 1;
      next.textContent = last ? 'Start Building' : 'Next';
      skip.style.visibility = last ? 'hidden' : 'visible';
      next.focus();
    };

    const finish = () => {
      document.removeEventListener('keydown', onKey, true);
      backdrop.remove();
      tourOpen = false;
      markSeen();
      prevFocus?.focus?.();
      resolve();
    };

    const go = (d: number) => {
      const n = i + d;
      if (n < 0) return;
      if (n >= STEPS.length) { finish(); return; }
      i = n;
      render();
    };

    next.addEventListener('click', () => go(1));
    back.addEventListener('click', () => go(-1));
    skip.addEventListener('click', finish);
    backdrop.addEventListener('mousedown', (e) => { if (e.target === backdrop) finish(); });

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'Tab') {
        const items = Array.from(box.querySelectorAll<HTMLElement>('button')).filter((b) => b.style.visibility !== 'hidden');
        if (!items.length) return;
        const first = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey, true);

    render();
  });
}
