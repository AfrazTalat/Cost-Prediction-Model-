from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle, json, numpy as np, os

app = Flask(__name__)
CORS(app)

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, "best_model.pkl"), "rb") as f:
    model = pickle.load(f)
with open(os.path.join(BASE, "model_meta.json")) as f:
    meta = json.load(f)

FEATURE_COLS    = meta["feature_cols"]
COMPANY_MAP     = meta["company_map"]
DEPT_COLS       = meta["dept_cols"]
PTYPE_COLS      = meta["ptype_cols"]
LOC_COLS        = meta["loc_cols"]
PTYPE_LOC       = meta["ptype_loc_lookup"]
OVERALL_MEDIAN  = meta["overall_median"]


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        company   = data.get("company", "")
        dept      = data.get("department", "")
        ptype     = data.get("project_type", "")
        city      = data.get("city", "")
        age       = float(data.get("project_age", 8))
        exp       = float(data.get("experience_rating", 3.0))
        pay_ratio = float(data.get("payment_ratio", 0.5))

        # Similar project cost from lookup table
        sim_cost = PTYPE_LOC.get(ptype, {}).get(city, OVERALL_MEDIAN)
        log_ab   = float(np.log(sim_cost / max(age, 1)))

        # Build feature row
        row = {col: 0.0 for col in FEATURE_COLS}
        row["ExperienceRating"]   = exp
        row["projAgeYrs"]         = age
        row["logAnnualBudget"]    = log_ab
        row["paymentRatio"]       = pay_ratio
        row["deptActive"]         = 1.0
        row["statusProjEnc"]      = 3.0
        row["CompanyEncoded"]     = float(COMPANY_MAP.get(company, 0))
        row["SimilarProjectCost"] = sim_cost

        if f"dept_{dept}" in row:
            row[f"dept_{dept}"] = 1.0
        if f"ptype_{ptype}" in row:
            row[f"ptype_{ptype}"] = 1.0
        if f"loc_{city}" in row:
            row[f"loc_{city}"] = 1.0

        X = np.array([[row[c] for c in FEATURE_COLS]])
        prediction = float(model.predict(X)[0])

        return jsonify({
            "status":               "success",
            "prediction":           round(prediction, 2),
            "low":                  round(prediction * 0.78, 2),
            "high":                 round(prediction * 1.22, 2),
            "similar_project_cost": round(sim_cost, 2),
            "currency":             "PKR Million"
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(port=8000, debug=True)
