"use strict"

let ulElement = document.getElementById("item_table_element");

//Show Order items
function loadAllItems(values) {
    for(var i = ulElement.rows.length; i > 0;i--){
        ulElement.deleteRow(i -1);
    }
    for (let i = 0; i < values.length; i++) {
        var coloritem = "";
        var itemIssue ="";
        if (!values[i].itemDelivered) {
            itemIssue = "Not Yet Reviewd";
            coloritem = "text-info fw-bold";
        }
        var liElement = `<tr class="item_element" id=${values[i].itemCode}>
        <th scope="row" class="list_item">${values[i].itemDesc}</th>
        <td>${values[i].itemCode}</td>
        <td>${values[i].itemQty}</td>
        <td>${values[i].unitOfMeasure}</td>
        <td>&pound;${values[i].price}</td>
        <td>${values[i].disc}</td>
        <td>${values[i].vat ? 'Yes' : 'No'}</td>
        <td>&pound;${values[i].amount}</td>
        <td>${values[i].itemDelivered ? 'Yes' : 'No'}</td>
        <td class="${coloritem}">${itemIssue}</td>
      </tr>`;
        ulElement.insertAdjacentHTML('beforeend', liElement);
    }};



// //FETCH ALL ORDER ITEMS AND DISPLAY IT ON THE DASHBOARD PAGE
// const options = {
//     method: "GET"
//   }
// let localData = fetch("/order_details/show?orderNumber="+window.passedValue, options)
// .then(res => res.json())
// .then(data => {loadAllItems(data)})
// .catch(error => alert(error))
//FETCH ALL ORDER ITEMS AND DISPLAY IT ON THE DASHBOARD PAGE
var options = {
    method: "GET"
    }
let localData = fetch("/order_details/show?orderNumber="+window.passedValue, options)
.then(function(dataCheck) {
    if (dataCheck.status === 200) {
        //dataCheck = dataCheck.json();
        console.log(dataCheck);
        window.location = dataCheck.url;
    } else {
        return dataCheck.json().then(jsonData => {
            console.log(jsonData);
            loadAllItems(jsonData);
        });
    }
})
.catch(error => alert(error))



//BACK BUTTON CLICK
$("#back_orders").click(() => {
    window.location.href="dashboard";
});


//SEARCH ITEMS IN THE SEARCH BOX
searchFunc("search_top", "item_element");