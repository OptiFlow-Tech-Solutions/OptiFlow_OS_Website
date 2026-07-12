import { useState } from 'react';
import { demoTabs, demoDashboardTasks, demoAttendanceRows, kpiCycleData } from '../../data/productOverview';

interface KpiState {
  completionIdx: number;
  tasksIdx: number;
  attendanceIdx: number;
}

interface ChipState {
  [key: number]: 'pending' | 'done' | 'overdue';
}

export default function DemoTabs() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [kpiState, setKpiState] = useState<KpiState>({ completionIdx: 0, tasksIdx: 0, attendanceIdx: 0 });
  const [chipState, setChipState] = useState<ChipState>({ 0: 'pending', 1: 'done', 2: 'overdue', 3: 'pending' });

  const cycleKpi = (metric: 'completion' | 'tasks' | 'attendance') => {
    setKpiState((prev) => {
      const key = metric === 'completion' ? 'completionIdx' : metric === 'tasks' ? 'tasksIdx' : 'attendanceIdx';
      const data = kpiCycleData[metric];
      return { ...prev, [key]: (prev[key] + 1) % data.length };
    });
  };

  const toggleChip = (idx: number) => {
    setChipState((prev) => {
      const states = ['pending', 'done', 'overdue'] as const;
      const current = states.indexOf(prev[idx] ?? 'pending');
      return { ...prev, [idx]: states[(current + 1) % 3] };
    });
  };

  const activeKpi = {
    completion: kpiCycleData.completion[kpiState.completionIdx],
    tasks: kpiCycleData.tasks[kpiState.tasksIdx],
    attendance: kpiCycleData.attendance[kpiState.attendanceIdx],
  };

  const chipStyles: Record<string, React.CSSProperties> = {
    pending: { background: 'color-mix(in oklch, oklch(50% 0.08 80) 12%, transparent)', color: 'oklch(50% 0.08 80)' },
    done: { background: 'color-mix(in oklch, var(--green) 12%, transparent)', color: 'var(--green)' },
    overdue: { background: 'color-mix(in oklch, oklch(44% 0.16 20) 12%, transparent)', color: 'oklch(44% 0.16 20)' },
  };

  return (
    <div className="dash-card float-anim" style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px 24px',
      boxShadow: '0 4px 24px color-mix(in oklch, var(--fg) 8%, transparent)',
    }}>
      {/* Tabs */}
      <div className="demo-tabs" role="tablist" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 'var(--gap-md)', padding: '0 4px' }}>
        {demoTabs.map((tab) => (
          <button
            key={tab.id}
            className={`demo-tab${activeTab === tab.id ? ' active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius) var(--radius) 0 0',
              fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
              cursor: 'pointer', background: activeTab === tab.id ? 'var(--surface)' : 'transparent',
              border: activeTab === tab.id ? '1px solid var(--border)' : '1px solid transparent',
              borderBottom: 'none', marginBottom: -1,
              transition: 'color 0.2s, background 0.2s', fontFamily: 'inherit',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Panel */}
      {activeTab === 'dashboard' && (
        <div className="demo-panel active" role="tabpanel">
          <div className="dash-kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-sm)', marginBottom: 'var(--gap-md)' }}>
            <div className="dash-kpi-item" onClick={() => cycleKpi('completion')} style={{ cursor: 'pointer', textAlign: 'center', padding: '12px 8px', borderRadius: 'var(--radius)', background: 'color-mix(in oklch, var(--teal) 5%, var(--bg))' }}>
              <div className="dash-kpi-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{activeKpi.completion.val}</div>
              <div className="dash-kpi-label" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{activeKpi.completion.label}</div>
            </div>
            <div className="dash-kpi-item" onClick={() => cycleKpi('tasks')} style={{ cursor: 'pointer', textAlign: 'center', padding: '12px 8px', borderRadius: 'var(--radius)', background: 'color-mix(in oklch, var(--teal) 5%, var(--bg))' }}>
              <div className="dash-kpi-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{activeKpi.tasks.val}</div>
              <div className="dash-kpi-label" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{activeKpi.tasks.label}</div>
            </div>
            <div className="dash-kpi-item" onClick={() => cycleKpi('attendance')} style={{ cursor: 'pointer', textAlign: 'center', padding: '12px 8px', borderRadius: 'var(--radius)', background: 'color-mix(in oklch, var(--teal) 5%, var(--bg))' }}>
              <div className="dash-kpi-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{activeKpi.attendance.val}</div>
              <div className="dash-kpi-label" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{activeKpi.attendance.label}</div>
            </div>
          </div>
          <div className="dash-chart" style={{ background: 'color-mix(in oklch, var(--fg) 3%, var(--bg))', borderRadius: 'var(--radius)', padding: 16, marginBottom: 'var(--gap-sm)' }}>
            <div className="dash-chart-bar" style={{ height: 6, borderRadius: 3, background: 'linear-gradient(90deg, var(--accent), var(--teal))', marginBottom: 12, width: '100%' }} />
            <div className="dash-chart-bar s2" style={{ height: 6, borderRadius: 3, background: 'linear-gradient(90deg, var(--accent), var(--teal))', marginBottom: 12, width: '78%' }} />
            <div className="dash-chart-bar s3" style={{ height: 6, borderRadius: 3, background: 'linear-gradient(90deg, var(--accent), var(--teal))', marginBottom: 12, width: '63%' }} />
            <div className="dash-chart-bar s4" style={{ height: 6, borderRadius: 3, background: 'linear-gradient(90deg, var(--accent), var(--teal))', width: '89%' }} />
          </div>
          <div className="dash-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--gap-sm)' }}>
            <div className="dash-widget" style={{ background: 'color-mix(in oklch, var(--fg) 3%, var(--bg))', borderRadius: 'var(--radius)', padding: 14 }}>
              <h4 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', margin: '0 0 8px' }}>Attendance</h4>
              <div className="w-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--fg)' }}>47 / 52</div>
              <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 4 }}>3 on leave &mdash; 2 late</div>
            </div>
            <div className="dash-widget" style={{ background: 'color-mix(in oklch, var(--fg) 3%, var(--bg))', borderRadius: 'var(--radius)', padding: 14 }}>
              <h4 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', margin: '0 0 8px' }}>Tasks Done Today</h4>
              <div className="w-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--fg)' }}>28</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>9 overdue</div>
            </div>
            <div className="dash-widget" style={{ background: 'color-mix(in oklch, var(--fg) 3%, var(--bg))', borderRadius: 'var(--radius)', padding: 14 }}>
              <h4 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', margin: '0 0 8px' }}>SOP Adherence</h4>
              <div className="w-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--fg)' }}>98%</div>
              <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 4 }}>+ 3% vs last week</div>
            </div>
            <div className="dash-widget" style={{ background: 'color-mix(in oklch, var(--fg) 3%, var(--bg))', borderRadius: 'var(--radius)', padding: 14 }}>
              <h4 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', margin: '0 0 8px' }}>Pending Approvals</h4>
              <div className="w-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--fg)' }}>12</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Avg wait: 4.2 hrs</div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Panel */}
      {activeTab === 'tasks' && (
        <div className="demo-panel active" role="tabpanel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Task Manager</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>15 of 23 completed</span>
          </div>
          <table className="dash-table" style={{ width: '100%', textAlign: 'left', fontSize: 12, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '6px 8px', color: 'var(--muted)', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>Task</th>
                <th style={{ padding: '6px 8px', color: 'var(--muted)', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>Owner</th>
                <th style={{ padding: '6px 8px', color: 'var(--muted)', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>Due</th>
                <th style={{ padding: '6px 8px', color: 'var(--muted)', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {demoDashboardTasks.map((task, i) => (
                <tr key={i}>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid color-mix(in oklch, var(--border) 50%, transparent)' }}>{task.name}</td>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid color-mix(in oklch, var(--border) 50%, transparent)' }}>
                    <div className="demo-avatar-row" style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-sm)' }}>
                      <div className="demo-avatar" style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: task.owner.color ? `color-mix(in oklch, ${task.owner.color} 14%, transparent)` : 'var(--accent-soft)',
                        display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
                        color: task.owner.color ?? 'var(--accent)', flexShrink: 0,
                      }}>
                        {task.owner.initials}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '6px 8px', fontSize: 12, color: 'var(--muted)', borderBottom: '1px solid color-mix(in oklch, var(--border) 50%, transparent)' }}>{task.due}</td>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid color-mix(in oklch, var(--border) 50%, transparent)' }}>
                    <span
                      className={`demo-chip ${chipState[i]}`}
                      onClick={() => toggleChip(i)}
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, transition: 'all 0.2s', ...chipStyles[chipState[i] ?? 'pending'] }}
                    >
                      {chipState[i] === 'pending' ? 'Pending' : chipState[i] === 'done' ? 'Done' : 'Overdue'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Attendance Panel */}
      {activeTab === 'attendance' && (
        <div className="demo-panel active" role="tabpanel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Today&apos;s Attendance</span>
            <span style={{ fontSize: 12, color: 'var(--green)' }}>90% present</span>
          </div>
          {demoAttendanceRows.map((row, i) => (
            <div key={i} className="demo-att-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-soft)', fontSize: 13 }}>
              <div className="demo-avatar-row" style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-sm)' }}>
                <div className="demo-avatar" style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: row.color ? `color-mix(in oklch, ${row.color} 14%, transparent)` : 'var(--accent-soft)',
                  display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
                  color: row.color ?? 'var(--accent)', flexShrink: 0,
                }}>
                  {row.initials}
                </div>
                {row.name}
              </div>
              <span className={`demo-att-status ${row.status}`} style={{
                padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                ...(row.status === 'present' ? { background: 'color-mix(in oklch, var(--green) 10%, transparent)', color: 'var(--green)' }
                  : row.status === 'absent' ? { background: 'color-mix(in oklch, oklch(44% 0.16 20) 10%, transparent)', color: 'oklch(44% 0.16 20)' }
                  : row.status === 'late' ? { background: 'color-mix(in oklch, oklch(50% 0.08 80) 10%, transparent)', color: 'oklch(50% 0.08 80)' }
                  : { background: 'color-mix(in oklch, var(--teal) 10%, transparent)', color: 'var(--teal)' }),
              }}>
                {row.status === 'present' ? 'Present'
                  : row.status === 'absent' ? 'Absent'
                  : row.status === 'late' ? `Late (${row.time})`
                  : 'On Leave'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Reports Panel */}
      {activeTab === 'reports' && (
        <div className="demo-panel active" role="tabpanel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Weekly Report</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>07-13 Jul 2026</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-sm)', marginBottom: 'var(--gap-md)' }}>
            <div className="report-kpi" style={{ margin: 0, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 16px' }}>
              <div className="rkpi-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>604</div>
              <div className="rkpi-label" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Tasks Completed</div>
            </div>
            <div className="report-kpi" style={{ margin: 0, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 16px' }}>
              <div className="rkpi-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>94%</div>
              <div className="rkpi-label" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>On-Time Rate</div>
            </div>
          </div>
          <div className="demo-report-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: 10, background: 'var(--green-soft)', borderRadius: 'var(--radius)', fontSize: 12 }}>
              <strong style={{ color: 'var(--green)' }}>+12%</strong> Productivity
            </div>
            <div style={{ padding: 10, background: 'var(--teal-soft)', borderRadius: 'var(--radius)', fontSize: 12 }}>
              <strong style={{ color: 'var(--teal)' }}>-8%</strong> Overdue Tasks
            </div>
            <div style={{ padding: 10, background: 'var(--accent-soft)', borderRadius: 'var(--radius)', fontSize: 12 }}>
              <strong style={{ color: 'var(--accent)' }}>98%</strong> SOP Adherence
            </div>
            <div style={{ padding: 10, background: 'color-mix(in oklch, var(--lime) 10%, transparent)', borderRadius: 'var(--radius)', fontSize: 12 }}>
              <strong style={{ color: 'var(--green)' }}>4.2h</strong> Avg Response
            </div>
          </div>
        </div>
      )}

      <div className="demo-click-hint" style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 12, fontStyle: 'italic' }}>
        Click tabs above to explore the platform &middot; Click KPIs to cycle metrics &middot; Click status chips to toggle
      </div>
    </div>
  );
}
