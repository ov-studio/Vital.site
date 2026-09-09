'use client';
import * as ui_wallpaper from '@/ui/wallpaper';
import * as ui_divider   from '@/ui/divider';
import * as lib_api_url  from '@/lib/api_url';
import * as react        from 'react';
import * as lucide       from 'lucide-react';
import './index.css';

interface ScriptSide {
  name?:       string;
  ops_sec?:    number;
  median_ms?:  number;
  mean_ms?:    number;
  iterations?: number;
}

interface ScriptTest {
  name?:             string;
  faster?:           string;
  throughput_ratio?: number;
  lua?:              ScriptSide;
  gdscript?:         ScriptSide;
}

interface BenchmarkResponse {
  tag?:          string;
  published_at?: string | null;
  asset_url?:    string | null;
  data?: {
    environment?:       Record<string, unknown>;
    scripting_tests?:   ScriptTest[];
    note?:              string;
    generated_at_unix?: number;
  };
}

const ENV_FIELDS = [
  { key: 'os',        label: 'OS',        Icon: lucide.Monitor   },
  { key: 'arch',      label: 'Arch',      Icon: lucide.Cpu       },
  { key: 'cpu',       label: 'CPU',       Icon: lucide.Server    },
  { key: 'godot',     label: 'Godot',     Icon: lucide.Box       },
  { key: 'lua',       label: 'Lua',       Icon: lucide.Code2     },
  { key: 'build',     label: 'Build',     Icon: lucide.Package   },
  { key: 'statistic', label: 'Statistic', Icon: lucide.BarChart3 }
] as const;

function fmt_ops(n?: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '—';
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M/s`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k/s`;
  return `${n.toFixed(0)}/s`;
}

function fmt_ratio(r?: number): string {
  if (typeof r !== 'number' || !Number.isFinite(r)) return '—';
  return `${r.toFixed(2)}×`;
}

function pretty_name(name?: string): string {
  if (!name) return '—';
  return name.replace(/_/g, ' ');
}

export function Benchmarks() {
  const [payload, setPayload] = react.useState<BenchmarkResponse | null>(null);
  const [error, setError]     = react.useState(false);
  const [loading, setLoading] = react.useState(true);

  react.useEffect(() => {
    fetch(lib_api_url.get_api_url('/benchmark'))
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((json: BenchmarkResponse) => {
        setPayload(json);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const data  = payload?.data;
  const tests = data?.scripting_tests ?? [];
  const env   = data?.environment ?? {};

  return (
    <section id="benchmarks">
      <ui_wallpaper.Wallpaper seed={11} vignette={false}/>
      <div className="sw">
        <div className="page-head">
          <div className="sec-head sec-head--intro">
            <div className="rev">
              <div className="slabel">Benchmarks</div>
              <h2>Lua vs GDScript.<br/>Measured, not <span>marketed.</span></h2>
            </div>
          </div>
          <p className="bm-intro">
            Live results from the latest Vital.sandbox release
            {payload?.tag ? <> · <code>{payload.tag}</code></> : null}.
            Throughput ratio &gt; 1 means Lua is faster on that workload.
          </p>
        </div>

        {loading && (
          <div className="state-empty bm-state">
            <lucide.Loader2 size={24} strokeWidth={1.5} className="bm-spin"/>
            <span>Loading benchmark data…</span>
          </div>
        )}

        {!loading && error && (
          <div className="state-empty bm-state">
            <lucide.WifiOff size={24} strokeWidth={1.5}/>
            <span>Could not load benchmarks — try again later.</span>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="bm-section-title">Environment</div>
            <ui_divider.Divider/>

            <div className="bm-env">
              {ENV_FIELDS.map(({ key, label, Icon }) => {
                const val = env[key];
                if (val == null || val === '') return null;
                return (
                  <div key={key} className="bm-env-item">
                    <div className="bm-env-top">
                      <span className="bm-env-key">{label}</span>
                      <Icon size={16} strokeWidth={2} className="bm-env-icon"/>
                    </div>
                    <span className="bm-env-val">{String(val)}</span>
                  </div>
                );
              })}
            </div>

            <div className="bm-section-title">Benchmarks</div>
            <ui_divider.Divider/>

            {data?.note && <p className="bm-note">{data.note}</p>}

            <div className="bm-table-wrap">
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>Workload</th>
                    <th>Faster</th>
                    <th>Ratio</th>
                    <th>Lua</th>
                    <th>GDScript</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.length === 0 ? (
                    <tr className="bm-empty-row">
                      <td colSpan={5}>
                        <div className="state-empty">
                          <lucide.Gauge size={24} strokeWidth={1.5}/>
                          <span>No scripting tests in this release.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    tests.map((t) => {
                      const faster = (t.faster ?? '').toLowerCase();
                      const lua_win = faster === 'lua';
                      const gd_win  = faster === 'gdscript';
                      return (
                        <tr key={t.name} className={lua_win ? 'bm-row--lua' : gd_win ? 'bm-row--gd' : ''}>
                          <td className="bm-name">{pretty_name(t.name)}</td>
                          <td>
                            <span className={`bm-badge bm-badge--${lua_win ? 'lua' : gd_win ? 'gd' : 'tie'}`}>
                              {lua_win ? 'Lua' : gd_win ? 'GDScript' : (t.faster ?? '—')}
                            </span>
                          </td>
                          <td className="bm-mono">{fmt_ratio(t.throughput_ratio)}</td>
                          <td className="bm-mono">{fmt_ops(t.lua?.ops_sec)}</td>
                          <td className="bm-mono">{fmt_ops(t.gdscript?.ops_sec)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
