'use client';

import { useEffect } from 'react';
import Image from 'next/image';

export default function HomePage() {
  useEffect(() => {
    // --- Cursor ---
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

    // --- Nav scroll ---
    const onScroll = () => {
      const nav = document.getElementById('nav');
      if (nav) nav.classList.toggle('s', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);

    // --- Reveal on scroll ---
    const allRevs = document.querySelectorAll<HTMLElement>('.rev,.rev-l,.rev-r');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const sibs = [...(e.target.parentElement?.querySelectorAll('.rev,.rev-l,.rev-r') ?? [])];
          const idx = sibs.indexOf(e.target as Element);
          setTimeout(() => e.target.classList.add('in'), idx * 70);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    allRevs.forEach(el => io.observe(el));

    // --- API tabs ---
    const fnames: Record<string, string> = {
      canvas: 'server/hud.lua', net: 'server/fetch.lua',
      gfx: 'server/gfx.lua', async: 'server/async.lua',
    };
    const tabs = document.querySelectorAll<HTMLElement>('.atab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const t = tab.dataset.t!;
        const current = document.querySelector<HTMLElement>('.cpane.on');
        const next = document.getElementById('cp-' + t);
        if (!next || current === next) return;
        document.querySelectorAll('.atab').forEach(tb => tb.classList.remove('on'));
        tab.classList.add('on');
        const cfile = document.getElementById('cfile');
        if (cfile) cfile.textContent = fnames[t];
        current?.classList.remove('on');
        requestAnimationFrame(() => next.classList.add('on'));
      });
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:   hsl(250,25%,2%);
          --bg2:  hsl(248,22%,4%);
          --bg3:  hsl(246,20%,5.5%);
          --blue: hsl(220,95%,76%);
          --b30:  hsla(220,95%,76%,.3);
          --b10:  hsla(220,95%,76%,.1);
          --b05:  hsla(220,95%,76%,.05);
          --w:    hsl(0,0%,97%);
          --dim:  hsl(220,10%,72%);
          --dark: hsl(220,10%,42%);
          --rule: hsl(220,18%,9%);
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--w);font-family:'Barlow',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}

        #vignette{position:fixed;inset:0;z-index:4;pointer-events:none;background:radial-gradient(ellipse 80% 80% at 50% 50%,transparent 40%,hsla(250,30%,1.5%,.75) 100%);}

        #cur{position:fixed;z-index:9999;pointer-events:none;top:0;left:0;transform:translate(-50%,-50%)}
        #cur-inner{width:8px;height:8px;background:var(--blue);border-radius:50%;transition:transform .15s}
        #cur-outer{position:fixed;z-index:9998;pointer-events:none;top:0;left:0;transform:translate(-50%,-50%);width:36px;height:36px;border:1px solid var(--b30);border-radius:50%;transition:width .2s,height .2s,border-color .2s}
        body:has(a:hover) #cur-outer,body:has(button:hover) #cur-outer{width:52px;height:52px;border-color:var(--blue)}
        body:has(a:hover) #cur-inner{transform:scale(1.6)}

        nav{position:fixed;top:0;left:0;right:0;z-index:500;height:68px;display:flex;align-items:center}
        nav::after{content:'';position:absolute;inset:0;background:hsla(250,20%,4%,0);border-bottom:1px solid transparent;transition:background .4s,border-color .4s;pointer-events:none}
        nav.s::after{background:hsla(250,20%,4%,.92);border-color:var(--rule);backdrop-filter:blur(20px)}
        .ni{max-width:1280px;margin:0 auto;width:100%;padding:0 48px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1}
        .logo{display:flex;align-items:center;gap:10px}
        .logo-text{font-family:'Geist',sans-serif;font-size:.88rem;font-weight:600;letter-spacing:.04em;color:var(--w)}
        .logo-text b{color:var(--blue);font-weight:400}
        .nl{display:flex;list-style:none;gap:0}
        .nl li a{font-family:'Geist',sans-serif;font-size:.8rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:hsl(220,10%,70%);text-decoration:none;padding:8px 22px;transition:color .2s;display:block}
        .nl li a:hover{color:var(--w)}
        .nl li{border-right:1px solid var(--rule)}
        .nl li:first-child{border-left:1px solid var(--rule)}
        .ncta{font-family:'Geist',sans-serif;font-size:.8rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--bg);background:var(--blue);border:1px solid var(--blue);padding:9px 26px;text-decoration:none;clip-path:polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px);transition:background .2s,opacity .2s}
        .ncta:hover{opacity:.8}

        .announce-bar{position:fixed;top:68px;left:0;right:0;z-index:499;background:hsla(220,95%,68%,.18);border-bottom:1px solid hsla(220,95%,76%,.12);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;gap:16px;padding:12px 48px;}
        .announce-dot{width:7px;height:7px;border-radius:50%;background:var(--blue);flex-shrink:0;box-shadow:0 0 8px hsla(220,95%,76%,.6);animation:announcePulse 2.5s ease-in-out infinite;}
        @keyframes announcePulse{0%,100%{opacity:1}50%{opacity:.4}}
        .announce-text{font-family:'Geist',sans-serif;font-size:.8rem;font-weight:400;color:hsla(220,60%,88%,.75);letter-spacing:.02em;}
        .announce-link{font-family:'Geist',sans-serif;font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--blue);text-decoration:none;display:flex;align-items:center;gap:5px;flex-shrink:0;transition:opacity .2s;opacity:.85;}
        .announce-link:hover{opacity:1}

        #hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;overflow:hidden;padding-top:110px}
        .hgrid{position:absolute;inset:0;pointer-events:none;z-index:0}
        .hgrid::before{display:none}
        .hgrid::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 60% 50%,hsla(220,95%,30%,.12) 0%,transparent 70%)}
        .hero-content{display:none}
        .hero-center{max-width:900px;margin:0 auto;width:100%;padding:0 48px;position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;text-align:center;gap:0;}
        .hero-logo{width:72px;height:72px;margin-bottom:28px;opacity:0;filter:invert(1) brightness(1.9) drop-shadow(0 0 16px hsla(220,95%,76%,.5));animation:fadeIn .5s .05s forwards, logoPulse 5s 1.2s ease-in-out infinite;}
        @keyframes logoPulse{0%,100%{filter:invert(1) brightness(1.9) drop-shadow(0 0 16px hsla(220,95%,76%,.5))}50%{filter:invert(1) brightness(2.3) drop-shadow(0 0 36px hsla(220,95%,76%,.9))}}
        .hero-wordmark{font-family:'Rajdhani',sans-serif;font-size:clamp(3rem,6vw,5.2rem);font-weight:700;letter-spacing:.07em;color:var(--w);margin-bottom:36px;line-height:1;opacity:0;animation:fadeIn .6s .2s forwards;}
        .hw-vital{color:hsl(220,60%,72%);font-weight:700}
        .hw-dot{color:hsl(220,60%,72%);font-weight:700}
        .hw-sub{color:hsl(220,60%,72%);font-weight:700;letter-spacing:.07em}
        h1.hero-title{font-family:'Rajdhani',sans-serif;font-size:clamp(4.5rem,9vw,9.5rem);font-weight:700;line-height:.9;letter-spacing:-.02em;text-transform:uppercase;color:var(--w);margin-bottom:0;opacity:0;animation:fadeIn .7s .25s forwards;}
        .hero-motto{display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;font-family:'Rajdhani',sans-serif;font-size:clamp(.95rem,1.5vw,1.25rem);font-weight:600;text-transform:uppercase;letter-spacing:.14em;margin-bottom:28px;opacity:0;animation:fadeIn .7s .3s forwards;}
        .hero-motto span{color:hsl(220,10%,60%)}
        .hm-blue{color:var(--w)!important;font-weight:700}
        .hm-sep{color:hsl(220,10%,22%)!important;font-weight:300}
        .hero-sub{font-size:1rem;font-weight:400;color:hsl(220,10%,62%);line-height:1.8;max-width:560px;margin-bottom:40px;opacity:0;animation:fadeIn .7s .4s forwards;}
        .hbtns{display:flex;gap:16px;align-items:center;justify-content:center;opacity:0;animation:fadeIn .7s .5s forwards;margin-bottom:116px;}
        .hero-stats{display:flex;align-items:center;gap:0;border:none;opacity:0;animation:fadeIn .7s .6s forwards;}
        .hstat{padding:18px 36px;display:flex;flex-direction:column;align-items:center;gap:4px}
        .hstat-n{font-family:'Rajdhani',sans-serif;font-size:1.3rem;font-weight:700;letter-spacing:.04em;color:var(--w)}
        .hstat-l{font-family:'Geist Mono',monospace;font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:hsl(220,10%,45%)}
        .hstat-div{width:1px;height:48px;background:var(--rule)}

        .hero-tag{font-family:'Geist',sans-serif;font-size:.72rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--blue);margin-bottom:28px;display:flex;align-items:center;gap:12px;opacity:0;animation:fadeIn .6s .1s forwards}
        .hero-tag::before{content:'';width:32px;height:1px;background:var(--blue)}
        .hero-tag::after{content:'';width:6px;height:6px;border:1px solid var(--blue);transform:rotate(45deg)}
        h1{font-family:'Rajdhani',sans-serif;font-size:clamp(4.5rem,8vw,8rem);font-weight:700;line-height:.92;letter-spacing:-.01em;text-transform:uppercase;margin-bottom:32px;opacity:0;animation:fadeIn .7s .2s forwards}
        h1 .hl{color:var(--blue);display:block}
        h1 .ghost{color:transparent;-webkit-text-stroke:1px hsla(220,10%,55%,.5);display:block}
        .hero-desc{font-size:1.05rem;font-weight:400;color:var(--dim);line-height:1.8;max-width:480px;margin-bottom:40px;opacity:0;animation:fadeIn .7s .35s forwards}
        .btn-primary{font-family:'Rajdhani',sans-serif;font-size:1rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;background:var(--blue);color:var(--bg);padding:13px 32px;text-decoration:none;clip-path:polygon(12px 0%,100% 0%,100% calc(100% - 12px),calc(100% - 12px) 100%,0% 100%,0% 12px);transition:opacity .2s,transform .15s;display:inline-block;}
        .btn-primary:hover{opacity:.85;transform:translateY(-2px)}
        .btn-secondary{font-family:'Geist',sans-serif;font-size:.8rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--w);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color .2s}
        .btn-secondary:hover{color:var(--w)}
        .btn-secondary svg{transition:transform .2s}
        .btn-secondary:hover svg{transform:translateX(4px)}
        .hero-r{opacity:0;animation:slideLeft .8s .5s forwards}
        @keyframes slideLeft{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:none}}
        .term-wrap{position:relative}
        .term-wrap::before{content:'';position:absolute;inset:-1px;background:linear-gradient(135deg,var(--blue),transparent 60%,transparent);border-radius:4px;z-index:-1;opacity:.3}
        .term{background:var(--bg2);border:1px solid var(--rule);overflow:hidden}
        .term-head{background:var(--bg3);border-bottom:1px solid var(--rule);padding:10px 16px;display:flex;align-items:center;gap:8px}
        .tdots{display:flex;gap:6px}
        .td{width:9px;height:9px;border-radius:50%}
        .td-r{background:hsl(0,58%,52%)}.td-y{background:hsl(40,70%,52%)}.td-g{background:hsl(130,50%,42%)}
        .tfile{font-family:'Geist Mono',monospace;font-size:.62rem;color:var(--dim);margin-left:8px;letter-spacing:.04em}
        .term-body{padding:20px 22px;font-family:'Geist Mono',monospace;font-size:.74rem;line-height:1.9}
        .kw{color:var(--blue)}.fn{color:hsl(195,65%,65%)}.st{color:hsl(142,42%,58%)}.cm{color:hsl(220,10%,48%)}.nm{color:hsl(30,75%,62%)}.pu{color:hsl(220,12%,50%)}
        .blink{animation:blink 1s step-end infinite;color:var(--blue)}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .term-stats{display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:1px solid var(--rule)}
        .tstat{padding:16px 18px;border-right:1px solid var(--rule);position:relative}
        .tstat:last-child{border-right:none}
        .tstat::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,var(--blue),transparent);opacity:.4}
        .tstat-n{font-family:'Rajdhani',sans-serif;font-size:1.6rem;font-weight:700;line-height:1;letter-spacing:.02em}
        .tstat-n em{color:var(--blue);font-style:normal;font-size:.9rem}
        .tstat-l{font-family:'Geist Mono',monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin-top:3px}

        .feat-group{margin-bottom:0}
        .feat-group-label{font-family:'Geist',sans-serif;font-size:.7rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:hsl(220,10%,40%);padding:20px 0 14px;border-top:1px solid var(--rule);margin-bottom:0}
        #features{padding:100px 0;position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:center}
        .sw{max-width:1280px;margin:0 auto;padding:0 48px}
        .sec-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:64px}
        .slabel{font-family:'Geist',sans-serif;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--blue);margin-bottom:14px;display:flex;align-items:center;gap:10px}
        .slabel::before{content:'';width:20px;height:1px;background:var(--blue)}
        h2{font-family:'Rajdhani',sans-serif;font-size:clamp(2.4rem,4vw,3.8rem);font-weight:700;text-transform:uppercase;line-height:.95;letter-spacing:.01em}
        h2 span{color:var(--blue)}
        .sec-link{font-family:'Geist',sans-serif;font-size:.75rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:hsl(220,10%,65%);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color .2s;flex-shrink:0;padding-bottom:4px}
        .sec-link:hover{color:var(--blue)}
        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--rule)}
        .fc{background:var(--bg);padding:36px 32px;position:relative;overflow:hidden;transition:background .25s;cursor:default}
        .fc:hover{background:var(--bg2)}
        .fc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}
        .fc-num{font-family:'Geist Mono',monospace;font-size:.6rem;letter-spacing:.1em;color:hsl(220,10%,50%)}
        .fc-ico{width:36px;height:36px;border:1px solid var(--rule);display:flex;align-items:center;justify-content:center;color:var(--blue);transition:border-color .3s}
        .fc:hover .fc-ico{border-color:var(--b30)}
        .fc h3{font-family:'Rajdhani',sans-serif;font-size:1.4rem;font-weight:600;text-transform:uppercase;letter-spacing:.02em;margin-bottom:10px;line-height:1}
        .fc p{font-size:.88rem;color:hsl(220,10%,72%);line-height:1.75;font-weight:400}
        .fc-bar{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--blue),transparent);transform:scaleX(0);transform-origin:left;transition:transform .4s ease}
        .fc:hover .fc-bar{transform:scaleX(1)}

        #api{padding:100px 0;border-top:1px solid var(--rule);min-height:100vh;display:flex;flex-direction:column;justify-content:center}
        .api-wrap{display:grid;grid-template-columns:1fr 1.5fr;gap:64px;align-items:start}
        .api-tabs{display:flex;flex-direction:column;gap:1px;background:var(--rule);margin-top:40px}
        .atab{background:var(--bg);padding:18px 24px;cursor:pointer;display:flex;align-items:center;gap:16px;transition:background .2s;border-left:2px solid transparent}
        .atab.on{background:var(--bg2);border-color:var(--blue)}
        .atab:hover:not(.on){background:var(--bg2)}
        .atab-n{font-family:'Geist Mono',monospace;font-size:.6rem;letter-spacing:.08em;color:hsl(220,10%,50%);flex-shrink:0}
        .atab-name{font-family:'Geist',sans-serif;font-size:.92rem;font-weight:600;letter-spacing:.02em;color:hsl(220,10%,68%);transition:color .2s}
        .atab.on .atab-name{color:var(--w)}
        .atab-sig{font-family:'Geist Mono',monospace;font-size:.65rem;color:hsl(220,10%,58%);letter-spacing:.03em}
        .code-win{border:1px solid var(--rule);border-left:2px solid var(--blue);overflow:hidden;background:hsl(240,20%,4%);box-shadow:0 0 40px hsla(220,95%,76%,.04),-4px 0 24px hsla(220,95%,76%,.06)}
        .cbar{background:hsl(240,18%,5%);border-bottom:1px solid var(--rule);padding:0 0 0 18px;display:flex;align-items:stretch;gap:0;min-height:40px;}
        .cd,.cd-r,.cd-y,.cd-g{display:none}
        .cfile-tab{font-family:'Geist Mono',monospace;font-size:.68rem;color:hsl(220,10%,55%);padding:0 20px;display:flex;align-items:center;gap:8px;border-right:1px solid var(--rule);border-bottom:2px solid var(--blue);background:hsl(240,20%,4%);white-space:nowrap;}
        .cfile-tab svg{width:11px;height:11px;opacity:.5;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
        .cfile{font-family:'Geist Mono',monospace;font-size:.65rem;color:hsl(220,10%,50%)}
        .cbar-spacer{flex:1}
        .cbar-lang{font-family:'Geist Mono',monospace;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:hsl(220,10%,30%);padding:0 18px;display:flex;align-items:center;}
        .cpane-container{display:grid}
        .cpane{grid-area:1/1;padding:28px 28px;opacity:0;pointer-events:none;transition:opacity .3s ease;visibility:hidden}
        .cpane.on{opacity:1;pointer-events:auto;visibility:visible}
        .cpane pre{font-family:'Geist Mono',monospace;font-size:.76rem;line-height:2;overflow-x:auto}

        #cta{padding:120px 0;border-top:1px solid var(--rule);text-align:center;position:relative;overflow:hidden;min-height:100vh;display:flex;flex-direction:column;justify-content:center}
        #cta::before{content:'';position:absolute;inset:0;background-image:linear-gradient(hsla(220,50%,60%,.035) 1px,transparent 1px),linear-gradient(90deg,hsla(220,50%,60%,.035) 1px,transparent 1px);background-size:80px 80px;pointer-events:none}
        #cta::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 50% 50%,hsla(220,95%,30%,.1),transparent 70%);pointer-events:none}
        .cta-inner{position:relative;z-index:1;max-width:640px;margin:0 auto;padding:0 48px}
        .cta-diamond{width:48px;height:48px;border:1px solid var(--b30);transform:rotate(45deg);margin:0 auto 40px;display:flex;align-items:center;justify-content:center;animation:rotateSlow 8s linear infinite}
        .cta-diamond::after{content:'';width:12px;height:12px;background:var(--blue)}
        @keyframes rotateSlow{to{transform:rotate(405deg)}}
        #cta h2{font-size:clamp(2.8rem,5vw,5rem);margin-bottom:16px;letter-spacing:.01em}
        #cta p{font-size:1.05rem;color:hsl(220,10%,76%);line-height:1.8;margin-bottom:40px;font-weight:400}
        .cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}

        .why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--rule)}
        .why-card{background:var(--bg);padding:36px 32px;position:relative;overflow:hidden;transition:background .25s}
        .why-card:hover{background:var(--bg2)}
        .why-ico{width:40px;height:40px;border:1px solid var(--rule);display:flex;align-items:center;justify-content:center;color:var(--blue);margin-bottom:20px;transition:border-color .3s}
        .why-card:hover .why-ico{border-color:var(--b30)}
        .why-card h3{font-family:'Rajdhani',sans-serif;font-size:1.3rem;font-weight:700;text-transform:uppercase;letter-spacing:.03em;margin-bottom:10px;color:var(--w)}
        .why-card p{font-size:.87rem;color:hsl(220,10%,68%);line-height:1.75;font-weight:400}
        .why-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--blue),transparent);transform:scaleX(0);transform-origin:left;transition:transform .4s ease}
        .why-card:hover::after{transform:scaleX(1)}

        footer{border-top:1px solid var(--rule);background:hsl(250,25%,1%)}
        .footer-main{max-width:1280px;margin:0 auto;padding:64px 48px 56px;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
        .footer-brand-lock{display:flex;align-items:center;gap:12px;margin-bottom:20px}
        .footer-brand-lock img{height:28px;width:auto;filter:brightness(0) invert(1);opacity:.7}
        .footer-brand-name{font-family:'Rajdhani',sans-serif;font-size:1.1rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--w)}
        .footer-tagline{font-family:'Barlow',sans-serif;font-size:.875rem;color:hsl(220,10%,42%);line-height:1.7;max-width:340px;margin-bottom:28px}
        .footer-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
        .footer-nav-col h4{font-family:'Geist',sans-serif;font-size:.7rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:hsl(220,10%,38%);margin-bottom:16px}
        .footer-nav-col ul{list-style:none;display:flex;flex-direction:column;gap:10px}
        .footer-nav-col ul li a{font-family:'Geist',sans-serif;font-size:.85rem;font-weight:400;color:hsl(220,10%,58%);text-decoration:none;transition:color .2s;letter-spacing:.01em}
        .footer-nav-col ul li a:hover{color:var(--w)}

        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .rev{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
        .rev.in{opacity:1;transform:none}
        .rev-l{opacity:0;transform:translateX(-24px);transition:opacity .6s ease,transform .6s ease}
        .rev-l.in{opacity:1;transform:none}
        .rev-r{opacity:0;transform:translateX(24px);transition:opacity .6s ease,transform .6s ease}
        .rev-r.in{opacity:1;transform:none}

        @media(max-width:960px){
          .hero-content{grid-template-columns:1fr;gap:48px}
          .hero-r{display:none}
          .feat-grid{grid-template-columns:1fr 1fr}
          .api-wrap{grid-template-columns:1fr}
          .nl{display:none}
          .why-grid{grid-template-columns:1fr 1fr}
        }
      `}</style>

      <div id="vignette"></div>
      <div id="cur"><div id="cur-inner"></div></div>
      <div id="cur-outer"></div>

      {/* NAV */}
      <nav id="nav">
        <div className="ni">
          <div className="logo">
            <Image src="/vital_sandbox_logo.png" alt="vital.sandbox" width={36} height={36} style={{filter:'invert(1) brightness(2)'}} />
            <div className="logo-text">vital<b>.</b>sandbox</div>
          </div>
          <ul className="nl">
            <li><a href="#features">Features</a></li>
            <li><a href="#api">API</a></li>
            <li><a href="#compare">Compare</a></li>
            <li><a href="#docs">Docs</a></li>
          </ul>
          <a href="#" className="ncta">Get Started</a>
        </div>
      </nav>

      {/* ANNOUNCEMENT BAR */}
      <div className="announce-bar">
        <span className="announce-dot"></span>
        <span className="announce-text">vital.sandbox is currently in active development — APIs and features are subject to change. Not recommended for production use.</span>
        <a href="#" className="announce-link">View Roadmap
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
      </div>

      {/* HERO */}
      <section id="hero">
        <div className="hgrid"></div>
        <div className="hero-center">
          <Image src="/vital_sandbox_logo.png" alt="" width={72} height={72} className="hero-logo" />
          <div className="hero-wordmark"><span className="hw-vital">Vital</span><span className="hw-dot">.</span><span className="hw-sub">sandbox</span></div>
          <div className="hero-motto">
            <span>Script It.</span>
            <span className="hm-sep">—</span>
            <span className="hm-blue">Ship It.</span>
            <span className="hm-sep">—</span>
            <span>Limitless.</span>
          </div>
          <p className="hero-sub">The next-generation sandbox runtime. One language, infinite power — Lua from the ground up, built on Godot, engineered in C++17.</p>
          <div className="hbtns">
            <a href="#" className="btn-primary">Start Building</a>
            <a href="#features" className="btn-secondary">
              Explore Features
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="hero-stats">
            <div className="hstat"><span className="hstat-n">C++17</span><span className="hstat-l">Engine Core</span></div>
            <div className="hstat-div"></div>
            <div className="hstat"><span className="hstat-n">Lua</span><span className="hstat-l">Scripting</span></div>
            <div className="hstat-div"></div>
            <div className="hstat"><span className="hstat-n">100+</span><span className="hstat-l">API Functions</span></div>
            <div className="hstat-div"></div>
            <div className="hstat"><span className="hstat-n">Open Source</span><span className="hstat-l">No Royalties</span></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:'100px 0',borderTop:'1px solid var(--rule)',minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div className="sw">
          <div className="sec-head">
            <div className="rev">
              <div className="slabel">Platform</div>
              <h2>Built for creators.<br/>Engineered for <span>production.</span></h2>
            </div>
            <a href="#" className="sec-link rev">View all docs <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
          </div>

          {/* Rendering */}
          <div className="feat-group rev">
            <div className="feat-group-label">Rendering</div>
            <div className="feat-grid">
              {[
                {n:'01',title:'Canvas',desc:'Draw shapes, images, text, and polygons on the canvas each frame.',icon:<><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>},
                {n:'02',title:'RenderTarget',desc:'Create and bind off-screen surfaces, sampled as textures at runtime.',icon:<><rect x="1" y="3" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M11 6l4-2v6l-4-2" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></>},
                {n:'03',title:'Texture',desc:'Load, unload, and control texture samplers at runtime.',icon:<><rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/></>},
                {n:'04',title:'Font & Text',desc:'Load fonts and render text with full size and color control.',icon:<><path d="M3 12V5l4-2 4 2v7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 12V9h4v3" stroke="currentColor" strokeWidth="1.2"/></>},
                {n:'05',title:'Webview',desc:'Render embedded web content inside your sandbox window.',icon:<><rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>},
                {n:'06',title:'GFX Post-Processing',desc:'Fog, LUTs, depth curves, and color grading — scriptable per frame.',icon:<path d="M2 10L5 4l3 6 2-3 2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>},
              ].map(f => (
                <div className="fc" key={f.n}>
                  <div className="fc-top"><div className="fc-num">{f.n}</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none">{f.icon}</svg></div></div>
                  <h3>{f.title}</h3><p>{f.desc}</p><div className="fc-bar"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Threading */}
          <div className="feat-group rev" style={{marginTop:'2px'}}>
            <div className="feat-group-label">Threading & Async</div>
            <div className="feat-grid">
              <div className="fc"><div className="fc-top"><div className="fc-num">07</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v4l3 2-3 2v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 5l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div><h3>Async / Await</h3><p>Non-blocking async execution with clean control flow.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">08</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Promises</h3><p>Deferred values with chaining, resolution, and try/catch support.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">09</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3a5 5 0 100 10A5 5 0 008 3z" stroke="currentColor" strokeWidth="1.2"/><path d="M8 6v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Heartbeats</h3><p>Recurring callbacks at defined intervals for loops and polling.</p><div className="fc-bar"></div></div>
              <div className="fc" style={{gridColumn:'span 3'}}><div className="fc-top"><div className="fc-num">10</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h4v4H2zM10 4h4v4h-4zM6 10h4v4H6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg></div></div><h3>Threader</h3><p>Low-level thread management, pooling, and lifecycle control.</p><div className="fc-bar"></div></div>
            </div>
          </div>

          {/* Models */}
          <div className="feat-group rev" style={{marginTop:'2px'}}>
            <div className="feat-group-label">Models</div>
            <div className="feat-grid">
              <div className="fc"><div className="fc-top"><div className="fc-num">11</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l5 3v6l-5 3-5-3V5l5-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg></div></div><h3>Load & Unload</h3><p>Load and unload named model assets at runtime, no restarts.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">12</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg></div></div><h3>Instantiation</h3><p>Spawn and destroy independent instances from a shared asset.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">13</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/></svg></div></div><h3>Transform</h3><p>Per-instance position, rotation, and scale at runtime.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">14</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13V6l5-3 5 3v7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Animation</h3><p>Per-instance animation with speed, loop, pause, and resume.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">15</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M4 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Blend Shapes</h3><p>Per-component blend shapes for expressions and body morphs.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">16</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4h8v8H4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 7h8M7 4v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Component Visibility</h3><p>Per-component mesh visibility for clothing and equipment systems.</p><div className="fc-bar"></div></div>
            </div>
          </div>

          {/* Core & Integrations */}
          <div className="feat-group rev" style={{marginTop:'2px'}}>
            <div className="feat-group-label">Core & Integrations</div>
            <div className="feat-grid">
              <div className="fc"><div className="fc-top"><div className="fc-num">17</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M6 8l1.5 1.5L10 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div><h3>Crypto</h3><p>Primitives for hashing, encryption, and payload security.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">18</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l2-8h4l2 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.5 8.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Shrinker</h3><p>Compress assets and data to reduce memory and transfer overhead.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">19</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/></svg></div></div><h3>REST Networking</h3><p>Native HTTP GET and POST with full header support.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">20</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8a5 5 0 0010 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8 3v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5 5l3-2 3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div><h3>Discord SDK</h3><p>Native Rich Presence and Discord API integration.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">21</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M6 8h2m2-2.5L8 8l2 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Event System</h3><p>Pub/sub events for decoupled inter-module communication.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">22</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 8h2M5 10.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5 4V3M11 4V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Console</h3><p>Runtime console for commands, debug, info, and error output.</p><div className="fc-bar"></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* API */}
      <section id="api" style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div className="sw" style={{paddingTop:'100px',paddingBottom:'100px'}}>
          <div className="slabel rev">Developer API</div>
          <h2 className="rev" style={{marginBottom:'48px'}}>Clean. Typed. <span>Powerful.</span></h2>
          <div className="api-wrap">
            <div className="api-left rev-l">
              <p style={{fontSize:'.95rem',color:'var(--dim)',lineHeight:'1.8',fontWeight:300,marginBottom:'32px'}}>Every function follows the same conventions — predictable return values, structured errors, zero boilerplate.</p>
              <div className="api-tabs">
                <div className="atab on" data-t="canvas"><div className="atab-n">01</div><div><div className="atab-name">Canvas</div><div className="atab-sig">draw_rectangle · draw_text · draw_circle</div></div></div>
                <div className="atab" data-t="net"><div className="atab-n">02</div><div><div className="atab-name">Networking</div><div className="atab-sig">rest.get · rest.post</div></div></div>
                <div className="atab" data-t="gfx"><div className="atab-n">03</div><div><div className="atab-name">GFX</div><div className="atab-sig">fog · depth · LUTs · adjustment</div></div></div>
                <div className="atab" data-t="async"><div className="atab-n">04</div><div><div className="atab-name">Async</div><div className="atab-sig">thread · promise · try/catch</div></div></div>
              </div>
            </div>
            <div className="api-right rev-r">
              <div className="code-win">
                <div className="cbar">
                  <div className="cfile-tab">
                    <svg viewBox="0 0 12 12"><path d="M2 1h5l3 3v7H2z"/><path d="M7 1v3h3"/></svg>
                    <span className="cfile" id="cfile">server/hud.lua</span>
                  </div>
                  <div className="cbar-spacer"></div>
                  <span className="cbar-lang">Lua</span>
                </div>
                <div className="cpane-container">
                  <div className="cpane on" id="cp-canvas"><pre>
<span className="cm">{'-- draw handler — fires every frame'}</span>{'\n'}
<span className="kw">network</span><span className="pu">:</span><span className="fn">fetch</span><span className="pu">(</span><span className="st">{'"vital.sandbox:draw"'}</span><span className="pu">, </span><span className="kw">true</span><span className="pu">)</span>{'\n'}
{'  '}<span className="pu">:</span><span className="fn">on</span><span className="pu">(</span><span className="kw">function</span><span className="pu">()</span>{'\n\n'}
{'  '}engine<span className="pu">.</span><span className="fn">draw_rectangle</span><span className="pu">({'{'}</span><span className="nm">20</span><span className="pu">, </span><span className="nm">20</span><span className="pu">{'}'}, {'{'}</span><span className="nm">300</span><span className="pu">, </span><span className="nm">88</span><span className="pu">{'}'}, {'{'}</span><span className="nm">0</span><span className="pu">,</span><span className="nm">0</span><span className="pu">,</span><span className="nm">0</span><span className="pu">,</span><span className="nm">.75</span><span className="pu">{'}'}, </span><span className="nm">1</span><span className="pu">, {'{'}</span><span className="nm">.4</span><span className="pu">,</span><span className="nm">.6</span><span className="pu">,</span><span className="nm">1</span><span className="pu">,</span><span className="nm">.3</span><span className="pu">{'})'}</span>{'\n'}
{'  '}engine<span className="pu">.</span><span className="fn">draw_text</span><span className="pu">(</span><span className="st">{'"Player HUD"'}</span><span className="pu">, {'{'}</span><span className="nm">32</span><span className="pu">,</span><span className="nm">36</span><span className="pu">{'}'}, {'{'}</span><span className="nm">290</span><span className="pu">,</span><span className="nm">72</span><span className="pu">{'}'}, font, </span><span className="nm">16</span><span className="pu">, {'{'}</span><span className="nm">1</span><span className="pu">,</span><span className="nm">1</span><span className="pu">,</span><span className="nm">1</span><span className="pu">,</span><span className="nm">1</span><span className="pu">{'})'}</span>{'\n'}
{'  '}engine<span className="pu">.</span><span className="fn">draw_circle</span><span className="pu">(</span><span className="nm">{'{'}</span><span className="nm">275</span><span className="pu">,</span><span className="nm">54</span><span className="nm">{'}'}</span><span className="pu">, </span><span className="nm">6</span><span className="pu">, {'{'}</span><span className="nm">.3</span><span className="pu">,</span><span className="nm">1</span><span className="pu">,</span><span className="nm">.5</span><span className="pu">,</span><span className="nm">1</span><span className="pu">{'})'}</span>{'\n'}
<span className="kw">end</span><span className="pu">)</span>
                  </pre></div>
                  <div className="cpane" id="cp-net"><pre>
<span className="cm">{'-- async GET inside a thread'}</span>{'\n'}
<span className="kw">local</span> self <span className="pu">=</span> thread<span className="pu">:</span><span className="fn">create</span><span className="pu">(</span><span className="kw">function</span><span className="pu">(self)</span>{'\n'}
{'  '}self<span className="pu">:</span><span className="fn">try</span><span className="pu">({'{'}</span>{'\n'}
{'    '}exec <span className="pu">=</span> <span className="kw">function</span><span className="pu">()</span>{'\n'}
{'      '}<span className="kw">local</span> res <span className="pu">=</span> rest<span className="pu">.</span><span className="fn">get</span><span className="pu">(</span><span className="st">{'"https://api.example.com/data"'}</span><span className="pu">)</span>{'\n'}
{'      '}engine<span className="pu">.</span><span className="fn">print</span><span className="pu">(</span><span className="st">{'"info"'}</span><span className="pu">, res)</span>{'\n'}
{'    '}<span className="kw">end</span><span className="pu">,</span>{'\n'}
{'    '}catch <span className="pu">=</span> <span className="kw">function</span><span className="pu">(err)</span>{'\n'}
{'      '}engine<span className="pu">.</span><span className="fn">print</span><span className="pu">(</span><span className="st">{'"error"'}</span><span className="pu">, err)</span>{'\n'}
{'    '}<span className="kw">end</span>{'\n'}
{'  '}<span className="pu">{'})'}</span>{'\n'}
<span className="kw">end</span><span className="pu">)</span>{'\n'}
self<span className="pu">:</span><span className="fn">resume</span><span className="pu">()</span>
                  </pre></div>
                  <div className="cpane" id="cp-gfx"><pre>
<span className="cm">{'-- depth fog + cinematic LUT'}</span>{'\n'}
gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_mode</span><span className="pu">(</span><span className="st">{'"depth"'}</span><span className="pu">)</span>{'\n'}
gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_depth_begin</span><span className="pu">(</span><span className="nm">10.0</span><span className="pu">)</span>{'\n'}
gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_depth_end</span><span className="pu">(</span><span className="nm">200.0</span><span className="pu">)</span>{'\n'}
gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_depth_curve</span><span className="pu">(</span><span className="nm">1.5</span><span className="pu">)</span>{'\n\n'}
gfx<span className="pu">.</span>adjustment<span className="pu">.</span><span className="fn">set_lut</span><span className="pu">(</span><span className="st">{'"lut/cinematic.png"'}</span><span className="pu">)</span>
                  </pre></div>
                  <div className="cpane" id="cp-async"><pre>
<span className="cm">{'-- promise with error handling'}</span>{'\n'}
<span className="kw">local</span> p <span className="pu">=</span> thread<span className="pu">:</span><span className="fn">create_promise</span><span className="pu">()</span>{'\n'}
<span className="kw">local</span> self <span className="pu">=</span> thread<span className="pu">:</span><span className="fn">create</span><span className="pu">(</span><span className="kw">function</span><span className="pu">(self)</span>{'\n'}
{'  '}self<span className="pu">:</span><span className="fn">try</span><span className="pu">({'{'}</span>{'\n'}
{'    '}exec <span className="pu">=</span> <span className="kw">function</span><span className="pu">()</span>{'\n'}
{'      '}<span className="kw">local</span> r <span className="pu">= {'{'}</span>self<span className="pu">:</span><span className="fn">await</span><span className="pu">(p){'}'}</span>{'\n'}
{'      '}engine<span className="pu">.</span><span className="fn">print</span><span className="pu">(</span><span className="st">{'"info"'}</span><span className="pu">, table.</span><span className="fn">unpack</span><span className="pu">(r))</span>{'\n'}
{'    '}<span className="kw">end</span><span className="pu">,</span>{'\n'}
{'    '}catch <span className="pu">=</span> <span className="kw">function</span><span className="pu">(e)</span>{'\n'}
{'      '}engine<span className="pu">.</span><span className="fn">print</span><span className="pu">(</span><span className="st">{'"error"'}</span><span className="pu">, e)</span>{'\n'}
{'    '}<span className="kw">end</span>{'\n'}
{'  '}<span className="pu">{'})'}</span>{'\n'}
<span className="kw">end</span><span className="pu">)</span>{'\n'}
self<span className="pu">:</span><span className="fn">resume</span><span className="pu">()</span>
                  </pre></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="compare" style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',borderTop:'1px solid var(--rule)'}}>
        <div className="sw" style={{paddingTop:'100px',paddingBottom:'100px'}}>
          <div className="slabel rev">Why vital.sandbox</div>
          <h2 className="rev" style={{marginBottom:'56px'}}>No bloat. No strings.<br/><span>Just power.</span></h2>
          <div className="why-grid rev">
            {[
              {title:'Open Source',desc:'Fully open-source, no licensing fees, no royalties, no strings attached. What you build belongs to you — completely and unconditionally.',icon:<path d="M10 2l2.4 5 5.6.8-4 4 .9 5.5L10 14.5l-4.9 2.8.9-5.5-4-4 5.6-.8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>},
              {title:'Zero Monetization Limits',desc:'No platform cuts, no revenue gates, no forced monetization systems. Ship free, charge what you want, keep everything.',icon:<><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></>},
              {title:'No Bloat',desc:'Lean by design. No unnecessary abstractions, no forced frameworks. Nothing stands between your scripts and the engine.',icon:<><path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.4"/></>},
              {title:'Full Runtime Scripting',desc:'Script everything at runtime — rendering, networking, threading, models, GFX — one unified Lua API, top to bottom.',icon:<><path d="M4 4h12v8H4zM8 16h4M10 12v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></>},
              {title:'Modding & Plugin Ready',desc:'Built for user scripting, modding, and plugin systems from day one. Full sandboxed Lua isolation — safe, powerful, extensible.',icon:<><path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="currentColor" strokeWidth="1.4"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></>},
              {title:'Performance First',desc:'Built on Godot, engineered in C++17. No overhead, no interpreter bottlenecks — maximum throughput at every layer.',icon:<path d="M5 10h10M10 5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>},
            ].map(c => (
              <div className="why-card" key={c.title}>
                <div className="why-ico"><svg width="20" height="20" viewBox="0 0 20 20" fill="none">{c.icon}</svg></div>
                <h3>{c.title}</h3><p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-lock">
              <Image src="/vital_sandbox_logo.png" alt="vital.sandbox" width={28} height={28} style={{filter:'brightness(0) invert(1)',opacity:.7}} />
              <div className="footer-brand-name">Vital.sandbox</div>
            </div>
            <p className="footer-tagline">The next-generation sandbox runtime. One language, infinite power — built on Godot, engineered in C++17.</p>
          </div>
          <div className="footer-nav">
            <div className="footer-nav-col"><h4>Product</h4><ul><li><a href="#">Features</a></li><li><a href="#">API Reference</a></li><li><a href="#">Changelog</a></li><li><a href="#">Roadmap</a></li></ul></div>
            <div className="footer-nav-col"><h4>Resources</h4><ul><li><a href="#">Documentation</a></li><li><a href="#">Examples</a></li><li><a href="#">Lua Guide</a></li><li><a href="#">C++ SDK</a></li></ul></div>
            <div className="footer-nav-col"><h4>Community</h4><ul><li><a href="#">GitHub</a></li><li><a href="#">Discord</a></li><li><a href="#">Ko-fi</a></li><li><a href="#">Contributing</a></li></ul></div>
          </div>
        </div>
      </footer>
    </>
  );
}
