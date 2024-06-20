"use strict"

window.onload= async function(e) {
    document.getElementById("search_top").style="display: none";
    const localData = await fetch(`/rules/show`, {method: "GET"});
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
            console.log(data);
            ruleLoader(data);
        }
    }
    $(document).on("click", (e) => eventSwitch(e));
}




//loading in rules page load/after rule change
function ruleLoader(rules=[]) {
    if (rules.length == 0) {
        $("#ruleButtons").hide();
        $("#rulesDisplay").hide();
        $("#rulesListBody").append("<div id='noRuleLabel'>No Rules</div>");
    } else {
        if ($("#noRuleLabel").length) {
            $("#ruleButtons").show();
            $("#rulesDisplay").show();
            $("#noRuleLabel").remove();
        }
    }
    document.getElementById("supplierOrdersCount").innerHTML=rules.length;
    const list = document.querySelector('.rulesList');
    const infoList = document.querySelector(".rulesInfoList");
    list.innerHTML="";
    infoList.innerHTML="";

    for (let i = 0; i < rules.length; i++) {
        const tabName = rules[i];
        const tabItem = document.createElement('a');
        tabItem.setAttribute('id', `${tabName.supplierIssueId}`); //list-${tabName.issueName}-list
        tabItem.setAttribute('class', 'list-group-item list-group-item-action ruleItem');
        tabItem.setAttribute('data-bs-toggle', 'list');
        tabItem.setAttribute('href', `#list-${tabName.supplierIssueId}`);
        tabItem.setAttribute('role', 'tab');
        tabItem.setAttribute('aria-controls', `list-${tabName.issueName}`);
        tabItem.textContent = i+1+". "+tabName.issueName;
        if (i === 0) {
            tabItem.classList.add("active");
        }
        list.appendChild(tabItem);

        const tabInfoItem = document.createElement('div');
        tabInfoItem.setAttribute('id', `list-${tabName.supplierIssueId}`);
        tabInfoItem.setAttribute('class', 'tab-pane fade');
        tabInfoItem.setAttribute('role', 'tabpanel');
        tabInfoItem.setAttribute('aria-labelledby', `${tabName.supplierIssueId}`);
        tabInfoItem.textContent = tabName.proofName;
        if (i === 0) {
            tabInfoItem.classList.add("show");
            tabInfoItem.classList.add("active");
        }
        infoList.appendChild(tabInfoItem);
    }
}


async function ruleDelete(ruleSelect) {
    const response = await fetch(`/rule/delete?rule=${ruleSelect}`, {method: "DELETE"});
    if (!response.ok) {
        if (response.status === 400) {
            const data = await response.json();
            console.log(data);
            $("header").append(`<div id="AddedRuleAlert" class="position-relative"><div class="alert alert-danger alert-dismissible fade show position-absolute top-0 start-50 translate-middle-x w-50" role="alert"><strong>Error Deleting Rule!</strong> ${data}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div>`)
            setTimeout(() => {
                $("#AddedRuleAlert").remove();
            }, 4000);
        }
    } else {
        const data = await response.json();
        console.log(data);
        $("header").append(`<div id="changePasswordAlert" class="position-relative"><div class="alert alert-success alert-dismissible fade show position-absolute top-0 start-50 translate-middle-x w-50" role="alert"><strong>${data.data}</strong><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div>`)
        setTimeout(() => {
            $("#changePasswordAlert").remove();
        }, 2000);
        // location.reload();
        const localData = await fetch(`/rules/show`, {method: "GET"});
        if(!localData.ok) {
            if (localData.status === 400) {
                let data1 = await localData.json();
                console.log(data1);
            } else if (localData.status === 401){
                let data1 = await localData.json();
                window.location = data1.url;
            }
        } else {
            if(localData.status === 200) {
                let data1 = await localData.json();
                console.log(data1);
                ruleLoader(data1);
            }
        }
    }
}


async function eventSwitch(e) {
    switch (e.target.id) {
        case "editRule":
            $("#modelEditRuleLabel").html("Edit Rule: "+document.getElementById(document.querySelector(".ruleItem.active").id).textContent.substring(0, 3));
            $("#rule-name-edit").val(document.getElementById(document.querySelector(".ruleItem.active").id).textContent.substring(3));
            $("#rule-proof-edit").val(document.getElementById(document.querySelector(".tab-pane.fade.active.show").id).textContent);
            break
        case "deleteRule":
            let rule = document.querySelector(".ruleItem.active").id
            confirmBox("Deleting Rule",`Are yuo sure you want to delete this rule? <strong>${document.getElementById(rule).textContent.substring(3)}</strong>`, "Delete", "Cancel", ruleDelete, rule);
            break
        case "saveNewRule":
            if ($("#rule-name").val() && $("#rule-proof").val()) {
                if (document.getElementById("rule-name").value.length <= 50 && document.getElementById("rule-proof").value.length <= 50) {
                    $("#saveNewRule").prop('disabled', true);
                    $("#closeBut").prop('disabled', true);
                    $("#topCloseBut").prop('disabled', true);
                    $("#saveNewRule").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
    
                    let options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify({
                            ruleName: $("#rule-name").val(),
                            ruleProof: $("#rule-proof").val()
                          })
                    }
                    const ruleResponse = await fetch("/rules/new/rule", options);
                    if (!ruleResponse.ok) {
                        if (ruleResponse.status === 400) {
                            const data = await ruleResponse.json();
                            console.log(data);
                            $("#saveNewRule").prop('disabled', false);
                            $("#closeBut").prop('disabled', false);
                            $("#topCloseBut").prop('disabled', false);
                            $("#saveNewRule").html('Save');
                            toastElement("#formHelp", data);
                        }
                      } else {
                        const data = await ruleResponse.json();
                        console.log(data);
                        $("#saveNewRule").prop('disabled', false);
                        $("#closeBut").prop('disabled', false);
                        $("#topCloseBut").prop('disabled', false);
                        $("#saveNewRule").html('Save');
                        $("#closeBut").click();
                        $("header").append('<div id="rulesAlert" class="position-relative"><div class="alert alert-success alert-dismissible fade show position-absolute top-0 start-50 translate-middle-x w-50" role="alert"><strong>Successfuly created new rule!</strong><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div>')
                        setTimeout(() => {
                            $("#rulesAlert").remove();
                        }, 4000);

                        const localData = await fetch(`/rules/show`, {method: "GET"});
                        if(!localData.ok) {
                            if (localData.status === 400) {
                                let data1 = await localData.json();
                                console.log(data1);
                            } else if (localData.status === 401){
                                let data1 = await localData.json();
                                window.location = data1.url;
                            }
                        } else {
                            if(localData.status === 200) {
                                let data1 = await localData.json();
                                console.log(data1);
                                ruleLoader(data1);
                            }
                        }
                      }
                } else {
                    toastElement("#formHelp", "Rule name or Proof name too long, MAX Length is 50 Charactors");
                }
            } else {
                toastElement("#formHelp", "Please fill out all Details");
            }
            break;
        case "closeBut":
        case "topCloseBut":
            $("#rule-name").val("");
            $("#rule-proof").val("");
            $("#formHelp").hide();
            break
        case "closeButEdit":
        case "topCloseButEdit":
            $("#formHelpEdit").hide();
            break
        case "saveEditRule":
            if ($("#rule-name-edit").val() && $("#rule-proof-edit").val()) {
                if (document.getElementById("rule-name-edit").value.length <= 50 && document.getElementById("rule-proof-edit").value.length <= 50) {
                    $("#saveEditRule").prop('disabled', true);
                    $("#closeButEdit").prop('disabled', true);
                    $("#topCloseButEdit").prop('disabled', true);
                    $("#saveEditRule").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
    
                    let options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify({
                            ruleId: document.querySelector(".ruleItem.active").id,
                            ruleName: $("#rule-name-edit").val(),
                            ruleProof: $("#rule-proof-edit").val()
                          })
                    }
                    const ruleResponse = await fetch("/rules/new/rule", options);
                    if (!ruleResponse.ok) {
                        if (ruleResponse.status === 400) {
                            const data = await ruleResponse.json();
                            console.log(data);
                            $("#saveEditRule").prop('disabled', false);
                            $("#closeButEdit").prop('disabled', false);
                            $("#topCloseButEdit").prop('disabled', false);
                            $("#saveEditRule").html('Save');
                            toastElement("#formHelpEdit", data);
                        }
                      } else {
                        const data = await ruleResponse.json();
                        console.log(data);
                        $("#saveEditRule").prop('disabled', false);
                        $("#closeButEdit").prop('disabled', false);
                        $("#topCloseButEdit").prop('disabled', false);
                        $("#saveEditRule").html('Save');
                        $("#closeButEdit").click();
                        $("header").append('<div id="rulesAlert" class="position-relative"><div class="alert alert-success alert-dismissible fade show position-absolute top-0 start-50 translate-middle-x w-50" role="alert"><strong>Successfuly Updated rule!</strong><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div>')
                        setTimeout(() => {
                            $("#rulesAlert").remove();
                        }, 4000);

                        const localData = await fetch(`/rules/show`, {method: "GET"});
                        if(!localData.ok) {
                            if (localData.status === 400) {
                                let data1 = await localData.json();
                                console.log(data1);
                            } else if (localData.status === 401){
                                let data1 = await localData.json();
                                window.location = data1.url;
                            }
                        } else {
                            if(localData.status === 200) {
                                let data1 = await localData.json();
                                console.log(data1);
                                ruleLoader(data1);
                            }
                        }
                      }
                } else {
                    toastElement("#formHelpEdit", "Rule name or Proof name too long, MAX Length is 50 Charactors");
                }
            } else {
                toastElement("#formHelpEdit", "Please fill out all Details");
            }
            break
        default:
            break;
    }
}