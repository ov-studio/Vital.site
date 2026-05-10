'use client';
import { useEffect } from 'react';

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

    const anchors = Array.from(document.querySelectorAll<HTMLElement>('section[id], div[id].rcategory'));
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nl li a'));

    const setActive = (id: string) => {
      navLinks.forEach(a => {
        const href = (a.getAttribute('href') ?? '').replace(/^#/, '');
        a.classList.toggle('active', href === id);
      });
    };

    const navH = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));

    const getActiveId = (): string | null => {
      const offset = navH() + 32;
      let best: { id: string; gap: number } | null = null;

      anchors.forEach(el => {
        const top = el.getBoundingClientRect().top - offset;
        if (top > 0) return;
        if (best === null || top > best.gap) best = { id: el.id, gap: top };
      });

      return best !== null ? best.id : null;
    };

    let forcedId: string | null = null;
    let forcedY = 0;

    navLinks.forEach(a => {
      a.addEventListener('click', () => {
        const id = (a.getAttribute('href') ?? '').replace(/^#/, '');
        if (!id) return;
        forcedId = id;
        forcedY = window.scrollY;
        setActive(id);
      });
    });

    const onScrollActive = () => {
      if (forcedId !== null) {
        if (Math.abs(window.scrollY - forcedY) > 60) forcedId = null;
        else return;
      }
      const id = getActiveId();
      if (id) setActive(id);
    };

    window.addEventListener('scroll', onScrollActive, { passive: true });
    onScrollActive();

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