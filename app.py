from flask import Flask, render_template, request, jsonify
import pandas as pd
import joblib


app = Flask(__name__)


# Load trained pipeline
model = joblib.load("churn_pipeline.pkl")



@app.route("/")
def home():

    return render_template("index.html")



@app.route("/predict", methods=["POST"])
def predict():

    try:

        # Get JSON data from frontend
        data = request.json


        # Convert JSON to DataFrame
        input_data = pd.DataFrame([data])



        # Ensure correct column order
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


        input_data = input_data[expected_features]



        # Prediction
        prediction = model.predict(input_data)[0]



        # Probability
        probability = model.predict_proba(input_data)[0][1]



        print("----------------------")
        print("Input Data:")
        print(input_data)

        print("Prediction:", prediction)
        print("Probability:", probability)
        print("----------------------")



        return jsonify({

            "prediction": int(prediction),

            "probability": float(probability)

        })



    except Exception as e:


        print("ERROR:", e)


        return jsonify({

            "error": str(e)

        })




if __name__ == "__main__":

    app.run(debug=True)