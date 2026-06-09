from flask import Flask, request, jsonify, send_from_directory
import pickle, json, numpy as np, os

app = Flask(__name__, static_folder='static')

BASE = os.path.dirname(__file__)
with open(os.path.join(BASE, 'model', 'best_model.pkl'), 'rb') as f:
    MODEL = pickle.load(f)
with open(os.path.join(BASE, 'model', 'meta.json')) as f:
    META = json.load(f)

FEATURE_COLS   = META['feature_cols']
COMPANY_MAP    = META['company_map']
DEPT_COLS      = META['dept_cols']
PTYPE_COLS     = META['ptype_cols']
LOC_COLS       = META['loc_cols']
PTYPE_LOC      = META['ptype_loc_lookup']
OVERALL_MEDIAN = META['overall_median']


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


@app.route('/api/meta')
def meta():
    return jsonify({
        'companies':   META['companies'],
        'departments': [c.replace('dept_', '') for c in DEPT_COLS],
        'ptypes':      [c.replace('ptype_', '') for c in PTYPE_COLS],
        'locations':   [c.replace('loc_', '')  for c in LOC_COLS],
        'results':     META['results'],
        'feature_importance': META['feature_importance'][:10],
        'ptype_loc_lookup':   PTYPE_LOC,
        'overall_median':     OVERALL_MEDIAN,
    })


@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()

    company  = data.get('company', '')
    dept     = data.get('department', '')
    ptype    = data.get('project_type', '')
    location = data.get('city', '')
    age      = float(data.get('project_age', 8))
    exp      = float(data.get('experience_rating', 3.0))
    pay_ratio = float(data.get('payment_ratio', 0.5))
    dept_active = int(data.get('dept_active', 1))

    # Similar project cost from lookup
    sim_cost = PTYPE_LOC.get(ptype, {}).get(location, OVERALL_MEDIAN)

    log_ab = np.log(sim_cost / max(age, 1))

    row = {col: 0.0 for col in FEATURE_COLS}
    row['ExperienceRating']  = exp
    row['projAgeYrs']        = age
    row['logAnnualBudget']   = log_ab
    row['paymentRatio']      = pay_ratio
    row['deptActive']        = dept_active
    row['statusProjEnc']     = 3
    row['CompanyEncoded']    = float(COMPANY_MAP.get(company, 0))
    row['SimilarProjectCost'] = sim_cost

    dept_key = f'dept_{dept}'
    if dept_key in row:
        row[dept_key] = 1.0

    ptype_key = f'ptype_{ptype}'
    if ptype_key in row:
        row[ptype_key] = 1.0

    loc_key = f'loc_{location}'
    if loc_key in row:
        row[loc_key] = 1.0

    X = np.array([[row[c] for c in FEATURE_COLS]])
    prediction = float(MODEL.predict(X)[0])

    # Confidence interval: ±22% based on model MAPE
    low  = round(prediction * 0.78, 2)
    high = round(prediction * 1.22, 2)
    pred = round(prediction, 2)

    return jsonify({
        'prediction': pred,
        'low':  low,
        'high': high,
        'similar_project_cost': round(sim_cost, 2),
        'currency': 'PKR Million'
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
