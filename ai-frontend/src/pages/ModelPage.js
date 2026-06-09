import React, { useState } from 'react';

const METRICS = {
  r2:           0.835,
  mae:          418.72,
  mape:         33.6,
  trainR2:      0.961,
  testR2:       0.835,
  trainSize:    1588,
  testSize:     397,
  totalSamples: 1985,
  nFeatures:    46,
  nEstimators:  300,
  algorithm:    'Random Forest Regressor',
};

const FEATURES = [
  { name: 'Log Annual Budget',      pct: 47.4, color: '#6c63ff' },
  { name: 'Similar Project Cost',   pct: 20.1, color: '#6c63ff' },
  { name: 'Project Age (yrs)',      pct: 16.5, color: '#6c63ff' },
  { name: 'Payment Ratio',          pct: 3.0,  color: '#9898b8' },
  { name: 'Construction Company',   pct: 2.0,  color: '#9898b8' },
  { name: 'Experience Rating',      pct: 1.8,  color: '#9898b8' },
  { name: 'Project Type: Hospital', pct: 1.6,  color: '#9898b8' },
  { name: 'Project Type: Flyover',  pct: 1.0,  color: '#9898b8' },
  { name: 'Project Type: Bridge',   pct: 0.7,  color: '#9898b8' },
  { name: 'Other features',         pct: 5.9,  color: '#55556a' },
];

function ModelPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <h1 className="page-title">Model Info</h1>
      <p className="page-subtitle">// random forest · 300 trees · 1,985 training samples · r² 0.835</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {[
          { id: 'overview',  label: 'Overview'   },
          { id: 'metrics',   label: 'Metrics'    },
          { id: 'features',  label: 'Features'   },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div>
          {/* Key metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
            {[
              { label: 'Test R²',          value: '0.835', sub: 'explains 83.5% of budget variance', highlight: true },
              { label: 'Train R²',         value: '0.961', sub: 'trains well without severe overfit'  },
              { label: 'Mean Abs. Error',  value: '419 M', sub: 'avg prediction error in PKR M'        },
            ].map(card => (
              <div key={card.label} style={{
                background: 'var(--bg-card)', border: `1px solid ${card.highlight ? 'var(--border-accent)' : 'var(--border-dim)'}`,
                borderRadius: '14px', padding: '24px',
                boxShadow: card.highlight ? '0 0 24px var(--accent-glow)' : 'none'
              }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>{card.label}</div>
                <div style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px', color: card.highlight ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{card.value}</div>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '8px' }}>{card.sub}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">Training Configuration</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
              {[
                { label: 'Algorithm',         value: 'Random Forest Regressor' },
                { label: 'Total Samples',     value: '1,985 projects'          },
                { label: 'Train / Test',      value: '80% / 20%'               },
                { label: 'Training Samples',  value: '1,588'                   },
                { label: 'Testing Samples',   value: '397'                     },
                { label: 'Trees',             value: '300 estimators'          },
                { label: 'Max Depth',         value: '12'                      },
                { label: 'Total Features',    value: '46 columns'              },
                { label: 'Target',            value: 'TotalBudget (PKR M)'     },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'var(--bg-surface)', borderRadius: '8px', padding: '14px 16px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.8px', marginBottom: '6px' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Data Pipeline</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '2' }}>
              {[
                ['original dataset', '485 real projects from Pakistan'],
                ['synthetic expansion', '1,500 rows generated with domain-aware logic'],
                ['company tiers', 'Tier 1 (+22%), Tier 2 (+8%), Tier 3 (baseline)'],
                ['city multipliers', 'Islamabad, Karachi, Lahore, Rawalpindi (+25%)'],
                ['type multipliers', 'Dam, Bridge, Flyover, Uni. (+75%)'],
                ['similar cost lookup', 'median TotalBudget by project type × city'],
                ['encoding', 'one-hot for dept, ptype, location · ordinal for company'],
              ].map(([key, val]) => (
                <div key={key} style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--accent-secondary)', minWidth: '200px' }}>{key}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── METRICS ── */}
      {activeTab === 'metrics' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { label: 'R² Score (Test)',  value: '0.835', bar: 83.5, color: '#6c63ff', desc: 'Model explains 83.5% of total budget variance on unseen projects. Strong performance for cost estimation.' },
              { label: 'R² Score (Train)', value: '0.961', bar: 96.1, color: '#00e5c0', desc: 'High training fit. Gap between train/test (0.96→0.84) is acceptable — model generalizes well.' },
              { label: 'MAE',  value: 'PKR 419 M',  bar: null, color: '#9898b8', desc: 'Mean Absolute Error — average prediction is off by PKR 419M. Reasonable given budget ranges from 25M to 10,000M.' },
              { label: 'MAPE', value: '33.6%',       bar: null, color: '#9898b8', desc: 'Mean Absolute Percentage Error. Lower-budget projects skew MAPE higher; absolute MAE is the more useful metric here.' },
            ].map(card => (
              <div key={card.label} className="card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>{card.label}</div>
                <div style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', color: card.color, marginBottom: '14px' }}>{card.value}</div>
                {card.bar !== null && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ background: 'var(--bg-surface)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${card.bar}%`, height: '100%', background: card.color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                    </div>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '5px', textAlign: 'right' }}>{card.bar}%</div>
                  </div>
                )}
                <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', lineHeight: '1.7' }}>{card.desc}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-title">Metrics Reference</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
                  {['Metric','Full Name','Value','Ideal'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { m: 'R²',   full: 'R-Squared',              val: '0.835',       ideal: 'As close to 1.0 as possible' },
                  { m: 'MAE',  full: 'Mean Absolute Error',     val: 'PKR 419M',    ideal: 'As low as possible'          },
                  { m: 'MAPE', full: 'Mean Abs. % Error',       val: '33.6%',       ideal: 'As low as possible'          },
                ].map((row, i) => (
                  <tr key={row.m} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '12px', color: 'var(--accent-primary)', fontWeight: '600' }}>{row.m}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{row.full}</td>
                    <td style={{ padding: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>{row.val}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>{row.ideal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── FEATURES ── */}
      {activeTab === 'features' && (
        <div>
          <div className="card">
            <div className="card-title">Feature Importance — Top 10</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {FEATURES.map((f, i) => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', width: '22px', textAlign: 'right' }}>{i + 1}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)', width: '220px', flexShrink: 0 }}>{f.name}</div>
                  <div style={{ flex: 1, background: 'var(--bg-surface)', borderRadius: '3px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${(f.pct / 47.4) * 100}%`, height: '100%', background: f.color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', width: '44px', textAlign: 'right' }}>{f.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Feature Groups</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
              {[
                { group: 'Continuous', features: ['ExperienceRating','projAgeYrs','logAnnualBudget','paymentRatio','SimilarProjectCost'], color: '#6c63ff' },
                { group: 'Categorical (encoded)', features: ['CompanyEncoded','deptActive'], color: '#00e5c0' },
                { group: 'One-hot: Department', features: ['dept_Agriculture','dept_Education','dept_Energy','dept_Health','dept_Infrastructure','dept_Water & Sanitation'], color: '#9898b8' },
                { group: 'One-hot: Project Type', features: ['ptype_Bridge','ptype_Dam','ptype_Flyover','ptype_Hospital','... 8 more'], color: '#9898b8' },
                { group: 'One-hot: Location', features: ['loc_Islamabad','loc_Lahore','loc_Karachi','loc_Rawalpindi','... 16 more'], color: '#9898b8' },
              ].map(g => (
                <div key={g.group} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: g.color, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '10px' }}>{g.group}</div>
                  {g.features.map(f => (
                    <div key={f} style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', lineHeight: '2', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: g.color, display: 'inline-block', flexShrink: 0 }} />{f}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelPage;
