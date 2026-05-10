'use client';
import { useEffect } from 'react';

type ActiveBest = { id: string; gap: number };

export function Effect() {
  useEffect(() => {
    const cur = document.getElementById('cur');
    const co = document.getElementById('cur-outer');
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
    };
    document.addEventListener('mousemove', onMouseMove);

    let animId: number;
    const loop = () => {
      rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
      if (co) { co.style.left = rx + 'px'; co.style.top = ry + 'px'; }
      animId = requestAnimationFrame(loop);
    };
    loop();

    const onNavBlur = () => {
      document.getElementById('nav')?.classList.toggle('s', window.scrollY > 20);
    };
    window.addEventListener('scroll', onNavBlur, { passive: true });

    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nl li a'));
    const navHrefs = new Set(
      navLinks.map(a => (a.getAttribute('href') ?? '').replace(/^#/, '')).filter(Boolean)
    );

    const anchors = Array.from(
      document.querySelectorAll<HTMLElement>('div[id].rcategory, section[id]:not(#roadmap)')
    ).filter(el => navHrefs.has(el.id));

    const setActive = (id: string) => {
      navLinks.forEach(a => {
        const href = (a.getAttribute('href') ?? '').replace(/^#/, '');
        a.classList.toggle('active', href === id);
      });
    };

    const navH = () => parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
    );

    const getActiveId = (): string | null => {
      const offset = navH() + 32;
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

    let forcedId: string | null = null;
    let forcedY = 0;

    const forceActive = (id: string) => {
      forcedId = id;
      forcedY = window.scrollY;
      setActive(id);
    };

    navLinks.forEach(a => {
      a.addEventListener('click', () => {
        const id = (a.getAttribute('href') ?? '').replace(/^#/, '');
        if (id) forceActive(id);
      });
    });

    Array.from(document.querySelectorAll<HTMLAnchorElement>('a.rcategory-label')).forEach(a => {
      a.addEventListener('click', () => {
        const id = (a.getAttribute('href') ?? '').replace(/^#/, '');
        if (id) forceActive(id);
      });
    });

    const onScrollActive = () => {
      if (forcedId !== null) {
        if (Math.abs(window.scrollY - forcedY) > 60) forcedId = null;
        else return;
      }
      const id = getActiveId();
      if (id) setActive(id);
      else navLinks.forEach(a => a.classList.remove('active'));
    };

    window.addEventListener('scroll', onScrollActive, { passive: true });
    requestAnimationFrame(onScrollActive);

    const revEls = document.querySelectorAll<HTMLElement>('.rev,.rev-l,.rev-r');
    const revObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const sibs = [
          ...(e.target.parentElement?.querySelectorAll('.rev,.rev-l,.rev-r') ?? [])
        ];
        const idx = sibs.indexOf(e.target as Element);
        setTimeout(() => e.target.classList.add('in'), idx * 70);
        revObserver.unobserve(e.target);
      });
    }, { threshold: 0.08 });
    revEls.forEach(el => revObserver.observe(el));

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onNavBlur);
      window.removeEventListener('scroll', onScrollActive);
      cancelAnimationFrame(animId);
      revObserver.disconnect();
    };
  }, []);
}