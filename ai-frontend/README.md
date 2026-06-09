# PakBuild — Project Cost Predictor

Predicts total project budget (PKR Million) for Pakistani public infrastructure projects using a trained Random Forest model (R² = 0.835).

## Project Structure

```
project/
├── app.py              # Flask backend API
├── requirements.txt
├── model/
│   ├── best_model.pkl  # Trained Random Forest model
│   └── meta.json       # Feature metadata & lookup tables
└── static/
    └── index.html      # Frontend UI
```

## Setup & Run

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the server
python app.py

# 3. Open browser
http://localhost:5000
```

## API Endpoints

### GET /api/meta
Returns dropdown options, model metrics, feature importance, and similar project cost lookup table.

### POST /api/predict
**Request body (JSON):**
```json
{
  "department":        "Infrastructure",
  "project_type":      "Road Construction",
  "city":              "Lahore",
  "company":           "Frontier Works Organization",
  "project_age":       8,
  "experience_rating": 3.5,
  "payment_ratio":     0.5,
  "dept_active":       1
}
```

**Response:**
```json
{
  "prediction": 2450.12,
  "low":        1911.09,
  "high":       2989.15,
  "similar_project_cost": 2206.81,
  "currency": "PKR Million"
}
```

## Model Details

- **Algorithm**: Random Forest (300 trees, max depth 12)
- **Training data**: 1,985 rows (485 original + 1,500 synthetic)
- **Features**: Project type, city, department, company, project age, experience rating, payment ratio, similar project cost
- **R²**: 0.835 | **MAE**: 419M PKR

## Companies (Tier Classification)

| Tier | Companies |
|------|-----------|
| Tier 1 (premium) | Frontier Works Organization, NLC, Nespak, China State Construction, FWO-CCECC JV |
| Tier 2 (mid) | Descon Engineering, Habib Construction, Izhar Construction, Saif Group, SMS Infrastructure, Giga Construction |
| Tier 3 | All others |
