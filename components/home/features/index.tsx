'use client';
import './index.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import { icons } from '@/components/atoms/icons';
import { Features_Content } from '@/configs/home';

interface NodeRef { el: HTMLDivElement | null }
interface NodeState {
  angle: number;   // current angle
  radPhase: number;   // phase of radial wobble
  radFreq: number;   // wobble frequency (unique per node)
  radAmp: number;   // wobble amplitude (px, unique per node)
}

const BASE_R = 0.375;
const TRAIL_LEN = 38;
const SPEED = 0.00028;   // rad/ms — single constant, all nodes same direction
const BLUE = [148, 178, 252] as const;

function rng(lo: number, hi: number) { return lo + Math.random() * (hi - lo); }

function makeState(i: number, total: number): NodeState {
  return {
    angle: (i / total) * Math.PI * 2,
    radPhase: rng(0, Math.PI * 2),
    radFreq: rng(0.00035, 0.00085),
    radAmp: rng(10, 24),
  };
}

function startDiagram(canvas: HTMLCanvasElement, nodeEls: HTMLDivElement[]) {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, cx = 0, cy = 0, dpr = 1, raf = 0;

  const N = nodeEls.length;
  const states: NodeState[] = Array.from({ length: N }, (_, i) => makeState(i, N));
  const trails: Array<Array<{ x: number; y: number }>> =
    Array.from({ length: N }, () => []);

  function resize() {
    const rect = canvas.parentElement!.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = rect.width; H = rect.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    cx = W / 2; cy = H / 2;
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement!);

  let last = performance.now();

  function frame(now: number) {
    const dt = Math.min(now - last, 32); last = now;
    ctx.clearRect(0, 0, W, H);

    const baseR = Math.min(W, H) * BASE_R;

    /* ambient center glow */
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 0.6);
    grd.addColorStop(0, `rgba(${BLUE},0.04)`);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd as unknown as string;
    ctx.fillRect(0, 0, W, H);

    /* decoration rings */
    for (const [rr, op] of [
      [baseR * 1.18, 0.45], [baseR * 1.36, 0.18], [baseR * 0.44, 0.20],
    ] as [number, number][]) {
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(220,18%,9%,${op})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    /* main orbit ring */
    ctx.beginPath();
    ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${BLUE},0.06)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    /* ── advance motion ── */
    const pos: { x: number; y: number }[] = [];

    for (let i = 0; i < N; i++) {
      const s = states[i];
      s.angle += SPEED * dt;
      s.radPhase += s.radFreq * dt;
      const r = baseR + Math.sin(s.radPhase) * s.radAmp;
      pos.push({ x: cx + Math.cos(s.angle) * r, y: cy + Math.sin(s.angle) * r });
    }

    /* proximity web */
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxD = baseR * 1.5;
        if (dist < maxD) {
          ctx.beginPath();
          ctx.moveTo(pos[i].x, pos[i].y);
          ctx.lineTo(pos[j].x, pos[j].y);
          ctx.strokeStyle = `rgba(${BLUE},${(1 - dist / maxD) * 0.14})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    /* spokes */
    for (let i = 0; i < N; i++) {
      ctx.beginPath();
      ctx.setLineDash([2, 6]);
      ctx.moveTo(cx, cy);
      ctx.lineTo(pos[i].x, pos[i].y);
      ctx.strokeStyle = `rgba(${BLUE},0.055)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    /* trails + glows + DOM labels */
    for (let i = 0; i < N; i++) {
      const { x, y } = pos[i];

      trails[i].push({ x, y });
      if (trails[i].length > TRAIL_LEN) trails[i].shift();
      const tl = trails[i];
      for (let t = 1; t < tl.length; t++) {
        ctx.beginPath();
        ctx.moveTo(tl[t - 1].x, tl[t - 1].y);
        ctx.lineTo(tl[t].x, tl[t].y);
        ctx.strokeStyle = `rgba(${BLUE},${(t / TRAIL_LEN) * 0.38})`;
        ctx.lineWidth = 1.6 * (t / TRAIL_LEN);
        ctx.stroke();
      }

      const gn = ctx.createRadialGradient(x, y, 0, x, y, 13);
      gn.addColorStop(0, `rgba(${BLUE},0.2)`);
      gn.addColorStop(1, 'transparent');
      ctx.fillStyle = gn as unknown as string;
      ctx.beginPath();
      ctx.arc(x, y, 13, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${BLUE},0.9)`;
      ctx.fill();

      const el = nodeEls[i];
      if (el) { el.style.left = x + 'px'; el.style.top = y + 'px'; }
    }

    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}

export function Features() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<NodeRef[]>(Features_Content.map(() => ({ el: null })));
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleEnter = useCallback((id: string) => setHoveredId(id), []);
  const handleLeave = useCallback(() => setHoveredId(null), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const nodeEls = nodeRefs.current.map(r => r.el).filter(Boolean) as HTMLDivElement[];
    if (!canvas || nodeEls.length !== Features_Content.length) return;
    return startDiagram(canvas, nodeEls);
  }, []);

  return (
    <section id="features">
      <div className="sw">
        <div className="sec-head">
          <div className="rev">
            <div className="slabel">Features</div>
            <h2>Built for creators.<br />Engineered for <span>production.</span></h2>
          </div>
          <a href="/docs" className="sec-link rev">
            View documentations <icons.arrow_right />
          </a>
        </div>

        <div className="feat-body">
          <div className="feat-clusters rev-l">
            {Features_Content.map((c, ci) => (
              <div
                key={c.id}
                className={`fcluster${hoveredId === c.id ? ' is-active' : ''}`}
                style={{ '--ci': ci } as React.CSSProperties}
                onMouseEnter={() => handleEnter(c.id)}
                onMouseLeave={handleLeave}
              >
                <div className="fcluster-head">
                  <span className="fcluster-dot" />
                  <span className="fcluster-label">{c.label}</span>
                  <span className="fcluster-count">{c.items.length}</span>
                </div>
                <p className="fcluster-desc">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="feat-diagram rev-r">
            <div className="fdiagram-wrap">
              <canvas ref={canvasRef} className="fdiagram-canvas" />

              <div className="fhub">
                <div className="fhub-inner">
                  <span className="fhub-ring" />
                  <span className="fhub-ring fhub-ring-2" />
                  <span className="fhub-label">vsdk</span>
                </div>
              </div>

              {Features_Content.map((c, i) => (
                <div
                  key={c.id}
                  className={`fnode-group${hoveredId === c.id ? ' is-active' : ''}`}
                  ref={el => { nodeRefs.current[i].el = el; }}
                >
                  <div className="fnode">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}