"use-strict"

// let signOutBut = document.getElementById("signOutBut");
// signOutBut.addEventListener("click", (e) => {
//     // window.location ="/";
//     fetch("/logout", {method: "POST"})
//     // $.ajax({
//     //     url: '/logout', method: 'POST',
//     //     success: function(response) {
//     //         if (response.status === 302) {
//     //             console.log("done")
//     //             // window.location = response.redirect;
//     //             // window.location.href = "/dashboard";
//     //         }
//     //     },
//     //     error: function(xhr, status, error) {
//     //         console.log(error+": "+ status)
//     //         alert("not good");
//     //     }
//     //     });
// });

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
// const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
// const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))