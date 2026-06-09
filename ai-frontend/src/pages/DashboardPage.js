import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';

const deptData = [
  { dept: 'Agriculture',    avgBudget: 3188 },
  { dept: 'Education',      avgBudget: 3219 },
  { dept: 'Energy',         avgBudget: 2966 },
  { dept: 'Health',         avgBudget: 2752 },
  { dept: 'Infrastructure', avgBudget: 3159 },
  { dept: 'Water & San.',   avgBudget: 3085 },
];

const companyData = [
  { name: 'FWO',           avgBudget: 3820, tier: 1 },
  { name: 'NLC',           avgBudget: 3750, tier: 1 },
  { name: 'Nespak',        avgBudget: 3640, tier: 1 },
  { name: 'China State',   avgBudget: 3910, tier: 1 },
  { name: 'FWO-CCECC',     avgBudget: 3680, tier: 1 },
  { name: 'Descon',        avgBudget: 3180, tier: 2 },
  { name: 'Habib Const.',  avgBudget: 3020, tier: 2 },
  { name: 'Saif Group',    avgBudget: 3090, tier: 2 },
  { name: 'SMS Infra',     avgBudget: 3140, tier: 2 },
  { name: 'M/S Tariq',     avgBudget: 2640, tier: 3 },
  { name: 'Al-Shafi',      avgBudget: 2590, tier: 3 },
  { name: 'Giga Const.',   avgBudget: 2980, tier: 3 },
];

const ptypeBudgetData = [
  { type: 'Bridge',        avg: 3200 },
  { type: 'Dam',           avg: 3680 },
  { type: 'Flyover',       avg: 3900 },
  { type: 'Grid Station',  avg: 1620 },
  { type: 'Hospital',      avg: 1950 },
  { type: 'Irrigation',    avg: 1710 },
  { type: 'Road',          avg: 1640 },
  { type: 'School',        avg: 1820 },
  { type: 'Solar Plant',   avg: 1580 },
  { type: 'University',    avg: 4120 },
  { type: 'Water Trt.',    avg: 2340 },
];

const paymentTrendData = [
  { year: '2', avgPaid: 1271 },
  { year: '3', avgPaid: 2088 },
  { year: '4', avgPaid: 1725 },
  { year: '5', avgPaid: 1654 },
  { year: '6', avgPaid: 1315 },
  { year: '7', avgPaid: 1091 },
  { year: '8', avgPaid: 1739 },
  { year: '9', avgPaid: 1605 },
  { year: '10', avgPaid: 1243 },
  { year: '11', avgPaid: 1504 },
];

const comparisonData = [
  { project: 'P1',  actual: 436,  predicted: 460  },
  { project: 'P2',  actual: 613,  predicted: 580  },
  { project: 'P3',  actual: 662,  predicted: 700  },
  { project: 'P4',  actual: 1249, predicted: 1190 },
  { project: 'P5',  actual: 848,  predicted: 890  },
  { project: 'P6',  actual: 507,  predicted: 530  },
  { project: 'P7',  actual: 217,  predicted: 240  },
  { project: 'P8',  actual: 1693, predicted: 1640 },
  { project: 'P9',  actual: 1952, predicted: 2010 },
  { project: 'P10', actual: 2052, predicted: 1980 },
];

const TIER_COLORS = { 1: '#00e5c0', 2: '#6c63ff', 3: '#9898b8' };

const TOOLTIP_STYLE = {
  background: '#14141f',
  border: '1px solid rgba(108,99,255,0.3)',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '12px',
  fontFamily: "'DM Mono', monospace",
  color: '#eeeef5',
};

function DarkTooltip({ active, payload, label, unit = 'M' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <div style={{ color: '#9898b8', marginBottom: '6px', fontSize: '11px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || '#6c63ff' }}>
          {p.name}: PKR {p.value?.toLocaleString()}{unit}
        </div>
      ))}
    </div>
  );
}

const TICK = { fill: '#55556a', fontSize: 11, fontFamily: "'DM Mono', monospace" };
const GRID = { stroke: 'rgba(108,99,255,0.08)', strokeDasharray: '3 3' };

function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-dim)',
      borderRadius: '14px', padding: '24px 28px',
    }}>
      <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-1px' }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '6px' }}>{sub}</div>}
    </div>
  );
}

function DashboardPage() {
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">// visual overview — 485 original + 1,500 synthetic projects · pkr millions</p>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Projects (expanded)" value="1,985" sub="485 real · 1,500 synthetic" />
        <StatCard label="Avg Budget" value="PKR 3,061M" sub="across all project types" />
        <StatCard label="Model R² Score" value="0.835" sub="random forest · 300 trees" />
      </div>

      <div className="charts-grid">

        {/* Chart 1: Budget by Department */}
        <div className="chart-wrapper">
          <div className="chart-title">Avg Budget by Department</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptData} margin={{ top: 8, right: 12, left: 0, bottom: 52 }}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="dept" angle={-35} textAnchor="end" tick={TICK} interval={0} />
              <YAxis tick={TICK} />
              <Tooltip content={<DarkTooltip unit="M" />} />
              <Bar dataKey="avgBudget" name="Avg Budget" fill="#6c63ff" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Budget by Project Type */}
        <div className="chart-wrapper">
          <div className="chart-title">Avg Budget by Project Type</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ptypeBudgetData} margin={{ top: 8, right: 12, left: 0, bottom: 52 }}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="type" angle={-35} textAnchor="end" tick={TICK} interval={0} />
              <YAxis tick={TICK} />
              <Tooltip content={<DarkTooltip unit="M" />} />
              <Bar dataKey="avg" name="Avg Budget" fill="#00e5c0" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Company Avg Budget (colored by tier) */}
        <div className="chart-wrapper">
          <div className="chart-title">Avg Budget by Construction Company</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={companyData} margin={{ top: 8, right: 12, left: 0, bottom: 64 }}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="name" angle={-40} textAnchor="end" tick={TICK} interval={0} />
              <YAxis tick={TICK} />
              <Tooltip content={<DarkTooltip unit="M" />} />
              <Bar dataKey="avgBudget" name="Avg Budget" radius={[4,4,0,0]}>
                {companyData.map((entry, i) => (
                  <Cell key={i} fill={TIER_COLORS[entry.tier]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', justifyContent: 'center' }}>
            {[['Tier 1 – Premium','#00e5c0'],['Tier 2 – Mid','#6c63ff'],['Tier 3 – Standard','#9898b8']].map(([label, color]) => (
              <span key={label} style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Chart 4: Payment trend */}
        <div className="chart-wrapper">
          <div className="chart-title">Avg Amount Paid by Project Age</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={paymentTrendData} margin={{ top: 8, right: 12, left: 0, bottom: 10 }}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="year" tick={TICK} label={{ value: 'years', position: 'insideBottomRight', offset: -5, fill: '#55556a', fontSize: 11 }} />
              <YAxis tick={TICK} />
              <Tooltip content={<DarkTooltip unit="M" />} />
              <Line type="monotone" dataKey="avgPaid" name="Avg Paid" stroke="#6c63ff" strokeWidth={2}
                dot={{ r: 4, fill: '#6c63ff', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#00e5c0' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 5: Predicted vs Actual – spans full width */}
        <div className="chart-wrapper" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-title">Predicted vs Actual Budget — Sample Projects</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={comparisonData} margin={{ top: 8, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="project" tick={TICK} />
              <YAxis tick={TICK} />
              <Tooltip content={<DarkTooltip unit="M" />} />
              <Bar dataKey="actual"    name="Actual Budget"    fill="#6c63ff" radius={[3,3,0,0]} />
              <Bar dataKey="predicted" name="Predicted Budget" fill="#00e5c0" radius={[3,3,0,0]} opacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px', justifyContent: 'center' }}>
            {[['Actual','#6c63ff'],['Predicted','#00e5c0']].map(([label, color]) => (
              <span key={label} style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
                {label} Budget
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
