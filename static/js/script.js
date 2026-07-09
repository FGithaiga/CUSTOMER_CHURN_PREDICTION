document.addEventListener("DOMContentLoaded", function(){



    const form = document.getElementById("predictionForm");

    const resultDiv = document.getElementById("result");

    const loading = document.getElementById("loading");





    // ===============================
    // AUTOMATIC TOTAL CHARGES
    // ===============================


    const tenureInput =
    document.getElementById("tenure");


    const monthlyInput =
    document.getElementById("MonthlyCharges");


    const totalInput =
    document.getElementById("TotalCharges");





    function calculateTotalCharges(){


        const tenure =
        Number(tenureInput.value);


        const monthly =
        Number(monthlyInput.value);




        if(
            tenure > 0 &&
            monthly > 0
        ){


            totalInput.value =
            (tenure * monthly).toFixed(2);


        }
        else{


            totalInput.value = "";

        }


    }




    tenureInput.addEventListener(
        "input",
        calculateTotalCharges
    );



    monthlyInput.addEventListener(
        "input",
        calculateTotalCharges
    );







    // ===============================
    // PREDICTION
    // ===============================



    form.addEventListener(
    "submit",
    async function(e){



        e.preventDefault();



        loading.style.display="block";


        resultDiv.style.display="none";




        const data = {



            gender:
            document.getElementById("gender").value,



            SeniorCitizen:
            Number(
            document.getElementById("SeniorCitizen").value
            ),



            Partner:
            document.getElementById("Partner").value,



            Dependents:
            document.getElementById("Dependents").value,



            tenure:
            Number(
            document.getElementById("tenure").value
            ),



            PhoneService:
            document.getElementById("PhoneService").value,



            MultipleLines:
            document.getElementById("MultipleLines").value,



            InternetService:
            document.getElementById("InternetService").value,



            OnlineSecurity:
            document.getElementById("OnlineSecurity").value,



            OnlineBackup:
            document.getElementById("OnlineBackup").value,



            DeviceProtection:
            document.getElementById("DeviceProtection").value,



            TechSupport:
            document.getElementById("TechSupport").value,



            StreamingTV:
            document.getElementById("StreamingTV").value,



            StreamingMovies:
            document.getElementById("StreamingMovies").value,



            Contract:
            document.getElementById("Contract").value,



            PaperlessBilling:
            document.getElementById("PaperlessBilling").value,



            PaymentMethod:
            document.getElementById("PaymentMethod").value,



            MonthlyCharges:
            Number(
            document.getElementById("MonthlyCharges").value
            ),



            TotalCharges:
            Number(
            document.getElementById("TotalCharges").value
            )


        };







        try{



            const response =
            await fetch("/predict",{


                method:"POST",



                headers:{


                    "Content-Type":
                    "application/json"


                },



                body:
                JSON.stringify(data)


            });







            const result =
            await response.json();




            loading.style.display="none";


            resultDiv.style.display="block";







            if(result.error){



                resultDiv.className =
                "result error";



                resultDiv.innerHTML = `



                <h2>

                <i class="fa-solid fa-circle-exclamation"></i>

                Error

                </h2>



                <p>

                ${result.error}

                </p>


                `;



                return;


            }







            const prediction =
            Number(result.prediction);



            const churnProbability =
            Number(result.probability * 100)
            .toFixed(2);









            if(prediction === 1){





                resultDiv.className =
                "result danger";





                resultDiv.innerHTML = `



                <h2>

                <i class="fa-solid fa-triangle-exclamation"></i>

                Customer Will Churn

                </h2>




                <p>

                <strong>
                Churn Probability:
                </strong>

                ${churnProbability}%

                </p>





                <p>

                Retention action is recommended.

                </p>





                <div class="progress">


                    <div class="progress-bar"

                    style="width:${churnProbability}%">

                    </div>


                </div>




                `;




            }







            else{





                const stayProbability =

                (100 - churnProbability)
                .toFixed(2);







                resultDiv.className =
                "result success";







                resultDiv.innerHTML = `



                <h2>


                <i class="fa-solid fa-circle-check"></i>


                Customer Will Stay


                </h2>






                <p>


                <strong>
                Confidence:
                </strong>


                ${stayProbability}%


                </p>






                <p>

                Customer has a low churn risk.

                </p>






                <div class="progress">


                    <div class="progress-bar"

                    style="width:${stayProbability}%">

                    </div>



                </div>





                `;




            }





        }






        catch(error){





            loading.style.display="none";


            resultDiv.style.display="block";



            resultDiv.className =
            "result error";





            resultDiv.innerHTML = `




            <h2>


            <i class="fa-solid fa-server"></i>


            Server Error


            </h2>





            <p>

            ${error.message}

            </p>



            `;




        }





    });









    // ===============================
    // RESET
    // ===============================



    form.addEventListener(
    "reset",
    function(){



        resultDiv.style.display="none";


        loading.style.display="none";


        totalInput.value="";



    });





});