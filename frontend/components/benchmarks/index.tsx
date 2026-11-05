'use client';
import * as config_pages     from '@/configs/pages';
import * as ui_page          from '@/ui/page';
import * as ui_pagehead      from '@/ui/pagehead';
import * as ui_section       from '@/ui/section';
import * as ui_table         from '@/ui/table';
import * as ui_empty         from '@/ui/empty';
import * as ui_stat          from '@/ui/stat';
import * as lib_api_url      from '@/lib/api_url';
import * as lib_hooks        from '@/lib/hooks';
import * as react            from 'react';
import * as lucide           from 'lucide-react';
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
  data?:         {
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
  return `${r.toFixed(2)}x`;
}

function overall_summary(tests: ScriptTest[]): { winner: 'Lua' | 'GDScript' | null; pct: number; wins: number; total: number } | null {
  const ratios = tests
    .map((t) => t.throughput_ratio)
    .filter((r): r is number => typeof r === 'number' && Number.isFinite(r) && r > 0);
  if (ratios.length === 0) return null;
  const geo = Math.exp(ratios.reduce((a, r) => a + Math.log(r), 0) / ratios.length);
  const lua_wins = ratios.filter((r) => r > 1).length;
  if (Math.abs(geo - 1) < 0.005) return { winner: null, pct: 0, wins: 0, total: ratios.length };
  const lua_ahead = geo > 1;
  return {
    winner: lua_ahead ? 'Lua' : 'GDScript',
    pct:    (lua_ahead ? geo - 1 : 1 / geo - 1) * 100,
    wins:   lua_ahead ? lua_wins : ratios.filter((r) => r < 1).length,
    total:  ratios.length
  };
}

function pretty_name(name?: string): string {
  if (!name) return '—';
  return name.replace(/_/g, ' ');
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function Benchmarks() {
  const [payload, setPayload] = react.useState<BenchmarkResponse | null>(null);
  const [error, setError]     = react.useState(false);
  const [loading, setLoading] = react.useState(true);

  lib_hooks.use_page_loading(loading);

  react.useEffect(() => {
    let cancelled = false;
    fetch(lib_api_url.get_api_url('/benchmark'))
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((json: BenchmarkResponse) => {
        if (!cancelled) setPayload(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const data  = payload?.data;
  const tests = data?.scripting_tests ?? [];
  const env   = data?.environment ?? {};
  const overall = overall_summary(tests);

  return (
    <ui_page.Page id="benchmarks">
      <ui_pagehead.PageHead
        label="Benchmarks"
        title={<>Lua vs GDScript.<br/>Measured, not <span>marketed.</span></>}
        intro={config_pages.pages.benchmarks.description}
        introClassName="bm-intro"
      />

      {!loading && error && (
        <ui_empty.EmptyState className="bm-state" icon={<lucide.WifiOff size={24} strokeWidth={2.5}/>}>
          Could not load benchmarks — try again later.
        </ui_empty.EmptyState>
      )}

      {!loading && !error && (
        <>
          <ui_section.Section titleClassName="bm-section-title">Environment</ui_section.Section>

          <ui_stat.StatGrid columns={4} className="bm-env">
            <ui_stat.Stat
              animate
              index={0}
              label="Vital.sandbox"
              icon={<lucide.Layers size={16} strokeWidth={2}/>}
              value={payload?.tag || '—'}
            />
            {ENV_FIELDS.map(({ key, label, Icon }, i) => {
              const val = env[key];
              if (val == null || val === '') return null;
              return (
                <ui_stat.Stat
                  key={key}
                  animate
                  index={i + 1}
                  label={label}
                  icon={<Icon size={16} strokeWidth={2}/>}
                  value={capitalize(String(val))}
                />
              );
            })}
          </ui_stat.StatGrid>

          <ui_section.Section titleClassName="bm-section-title bm-section-title--table">Benchmarks</ui_section.Section>

          {data?.note && <p className="bm-note">{data.note}*</p>}

          {overall && (
            <p className="bm-note bm-overall">
              {overall.winner
                ? <>Overall, <span className={overall.winner === 'Lua' ? 'bm-overall--lua' : 'bm-overall--gd'}>{overall.winner}</span> is faster by <strong>{overall.pct.toFixed(0)}%</strong> on average ({overall.wins} of {overall.total} tests).</>
                : <>Overall, Lua and GDScript perform about the same.</>}
            </p>
          )}

          <ui_table.DataTable
            bordered
            wrapClassName="bm-table-wrap"
            head={['Workload', 'Faster', 'Ratio', 'Lua', 'GDScript']}
            rows={tests}
            rowKey={(t) => t.name ?? ''}
            rowClassName={(t) => {
              const faster = (t.faster ?? '').toLowerCase();
              return faster === 'lua' ? 'bm-row--lua' : faster === 'gdscript' ? 'bm-row--gd' : undefined;
            }}
            empty={{
              icon: <lucide.Gauge size={24} strokeWidth={1.5}/>,
              text: 'No scripting tests in this release.'
            }}
            renderRow={(t) => {
              const faster = (t.faster ?? '').toLowerCase();
              const lua_win = faster === 'lua';
              const gd_win  = faster === 'gdscript';
              return (
                <>
                  <td className="bm-name">{pretty_name(t.name)}</td>
                  <td className={lua_win ? 'bm-faster--lua' : gd_win ? 'bm-faster--gd' : 'bm-faster--tie'}>
                    {lua_win ? 'Lua' : gd_win ? 'GDScript' : (t.faster ?? '—')}
                  </td>
                  <td>{fmt_ratio(t.throughput_ratio)}</td>
                  <td>{fmt_ops(t.lua?.ops_sec)}</td>
                  <td>{fmt_ops(t.gdscript?.ops_sec)}</td>
                </>
              );
            }}
          />
        </>
      )}
    </ui_page.Page>
  );
}
