"use strict"
switchTabBoard("dashboard");

//orders table id
let ulElement = document.getElementById("orders_table_element");


//FETCH ALL ORDERS AND DISPLAY them ON THE DASHBOARD PAGE
var options = {
    method: "GET"
    }
// let cookieValue = getCookieValue("authentication");
// console.log(cookieValue)
// let localData = fetch(`https://flowatechapi.azurewebsites.net/api/SupplierOrder?token=${getCookieValue("authentication")}`, options)
let localData = fetch(`/dashboard/orders`, options)
// .then(res => res.json())
.then(function(dataCheck) {
    if (dataCheck.status === 200) {
        //dataCheck = dataCheck.json();
        console.log(dataCheck);
        window.location = dataCheck.url;
    } else {
        return dataCheck.json().then(jsonData => {
            console.log(jsonData);
            loadAllData(jsonData);
        });
    }
})
.catch(error => alert(error))


//DISPLAY ALL ORDERS ON THE DASHBOARD
function loadAllData(values) {
    for(var i = ulElement.rows.length; i > 0;i--){
        ulElement.deleteRow(i -1);
    }
    for (let i = 0; i < values.length; i++) {
        if (values[i].numberIssues > 0) {
            var issueElement = `<span class="badge text-bg-danger rounded-pill">${values[i].numberIssues}</span>`;
        } else {
            var coloritem = "";
            var itemIssue ="";
            if (!values[i].orderDelivered) {
                itemIssue = "Not Yet Reviewd";
                coloritem = "text-info fw-bold";
                var issueElement = `<span class="${coloritem}">${itemIssue}</span>`;
            } else {
                itemIssue = "No Issues";
                coloritem = "text-success fw-bold";
                var issueElement = `<span class="${coloritem}">${itemIssue}</span>`;
            }
        }
        var liElement = `<tr class="order_element" id=${values[i].orderNum}>
        <th scope="row" data-bs-toggle="tooltip" title="${values[i].orderNum}" id="order_num_list" class=${values[i].orderNum}>${values[i].orderNum}<button type="button" id="copy_order_num_${values[i].orderNum}" class="btn btn-outline-dark">Copy</button><br><small id="order_time">${timeFunc(values[i].invoiceDate)}</small></th>
        <td>${values[i].clientName}</td>
        <td>${values[i].orderDelivered ? 'Yes' : 'No'}</td>
        <td>${issueElement}</td>
      </tr>`;
        ulElement.insertAdjacentHTML('beforeend', liElement);
    }};



    //event listiners for order list
ulElement.addEventListener("click", async(e) => {
    switch (e.target.parentElement.tagName) {
        case "TR":
            console.log(e.target.parentElement.id);
            window.location.href = "order_details?orderNumber="+e.target.parentElement.id;
            break;
        case "TH":
            if(e.target.tagName==="BUTTON") {
                try {
                    await navigator.clipboard.writeText(e.target.parentElement.className);
                    document.getElementById("copy_order_num_"+e.target.parentElement.className).innerHTML ="Copied";
                    setTimeout(() => {
                        document.getElementById("copy_order_num_"+e.target.parentElement.className).innerHTML ="Copy";
                    }, 2000);
                } catch(error) {
                    console.log(error);
                }
                }
        default:
            break;
    }
});


//SEARCH ORDERS IN THE SEARCH BOX
searchFunc("search_top", "order_element");