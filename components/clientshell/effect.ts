'use client';
import * as react from 'react';

type ActiveBest = { id: string; gap: number };

export function Effect() {
  react.useEffect(() => {
    const cur = document.getElementById('cur');
    const co = document.getElementById('cur-outer');
    let mx = 0, my = 0, rx = 0, ry = 0;

    let anim_id: number;
    const loop = () => {
      rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
      if (co) { co.style.left = rx + 'px'; co.style.top = ry + 'px'; }
      anim_id = requestAnimationFrame(loop);
    };
    loop();
  
    const on_mouse_move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
    };
    document.addEventListener('mousemove', on_mouse_move);

    const on_nav_blur = () => {
      document.getElementById('nav')?.classList.toggle('s', window.scrollY > 20);
    };
    window.addEventListener('scroll', on_nav_blur, { passive: true });

    const nav_h = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const nav_links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nl li a'));
    const nav_hrefs = new Set(nav_links.map(a => (a.getAttribute('href') ?? '').replace(/^#/, '')).filter(Boolean));
    const anchors = Array.from(
      document.querySelectorAll<HTMLElement>('div[id].rcategory, section[id]:not(#roadmap)')
    ).filter(el => nav_hrefs.has(el.id));

    const set_active = (id: string) => {
      nav_links.forEach(a => {
        const href = (a.getAttribute('href') ?? '').replace(/^#/, '');
        a.classList.toggle('active', href === id);
      });
    };

    const get_active_id = (): string | null => {
      const offset = nav_h() + 32;
      const candidates: ActiveBest[] = [];
      const hasRoadmapAnchors = anchors.some(el => el.classList.contains('rcategory'));

      anchors.forEach(el => {
        const top = el.getBoundingClientRect().top - offset;
        if (top <= 0) candidates.push({ id: el.id, gap: top });
      });

      if (candidates.length === 0) {
        if (hasRoadmapAnchors) return anchors.length > 0 ? anchors[0].id : null;
        return null;
      }

      candidates.sort((a, b) => b.gap - a.gap);
      return candidates[0].id;
    };

    let forced_id: string | null = null;
    let forced_y = 0;
    const force_active = (id: string) => {
      forced_id = id;
      forced_y = window.scrollY;
      set_active(id);
    };

    nav_links.forEach(a => {
      a.addEventListener('click', () => {
        const id = (a.getAttribute('href') ?? '').replace(/^#/, '');
        if (id) force_active(id);
      });
    });

    Array.from(document.querySelectorAll<HTMLAnchorElement>('a.rcategory-label')).forEach(a => {
      a.addEventListener('click', () => {
        const id = (a.getAttribute('href') ?? '').replace(/^#/, '');
        if (id) force_active(id);
      });
    });

    const on_scroll_active = () => {
      if (forced_id !== null) {
        if (Math.abs(window.scrollY - forced_y) > 60) forced_id = null;
        else return;
      }
      const id = get_active_id();
      if (id) set_active(id);
      else nav_links.forEach(a => a.classList.remove('active'));
    };
    window.addEventListener('scroll', on_scroll_active, { passive: true });
    requestAnimationFrame(on_scroll_active);

    const rev_els = document.querySelectorAll<HTMLElement>('.rev,.rev-l,.rev-r');
    const rev_observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const sibs = [
          ...(e.target.parentElement?.querySelectorAll('.rev,.rev-l,.rev-r') ?? [])
        ];
        const idx = sibs.indexOf(e.target as Element);
        setTimeout(() => e.target.classList.add('in'), idx * 70);
        rev_observer.unobserve(e.target);
      });
    }, { threshold: 0.08 });
    rev_els.forEach(el => rev_observer.observe(el));

    return () => {
      document.removeEventListener('mousemove', on_mouse_move);
      window.removeEventListener('scroll', on_nav_blur);
      window.removeEventListener('scroll', on_scroll_active);
      cancelAnimationFrame(anim_id);
      rev_observer.disconnect();
    };
  }, []);
}