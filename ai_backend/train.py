import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# 1. Load Data
df = pd.read_csv("dbproj_cleaned.csv")

# 2. Drop leaky columns (known only AFTER budget is set)
# Also drop weak/noise features confirmed by correlation analysis
leaky_cols = ['AmountPaid', 'BalanceAmount', 'paymentRatio',
              'ExperienceRating', 'projAgeYrs', 'logAnnualBudget',
              'deptActive', 'statusProjEnc']
df = df.drop(columns=leaky_cols)

# 3. One-hot encode RoleDescription
df = pd.get_dummies(df, columns=['RoleDescription'])

# 4. Define Features (X) and Target (y)
y = df['TotalBudget']
X = df.drop(columns=['TotalBudget'])

# 5. Split Data (80% Train, 20% Test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6. Train the Model
print("Training model using: project type, location, department, role...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 7. Evaluate
predictions = model.predict(X_test)
train_predictions = model.predict(X_train)
test_r2  = r2_score(y_test, predictions)
train_r2 = r2_score(y_train, train_predictions)
mae = mean_absolute_error(y_test, predictions)

print(f"Model Training Complete.")
print(f"Train R²: {train_r2:.4f}")
print(f"Test R²:  {test_r2:.4f}")
print(f"MAE:      PKR {mae:.2f}M")

# 8. Save model and column list
joblib.dump(model, "cost_model.pkl")
joblib.dump(list(X.columns), "model_columns.pkl")
print("Saved: cost_model.pkl, model_columns.pkl")
