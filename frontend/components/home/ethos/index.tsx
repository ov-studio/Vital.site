'use client';
import * as config_home  from '@/configs/home';
import * as lib_api_url  from '@/lib/api_url';
import * as ui_wallpaper from '@/ui/wallpaper';
import * as react        from 'react';
import './index.css';

interface BenchmarkTest {
  name?:             string;
  faster?:           string;
  throughput_ratio?: number;
}

interface BenchmarkResponse {
  tag?:  string;
  data?: {
    scripting_tests?: BenchmarkTest[];
  };
  scripting_tests?: BenchmarkTest[];
}

const RATIO_FALLBACK = '~2-5×';

function ratio_range(tests: BenchmarkTest[]): { low: number; high: number } | null {
  const ratios = tests
    .filter((t) => (t.faster ?? '').toLowerCase() === 'lua')
    .map((t) => t.throughput_ratio)
    .filter((r): r is number => typeof r === 'number' && r > 1 && Number.isFinite(r));
  if (!ratios.length) return null;
  const low  = Math.ceil(Math.min(...ratios));
  const high = low + 3;
  return { low, high };
}

function format_band(range: { low: number; high: number } | null): string {
  return range ? `~${range.low}-${range.high}×` : RATIO_FALLBACK;
}

function fill_desc(template: string, band: string): string {
  return template.includes('%s') ? template.replace('%s', band) : template;
}

export function Ethos() {
  const [band, setBand] = react.useState(RATIO_FALLBACK);

  react.useEffect(() => {
    fetch(lib_api_url.get_api_url('/benchmark'))
      .then((r) => (r.ok ? r.json() : null))
      .then((json: BenchmarkResponse | null) => {
        if (!json) return;
        const tests = json.data?.scripting_tests ?? json.scripting_tests ?? [];
        setBand(format_band(ratio_range(tests)));
      })
      .catch(() => {});
  }, []);

  return (
    <section id="ethos">
      <ui_wallpaper.Wallpaper seed={2}/>
      <div className="sw">
        <div className="sec-head rev">
          <div>
            <div className="slabel">Ethos</div>
            <h2>No bloat. No strings.<br/><span>Just power.</span></h2>
          </div>
        </div>

        <div className="ethos-grid">
          {config_home.Ethos.map(({ title, desc, icon }, i) => {
            const is_perf = title === 'Performance First';
            const text = is_perf ? fill_desc(desc, band) : desc;
            return (
              <div
                className="ecard rev"
                key={title}
                style={{ '--i': i } as React.CSSProperties}
              >
                <span className="ecard-corner ecard-corner--tl"/>
                <span className="ecard-corner ecard-corner--br"/>
                <div className="ecard-ico">
                  {icon}
                  <span className="icon-ring"/>
                </div>
                <h3 className="ecard-title">{title}</h3>
                <p className="ecard-desc">
                  {text}
                  {is_perf && (
                    <>
                      {' '}
                      <a href="/benchmarks" className="ecard-link">View benchmarks</a>
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
