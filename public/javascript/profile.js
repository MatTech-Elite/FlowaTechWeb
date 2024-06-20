"use strict"
switchTabBoard("profile");


window.onload= async function(e) {
    document.getElementById("search_top").style="display: none";
    const localData = await fetch(`/show/profile`, {method: "GET"});
    if(!localData.ok) {
        if (localData.status === 400) {
            let data = await localData.json();
            console.log(data);
        } else if (localData.status === 401){
            let data = await localData.json();
            window.location = data.url;
        }
    } else {
        if(localData.status === 200) {
            let data = await localData.json();
            $('.supplierName').html(data[0].supplierName);
            $('.supplierId').html(data[0].supplierId);
            $('.supplierEmail').html(data[0].emailAddress);
            console.log(data);
        }
    }

    const rulesData = await fetch(`/rules/show`, {method: "GET"});
    if(!rulesData.ok) {
        if (rulesData.status === 400) {
            let dataRules = await rulesData.json();
            console.log(dataRules);
        } else if (rulesData.status === 401){
            let dataRules = await rulesData.json();
            window.location = dataRules.url;
        }
    } else {
        if(rulesData.status === 200) {
            let dataRules = await rulesData.json();
            $('#supplierRulesCount').html(dataRules.length);
        }
    }

    const ordersData = await fetch(`/dashboard/orders`, {method: "GET"});
    if(!ordersData.ok) {
        if (ordersData.status === 400) {
            let dataOrders = await ordersData.json();
            console.log(dataOrders);
        } else if (ordersData.status === 200){
            let dataOrders = await ordersData.json();
            window.location = dataOrders.url;
        }
    } else {
        if(ordersData.status === 203) {
            let dataOrders = await ordersData.json();
            $('#supplierOrdersCount').html(dataOrders.length);
        }
    }

    $(document).on("click", (e) => eventSwitch(e));
}


async function eventSwitch (e) {
    switch (e.target.id) {
    case "ordersBut":
        window.location = "/dashboard";
        break;
    case "rulesBut":
        window.location.replace("/profile/rules");// = "/profile/rules";
        break
    case "profileEditBut":
        window.location = "/profile/edit";
        break
    case "saveNewPass":
        if ($("#email").val() && $("#old-password").val() && $("#new-password").val() && $("#new-password-confirm").val()) {
            if (document.getElementById("new-password").value === document.getElementById("new-password-confirm").value) {
                $("#saveNewPass").prop('disabled', true);
                $("#closeBut").prop('disabled', true);
                $("#topCloseBut").prop('disabled', true);
                $("#saveNewPass").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');

                let options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        email: $("#email").val(),
                        oldPassword: $("#old-password").val(),
                        newPassword: $("#new-password").val()
                      })
                }
                const passResponse = await fetch("/password/change", options);
                if (!passResponse.ok) {
                    if (passResponse.status === 400) {
                        const data = await passResponse.json();
                        console.log(data);
                        $("#saveNewPass").prop('disabled', false);
                        $("#closeBut").prop('disabled', false);
                        $("#topCloseBut").prop('disabled', false);
                        $("#saveNewPass").html('Save');
                        toastElement("#formHelp", data);
                    }
                  } else {
                    const data = await passResponse.json();
                    console.log(data);
                    $("#saveNewPass").prop('disabled', false);
                    $("#closeBut").prop('disabled', false);
                    $("#topCloseBut").prop('disabled', false);
                    $("#saveNewPass").html('Save');
                    $("#closeBut").click();
                    $("header").append('<div id="changePasswordAlert" class="position-relative"><div class="alert alert-success alert-dismissible fade show position-absolute top-0 start-50 translate-middle-x w-50" role="alert"><strong>Password successfuly changed!</strong><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div>')
                    setTimeout(() => {
                        $("#changePasswordAlert").remove();
                    }, 4000);
                  }
            } else {
                toastElement("#formHelp", "Passwords does not match, Please confirm correct Password")
            }
        } else {
            toastElement("#formHelp", "Please fill out all Details");
        }
        break
    case "closeBut":
        $("#email").val("");
        $("#old-password").val("");
        $("#new-password").val("");
        $("#new-password-confirm").val("");
        $("#formHelp").hide();
        break
    case "topCloseBut":
        $("#email").val("");
        $("#old-password").val("");
        $("#new-password").val("");
        $("#new-password-confirm").val("");
        $("#formHelp").hide();
        break
    default:
        break;
    }
}
