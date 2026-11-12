'use client';
import * as react from 'react';
import './index.css';

/**
 * Brand mark and wordmark.
 *
 * @param {Object} props
 * @param {string} [props.name]  Wordmark text (defaults to site name when omitted by callers)
 * @param {'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'} [props.size='md']
 * @param {'full' | 'logo-only' | 'wordmark-only'} [props.variant='full']
 * @param {string} [props.className]
 * @param {string} [props.color]  Overrides --brand-color
 * @param {string} [props.href]  Wrap mark in a link when set
 * @param {boolean} [props.neon=false]  Neon glow treatment
 * @param {boolean} [props.flicker=false]  Broken-bulb flicker (neon)
 */
export function Brand({
  name,
  size = 'md',
  variant = 'full',
  className = '',
  color,
  href,
  neon = false,
  flicker = false
}) {
  const color_style = color ? ({ '--brand-color': color }) : undefined;
  const [phase, setPhase] = react.useState('on');

  react.useEffect(() => {
    if (!flicker) {
      setPhase('on');
      return;
    }

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let cancelled = false;
    let timer;

    const rand = (min, max) =>
      min + Math.random() * (max - min);

    // Broken bulb: mostly steady, then a short irregular sputter (dips and half-lit stumbles), sometimes catching with a small pop
    const build_burst = () => {
      const steps = [];
      const sputters = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < sputters; i++) {
        steps.push([Math.random() < 0.6 ? 'off' : 'half', rand(30, 110)]);
        steps.push(['on', i === sputters - 1 ? 0 : rand(30, 280)]);
      }
      if (Math.random() < 0.35) {
        steps.splice(steps.length - 1, 0, ['on', rand(60, 140)], ['surge', rand(50, 90)]);
      }
      return steps;
    };

    const play = (steps, i = 0) => {
      if (cancelled) return;
      const [state, ms] = steps[i];
      setPhase(state);
      if (i >= steps.length - 1) {
        timer = setTimeout(run, rand(7000, 15000));
        return;
      }
      timer = setTimeout(() => play(steps, i + 1), ms);
    };

    const run = () => play(build_burst());

    timer = setTimeout(run, rand(3000, 5000));
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [flicker]);

  const logo = variant !== 'wordmark-only' && (
    <div className="brand_logo-wrapper">
      {neon ? (
        <img
          src="/logo/logo.svg"
          alt=""
          className="brand_logo brand_logo--neon"
          draggable={false}
        />
      ) : (
        <div className="brand_logo"/>
      )}
    </div>
  );

  const wordmark = variant !== 'logo-only' && name && (
    <span className="brand_wordmark">{name}</span>
  );

  const inner = (
    <>
      {logo}
      {wordmark}
    </>
  );

  const cls = [
    'brand',
    `brand--${size}`,
    `brand--${variant}`,
    neon ? 'brand--neon' : '',
    flicker ? 'brand--flicker' : '',
    flicker && phase === 'off' ? 'is-glitch' : '',
    flicker && phase === 'half' ? 'is-half' : '',
    flicker && phase === 'surge' ? 'is-surge' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} style={color_style}>
      {href ? (<a href={href} className="brand_link">{inner}</a>) : inner}
    </div>
  );
}
