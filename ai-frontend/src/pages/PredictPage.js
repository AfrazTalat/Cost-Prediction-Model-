import React, { useState, useEffect } from 'react';

const LOCATIONS = [
  'Abbottabad','Bahawalpur','Dera Ghazi Khan','Faisalabad','Gujranwala',
  'Gwadar','Hyderabad','Islamabad','Karachi','Lahore','Mardan','Multan',
  'Peshawar','Quetta','Rawalpindi','Sargodha','Sialkot','Sukkur','Swat','Turbat'
];

const PROJECT_TYPES = [
  'Bridge','Dam','Flyover','Grid Station','Hospital','Irrigation Canal',
  'Road Construction','Rural Health Centre','School Building','Solar Plant',
  'University Building','Water Treatment Plant'
];

const DEPARTMENTS = [
  'Agriculture','Education','Energy','Health','Infrastructure','Water & Sanitation'
];

const COMPANIES = [
  'Frontier Works Organization','National Logistics Cell','Nespak',
  'Descon Engineering','Habib Construction','Izhar Construction',
  'China State Construction','FWO-CCECC JV','M/S Tariq Builders',
  'Al-Shafi Construction','Saif Group','Zahir Khan & Brothers',
  'SMS Infrastructure','Giga Construction','Techno Construction'
];

const TIER1 = new Set(['Frontier Works Organization','National Logistics Cell','China State Construction','Nespak','FWO-CCECC JV']);
const TIER2 = new Set(['Descon Engineering','Habib Construction','Izhar Construction','Saif Group','SMS Infrastructure','Giga Construction']);

const SIMILAR = {
  "Bridge":{"Abbottabad":2872,"Bahawalpur":2945,"Dera Ghazi Khan":3653,"Faisalabad":1340,"Gujranwala":3229,"Gwadar":3616,"Hyderabad":1858,"Islamabad":5555,"Karachi":3958,"Lahore":4620,"Mardan":2074,"Multan":1612,"Peshawar":4704,"Quetta":2671,"Rawalpindi":2773,"Sargodha":2800,"Sialkot":1834,"Sukkur":2861,"Swat":2447,"Turbat":1886},
  "Dam":{"Abbottabad":4984,"Bahawalpur":2516,"Dera Ghazi Khan":2016,"Faisalabad":2521,"Gujranwala":2975,"Gwadar":5773,"Hyderabad":4812,"Islamabad":3135,"Karachi":5183,"Lahore":2421,"Mardan":3351,"Multan":2388,"Peshawar":3496,"Quetta":2610,"Rawalpindi":3718,"Sargodha":2084,"Sialkot":3002,"Sukkur":5600,"Swat":1823,"Turbat":3610},
  "Flyover":{"Abbottabad":3395,"Bahawalpur":6377,"Dera Ghazi Khan":2850,"Faisalabad":4872,"Gujranwala":7287,"Gwadar":4092,"Hyderabad":2079,"Islamabad":5623,"Karachi":2924,"Lahore":3052,"Mardan":4865,"Multan":2487,"Peshawar":4751,"Quetta":2505,"Rawalpindi":3663,"Sargodha":4693,"Sialkot":5265,"Sukkur":2272,"Swat":3050,"Turbat":3986},
  "Grid Station":{"Abbottabad":1619,"Bahawalpur":1442,"Dera Ghazi Khan":1964,"Faisalabad":1374,"Gujranwala":841,"Gwadar":2051,"Hyderabad":1694,"Islamabad":1430,"Karachi":1837,"Lahore":1738,"Mardan":1010,"Multan":1965,"Peshawar":2792,"Quetta":1328,"Rawalpindi":1918,"Sargodha":1716,"Sialkot":1063,"Sukkur":1132,"Swat":1154,"Turbat":912},
  "Hospital":{"Abbottabad":1786,"Bahawalpur":924,"Dera Ghazi Khan":2123,"Faisalabad":2419,"Gujranwala":3429,"Gwadar":1877,"Hyderabad":1398,"Islamabad":2857,"Karachi":1123,"Lahore":2568,"Mardan":1821,"Multan":2874,"Peshawar":1234,"Quetta":1756,"Rawalpindi":2338,"Sargodha":1895,"Sialkot":2379,"Sukkur":803,"Swat":1519,"Turbat":1251},
  "Irrigation Canal":{"Abbottabad":1600,"Bahawalpur":1837,"Dera Ghazi Khan":2600,"Faisalabad":1177,"Gujranwala":1243,"Gwadar":784,"Hyderabad":1121,"Islamabad":1893,"Karachi":1840,"Lahore":2463,"Mardan":1929,"Multan":1302,"Peshawar":2490,"Quetta":2107,"Rawalpindi":1457,"Sargodha":1417,"Sialkot":1563,"Sukkur":1255,"Swat":2095,"Turbat":1653},
  "Road Construction":{"Abbottabad":2128,"Bahawalpur":1808,"Dera Ghazi Khan":1222,"Faisalabad":1464,"Gujranwala":1974,"Gwadar":1593,"Hyderabad":1419,"Islamabad":1674,"Karachi":1417,"Lahore":2207,"Mardan":1523,"Multan":2059,"Peshawar":1661,"Quetta":1412,"Rawalpindi":1242,"Sargodha":1055,"Sialkot":2278,"Sukkur":2030,"Swat":1672,"Turbat":1265},
  "Rural Health Centre":{"Abbottabad":1406,"Bahawalpur":1807,"Dera Ghazi Khan":1046,"Faisalabad":1989,"Gujranwala":955,"Gwadar":1285,"Hyderabad":3084,"Islamabad":2878,"Karachi":1900,"Lahore":2156,"Mardan":1736,"Multan":1119,"Peshawar":1422,"Quetta":1197,"Rawalpindi":1338,"Sargodha":1615,"Sialkot":1216,"Sukkur":1013,"Swat":1336,"Turbat":1132},
  "School Building":{"Abbottabad":2112,"Bahawalpur":1260,"Dera Ghazi Khan":854,"Faisalabad":2518,"Gujranwala":2119,"Gwadar":2095,"Hyderabad":1531,"Islamabad":2126,"Karachi":1068,"Lahore":1845,"Mardan":2095,"Multan":1305,"Peshawar":1513,"Quetta":2890,"Rawalpindi":1846,"Sargodha":1134,"Sialkot":2509,"Sukkur":2086,"Swat":1972,"Turbat":2139},
  "Solar Plant":{"Abbottabad":940,"Bahawalpur":1300,"Dera Ghazi Khan":2309,"Faisalabad":1313,"Gujranwala":1896,"Gwadar":2361,"Hyderabad":1671,"Islamabad":918,"Karachi":1853,"Lahore":2151,"Mardan":1415,"Multan":1047,"Peshawar":1119,"Quetta":1356,"Rawalpindi":1447,"Sargodha":2276,"Sialkot":1587,"Sukkur":2364,"Swat":2129,"Turbat":1093},
  "University Building":{"Abbottabad":4108,"Bahawalpur":2612,"Dera Ghazi Khan":6369,"Faisalabad":3428,"Gujranwala":4529,"Gwadar":3321,"Hyderabad":7657,"Islamabad":5320,"Karachi":4118,"Lahore":3156,"Mardan":2484,"Multan":2730,"Peshawar":4432,"Quetta":2235,"Rawalpindi":4012,"Sargodha":3391,"Sialkot":4978,"Sukkur":6861,"Swat":4345,"Turbat":5132},
  "Water Treatment Plant":{"Abbottabad":2066,"Bahawalpur":2385,"Dera Ghazi Khan":2461,"Faisalabad":2343,"Gujranwala":1532,"Gwadar":2345,"Hyderabad":1682,"Islamabad":2004,"Karachi":3792,"Lahore":2667,"Mardan":1920,"Multan":2057,"Peshawar":1969,"Quetta":2664,"Rawalpindi":2507,"Sargodha":2445,"Sialkot":2070,"Sukkur":1869,"Swat":2732,"Turbat":2160}
};

function getTier(company) {
  if (TIER1.has(company)) return { label: 'Tier 1 — Premium', color: 'var(--accent-secondary)' };
  if (TIER2.has(company)) return { label: 'Tier 2 — Mid', color: 'var(--accent-primary)' };
  return { label: 'Tier 3 — Standard', color: 'var(--text-muted)' };
}

function PredictPage() {
  const [form, setForm] = useState({
    location: '',
    projectType: '',
    department: '',
    company: '',
    projectAge: 8,
    experienceRating: 3.0,
    paymentRatio: 0.5,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [simCost, setSimCost] = useState(null);

  useEffect(() => {
    if (form.projectType && form.location) {
      const val = (SIMILAR[form.projectType] || {})[form.location] || null;
      setSimCost(val);
    } else {
      setSimCost(null);
    }
  }, [form.projectType, form.location]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handlePredict() {
    if (!form.location || !form.projectType || !form.department || !form.company) {
      setError('Please fill in all fields before predicting.');
      return;
    }
    setError('');
    setLoading(true);
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department:        form.department,
          project_type:      form.projectType,
          city:              form.location,
          company:           form.company,
          project_age:       parseFloat(form.projectAge),
          experience_rating: parseFloat(form.experienceRating),
          payment_ratio:     parseFloat(form.paymentRatio),
          dept_active:       1,
        }),
      });
      const data = await response.json();
      if (data.prediction === undefined) {
        setError('Unexpected response from server.');
      } else {
        setPrediction(data);
      }
    } catch (err) {
      setError('Could not connect to backend. Make sure Flask is running on port 5000.');
    }
    setLoading(false);
  }

  const tier = form.company ? getTier(form.company) : null;

  return (
    <div>
      <h1 className="page-title">Predict Project Budget</h1>
      <p className="page-subtitle">// fill in project parameters to generate an ai-driven cost estimate</p>

      <div className="card">
        <div className="card-title">Project Configuration</div>
        <div className="form-grid">

          <div className="form-group">
            <label>Department</label>
            <select name="department" value={form.department} onChange={handleChange}>
              <option value="">— select department —</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Project Type</label>
            <select name="projectType" value={form.projectType} onChange={handleChange}>
              <option value="">— select type —</option>
              {PROJECT_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>City</label>
            <select name="location" value={form.location} onChange={handleChange}>
              <option value="">— select city —</option>
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Construction Company</label>
            <select name="company" value={form.company} onChange={handleChange}>
              <option value="">— select company —</option>
              {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

        </div>

        {/* Company tier badge */}
        {tier && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '11px', fontFamily: 'var(--font-mono)', color: tier.color,
              border: `1px solid ${tier.color}`, padding: '3px 10px', borderRadius: '4px',
              opacity: 0.9
            }}>{tier.label}</span>
            {simCost && (
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                similar projects ({form.projectType} / {form.location}):
                <strong style={{ color: 'var(--text-secondary)', marginLeft: '6px' }}>PKR {simCost.toLocaleString()} M</strong>
              </span>
            )}
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <div className="card-title" style={{ marginBottom: '16px' }}>Project Parameters</div>
          <div className="form-grid">

            <div className="form-group">
              <label>Project Age: <span style={{ color: 'var(--accent-primary)' }}>{form.projectAge} yrs</span></label>
              <input
                type="range" name="projectAge"
                min="2" max="17" step="1"
                value={form.projectAge}
                onChange={handleChange}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            <div className="form-group">
              <label>Experience Rating: <span style={{ color: 'var(--accent-primary)' }}>{parseFloat(form.experienceRating).toFixed(1)}</span></label>
              <input
                type="range" name="experienceRating"
                min="1.5" max="5.0" step="0.1"
                value={form.experienceRating}
                onChange={handleChange}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Payment Ratio (% paid so far): <span style={{ color: 'var(--accent-primary)' }}>{Math.round(form.paymentRatio * 100)}%</span></label>
              <input
                type="range" name="paymentRatio"
                min="0.05" max="0.98" step="0.01"
                value={form.paymentRatio}
                onChange={handleChange}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer', width: '100%' }}
              />
            </div>

          </div>
        </div>

        {error && <div className="error-box">⚠ {error}</div>}

        <button className="predict-btn" onClick={handlePredict} disabled={loading}>
          {loading ? 'calculating...' : '→ predict budget'}
        </button>
      </div>

      {loading && (
        <div className="loading">analysing project parameters...</div>
      )}

      {prediction && !loading && (
        <div className="card">
          <div className="card-title">Prediction Result</div>
          <div className="result-box">
            <div className="result-label">estimated total budget</div>
            <div className="result-amount">PKR {prediction.prediction.toLocaleString()}</div>
            <div className="result-unit">Pakistani Rupees — Millions</div>
            <div className="result-range">
              confidence range &nbsp;·&nbsp; PKR {prediction.low.toLocaleString()}M — PKR {prediction.high.toLocaleString()}M
              <br />
              <small style={{ opacity: 0.6 }}>based on ±22% variance from Random Forest model (R² 0.835)</small>
            </div>
          </div>

          <div style={{
            marginTop: '20px', padding: '18px 20px',
            background: 'var(--bg-surface)', border: '1px solid var(--border-dim)',
            borderRadius: '10px', fontSize: '13px', fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)', lineHeight: '1.9'
          }}>
            <div style={{ color: 'var(--accent-secondary)', marginBottom: '8px', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>// analysis summary</div>
            <div>→ project type: <strong style={{ color: 'var(--text-primary)' }}>{form.projectType}</strong></div>
            <div>→ location: <strong style={{ color: 'var(--text-primary)' }}>{form.location}</strong></div>
            <div>→ company tier: <strong style={{ color: tier?.color }}>{tier?.label}</strong></div>
            {simCost && <div>→ area median cost: <strong style={{ color: 'var(--text-primary)' }}>PKR {simCost.toLocaleString()} M</strong></div>}
            <div>→ trained on <strong style={{ color: 'var(--text-primary)' }}>1,985 projects</strong> (485 real + 1,500 synthetic)</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictPage;
