'use client';

import { useEffect } from 'react';
import { API_TABS } from '@/configs/homeData';

export function usePageEffects() {
  useEffect(() => {
    // Custom cursor
    const cur = document.getElementById('cur');
    const co  = document.getElementById('cur-outer');
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

    // Nav blur on scroll
    const onScroll = () => {
      document.getElementById('nav')?.classList.toggle('s', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);

    // Scroll-reveal
    const revEls   = document.querySelectorAll<HTMLElement>('.rev,.rev-l,.rev-r');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const sibs = [...(e.target.parentElement?.querySelectorAll('.rev,.rev-l,.rev-r') ?? [])];
        const idx  = sibs.indexOf(e.target as Element);
        setTimeout(() => e.target.classList.add('in'), idx * 70);
        observer.unobserve(e.target);
      });
    }, { threshold: 0.08 });
    revEls.forEach(el => observer.observe(el));

    // API tab switching
    const fileNames = Object.fromEntries(API_TABS.map(t => [t.id, t.file]));
    document.querySelectorAll<HTMLElement>('.atab').forEach(tab => {
      tab.addEventListener('click', () => {
        const key     = tab.dataset.t!;
        const current = document.querySelector<HTMLElement>('.cpane.on');
        const next    = document.getElementById('cp-' + key);
        if (!next || current === next) return;
        document.querySelectorAll('.atab').forEach(t => t.classList.remove('on'));
        tab.classList.add('on');
        const cfile = document.getElementById('cfile');
        if (cfile) cfile.textContent = fileNames[key];
        current?.classList.remove('on');
        requestAnimationFrame(() => next.classList.add('on'));
      });
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);
}
