"use-strict"

function switchTabBoard(data) {
    let tab1 = document.getElementById("tab_dashboard");
    let tab2 = document.getElementById("tab_profile");
    let tab4 = document.getElementById("tab_customers");
    switch (data) {
        case "dashboard":
            tab1.classList.remove("text-white");
            tab1.classList.add("text-secondary");
            break;
        case "customers":
            tab4.classList.remove("text-white");
            tab4.classList.add("text-secondary");
            break;
        case "profile":
            tab2.classList.remove("text-white");
            tab2.classList.add("text-secondary");
            break;
    }
}


//TIME FUNCTION
let timeFunc = function(timeData) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let mydate = new Date(timeData);
    let year = mydate.getFullYear();
    let month = months[mydate.getMonth()];
    let fullTime = year+" "+month;
    return fullTime;
}


//GET COOKIE VALUE
function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        let [name, value] = cookie.split('=');
        if (name === cookieName) {
            return value;
        }
    }
    return null;
}


//Fade in and out elements
function toastElement(element, value) {
    $(element).html(value);
    $(element).fadeIn("slow", "swing");
    setTimeout(() => {
        $(element).fadeOut("slow", "swing");
    }, 5000);
}



//LOADING ELEMENT
function loadingElm(display=false) {
    if (display) {
        const img = document.createElement('img');
        img.src = 'style/progress.gif';
        img.id = "loading_img"
        document.body.appendChild(img);
    } else {
        const imgToDelete = document.getElementById('loading_img');
        if (imgToDelete) {
            imgToDelete.remove();
        } else {
            console.log("Image with ID 'myImage' not found");
        }
    }
}



//SEARCH FUNCTION
function searchFunc(searchTop, listElementsClass) {
    var trElements = document.getElementsByClassName(listElementsClass);
    var searching = "#"+searchTop;
    $(searching).on("input", (e) => {
        var input_value = $(searching).val().toLowerCase();;
        if (input_value.length > 2) {
            //alert(ulElement.getElementsByTagName("tr").length);
            //alert(trElements.length);
            for (let i = 0; i < trElements.length; i++) {
                var elementValue = trElements[i].textContent.toLowerCase();
                if (elementValue.includes(input_value)) {
                    trElements[i].style ="display: table-row";
                } else {
                    trElements[i].style ="display: none";
                }
            }
        } else {
            for (let i = 0; i < trElements.length; i++) {
                //alert(trElements[i].textContent);
                trElements[i].style ="display: table-row";
            }
        }
    })
}


//CONFIRM DIALOG BOX
function confirmBox(title="", body="", okBut="Save", closeBut="Cancel", callback, arguments="") {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = 'staticModel';
    modalDiv.setAttribute('data-bs-backdrop', 'static');
    modalDiv.setAttribute('data-bs-keyboard', 'false');
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('aria-labelledby', 'staticBackdropLabel');
    modalDiv.setAttribute('aria-model', 'true');
    modalDiv.setAttribute('style', 'display: block');
    modalDiv.setAttribute('role', 'dialog');
    modalDiv.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">${title}</h1>
            <button type="button" id="closeBut" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            ${body}
        </div>
        <div class="modal-footer">
            <button type="button" id="closeBut" class="btn btn-secondary" data-bs-dismiss="modal">${closeBut}</button>
            <button type="button" id="okBut" class="btn btn-primary">${okBut}</button>
        </div>
        </div>
    </div>`;
    document.body.appendChild(modalDiv);
    const modalDiv2 = document.createElement('div');
    modalDiv2.className = 'modal-backdrop fade show';
    modalDiv2.id = 'modelBackground';
    document.body.appendChild(modalDiv2);
    //document.getElementById("staticModel").classList.remove("fade");
    document.getElementById("staticModel").classList.add("show");
    document.getElementsByTagName("body")[0].setAttribute('style', 'overflow: hidden; padding-right: 0px;');
    document.getElementsByTagName("body")[0].setAttribute("class", "model-open");

    //buttons and elemensts to press or hide
    let background = document.getElementById("modelBackground");
    let modelFace = document.getElementById("staticModel");
    modelFace.addEventListener("click", (e) => {
        switch (e.target.id) {
            case "closeBut":
                $("#staticModel").remove();
                $("#modelBackground").remove();
                document.getElementsByTagName("body")[0].setAttribute('style', '');
                document.getElementsByTagName("body")[0].setAttribute("class", "");
                break;
            case "okBut":
                callback(arguments);
                $("#staticModel").remove();
                $("#modelBackground").remove();
                document.getElementsByTagName("body")[0].setAttribute('style', '');
                document.getElementsByTagName("body")[0].setAttribute("class", "");
                break
        }
    });
}