from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the model and the specific column order used during training
try:
    model = joblib.load("cost_model.pkl")
    model_columns = joblib.load("model_columns.pkl")
except FileNotFoundError:
    print("Error: Model files not found. Please run train.py first.")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        # Convert incoming JSON to DataFrame
        input_df = pd.DataFrame([data])
        
        # 1. Convert categorical 'RoleDescription' to dummies
        if 'RoleDescription' in input_df.columns:
            input_df = pd.get_dummies(input_df, columns=['RoleDescription'])
        
        # 2. Align columns: Add missing dummy columns (as 0) and remove extra columns (like AmountPaid)
        input_df = input_df.reindex(columns=model_columns, fill_value=0)
        
        # 3. Predict
        prediction = model.predict(input_df)[0]
        
        return jsonify({
            "status": "success",
            "predicted_total_budget": round(float(prediction), 2)
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == "__main__":
    app.run(port=8000, debug=True)