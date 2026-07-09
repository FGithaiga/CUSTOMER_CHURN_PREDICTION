from flask import Flask, render_template, request, jsonify
import pandas as pd
import joblib
import os


app = Flask(__name__)


# ==============================
# Load Machine Learning Pipeline
# ==============================

MODEL_PATH = "churn_pipeline.pkl"

try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully")

except Exception as e:
    print("❌ Model loading failed:", e)
    model = None



# ==============================
# Home Page
# ==============================

@app.route("/")
def home():

    return render_template("index.html")



# ==============================
# Prediction API
# ==============================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        if model is None:
            return jsonify({
                "error": "Machine learning model could not be loaded"
            })


        # Receive data from JavaScript
        data = request.get_json()


        # Convert to dataframe
        input_data = pd.DataFrame([data])


        # Expected model features
        expected_features = [

            "gender",
            "SeniorCitizen",
            "Partner",
            "Dependents",
            "tenure",
            "PhoneService",
            "MultipleLines",
            "InternetService",
            "OnlineSecurity",
            "OnlineBackup",
            "DeviceProtection",
            "TechSupport",
            "StreamingTV",
            "StreamingMovies",
            "Contract",
            "PaperlessBilling",
            "PaymentMethod",
            "MonthlyCharges",
            "TotalCharges"

        ]


        # Ensure correct feature order
        input_data = input_data[expected_features]



        # Convert numerical columns
        input_data["SeniorCitizen"] = input_data["SeniorCitizen"].astype(int)

        input_data["tenure"] = input_data["tenure"].astype(int)

        input_data["MonthlyCharges"] = input_data["MonthlyCharges"].astype(float)

        input_data["TotalCharges"] = input_data["TotalCharges"].astype(float)



        # Prediction
        prediction = model.predict(input_data)[0]


        # Probability
        probability = model.predict_proba(input_data)[0][1]



        print("==============================")
        print("Prediction Input:")
        print(input_data)
        print("Prediction:", prediction)
        print("Probability:", probability)
        print("==============================")



        return jsonify({

            "prediction": int(prediction),

            "probability": float(probability)

        })



    except Exception as e:

        print("Prediction Error:", e)


        return jsonify({

            "error": str(e)

        })



# ==============================
# Railway Deployment Configuration
# ==============================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=int(os.environ.get("PORT", 5000)),

        debug=False

    )