"use strict"

//form inputs
let emailInput = document.getElementById("inputEmail");
let passInput = document.getElementById("passInput");

let formError = document.getElementById("formHelp");
let passShow = document.querySelector(".passShow");

//Login butt
let logInBut = document.getElementById("logIn");


function togglePasswordVisibility() {
    if (passInput.type === "password") {
        passInput.type = "text";
    } else {
        passInput.type = "password";
    }
};
    passShow.addEventListener("click", () => {
        togglePasswordVisibility();
    });


//LOGIN FUNCTION
logInBut.addEventListener("click", async(e) => {
    var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    e.preventDefault();
    if (emailInput.value && passInput.value ) {
        if (re.test(emailInput.value)) {
            $("#logIn").prop('disabled', true);
            loadingElm(true)
            var options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                  },
                body:  JSON.stringify({
                    "email": emailInput.value,
                    "password": passInput.value
                })
            }
            let response = await fetch("/login/api", options)
            if(!response.ok) {
                if(response.status === 401) {
                    let data = await response.json();
                    console.log(data);
                    loadingElm(false);
                    $("#logIn").prop('disabled', false);
                    toastElement('#formHelp', data.error);
                } else {
                    let data = await response.json();
                    console.log(data);
                    loadingElm(false);
                    $("#logIn").prop('disabled', false);
                    toastElement('#formHelp', data.error);
                }
            } else {
                if(response.status === 200) {
                    loadingElm(false);
                    window.location = response.url;
                } else {
                    console.log("status code is not 200");
                }
            }
        } else {
            toastElement("#formHelp", "Please enter valid Email Address");
        }
    } else {
        toastElement("#formHelp", "Error: Please enter Email & Password");
        //formError.style = "display: block";
    }
});
