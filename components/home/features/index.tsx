'use client';
import './index.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import { icons } from '@/components/atoms/icons';
import { Features_Content } from '@/configs/home';

interface NodeRef { el: HTMLDivElement | null }
interface NodeState {
  angle: number;
  radPhase: number;
  radFreq: number;
  radAmp: number;
}

const BASE_R = 0.46;
const SPEED = 0.00025;
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
  const states = Array.from({ length: N }, (_, i) => makeState(i, N));

  function resize() {
    const rect = canvas.parentElement!.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    cx = W / 2; cy = H / 2;
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement!);

  let last = performance.now();

  function frame(now: number) {
    const dt = Math.min(now - last, 32); last = now;
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const baseR = Math.min(W, H) * BASE_R;

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 0.6);
    grd.addColorStop(0, `rgba(${BLUE},0.04)`);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd as unknown as string;
    ctx.fillRect(0, 0, W, H);

    for (const [rr, op] of [
      [baseR * 1.18, 0.45], [baseR * 1.36, 0.18], [baseR * 0.44, 0.20],
    ] as [number, number][]) {
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(220,18%,9%,${op})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${BLUE},0.06)`;
    ctx.lineWidth = 4;
    ctx.stroke();

    const pos: { x: number; y: number }[] = [];
    for (let i = 0; i < N; i++) {
      const s = states[i];
      s.angle += SPEED * dt;
      s.radPhase += s.radFreq * dt;
      const r = baseR + Math.sin(s.radPhase) * s.radAmp;
      pos.push({ x: cx + Math.cos(s.angle) * r, y: cy + Math.sin(s.angle) * r });
    }

    for (let i = 0; i < N; i++) {
      ctx.beginPath();
      ctx.setLineDash([2, 6]);
      ctx.moveTo(cx, cy);
      ctx.lineTo(pos[i].x, pos[i].y);
      ctx.strokeStyle = `rgba(${BLUE},0.25)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (let i = 0; i < N; i++) {
      const { x, y } = pos[i];
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