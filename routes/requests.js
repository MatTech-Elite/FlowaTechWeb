//START OF THE OFICIAL WEBSITE
const express = require('express');
const fs = require("fs");
const router = express.Router();
const axios = require('axios');


const cookieParser = require('cookie-parser');
router.use(cookieParser());

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        // Forward error to the global error handler
        next(error);
      }
    }
  }



/* GET all orders on Deshboard page. */
router.get('/dashboard/orders', asyncHandler(async (req, res, next) => {
  const options = {
    method: "GET"
  }
  try {
      const response = await fetch("https://flowatechapi.azurewebsites.net/api/SupplierOrder?token="+req.cookies.authentication, options);
      //const response = await fetch("http://localhost:3000/database_files/orders.json", options);
      console.log(req.cookies.authentication);
      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json();
          console.log(data);
          return res.status(200).redirect("/");//status(400).json(data);
        } else {
          throw new Error('Request failed with status ' + response.status);
        }
      }
      const data = await response.json();
      console.log(data);
      //res.render("dashboard", {title: "Dashboard", tabInfo: 'dashboard', data});
      res.status(203).send(data);
  } catch (error) {
      console.error(error);
      //res.send(error);
      res.status(500).json({ error: 'Error fetching order data' });
  }
}
));


/*get oll Order Details on order_details page*/
router.get("/order_details/show", asyncHandler(async(req, res) => {
  let orderNumber = req.query.orderNumber;
  console.log(orderNumber);
  const options = {
    method: "GET"
  }
  try {
    const response = await fetch(`https://flowatechapi.azurewebsites.net/api/SupplierOrderItem/${orderNumber}?token=${req.cookies.authentication}`, options);
    if (!response.ok) {
      if (response.status === 400) {
        const data = await response.json();
        console.log(data);
        return res.status(200).redirect("/");//status(400).json(data);
      } else {
        throw new Error('Request failed with status ' + response.status);
      }
    }
    const data = await response.json();
    //res.render("order_details", {title: "Order Details", tabInfo: "OrderDetails", orderNum, data});
    res.status(203).send(data);
  } catch (error) {
    console.error(error);
    //res.send(error);
    res.status(500).json({ error: 'Error fetching API data' });
  }
}));


//GET SUPPLIERS PROFILE
router.get("/show/profile", asyncHandler(async(req, res) => {
  let cookie = req.cookies.authentication;
  if (cookie) {
    console.log(cookie);
    const response = await fetch(`https://flowatechapi.azurewebsites.net/api/Supplier?token=${cookie}`, {method: "GET"});
    if (!response.ok) {
      const supplierData = await response.json();
      console.log(supplierData);
      if (response.status === 400) {
        return res.status(401).json(supplierData).redirect("/");;
      } else {
        throw new Error('Request failed with status ' + response.status + ", " + supplierData[0].errorMessage);
      }
    }
    const supplierData = await response.json();
    console.log(supplierData);
    res.status(200).json(supplierData);
  } else {
    console.log("cook: "+cookie);
    res.status(401).json({data: "Not logged in", url: "/"});//.redirect("/");
  }
}));


//PASSWORD CHANGE
router.post("/password/change", asyncHandler(async(req, res) => {
  if (req.cookies.authentication) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cookieVal: req.cookies.authentication,
        emailAddress: req.body.email,
        passwordVal: req.body.oldPassword,
        newPassword: req.body.newPassword
      })
    }
    const response = await fetch(`https://flowatechapi.azurewebsites.net/api/LoginDetails/resetpassword`, options)
    if (!response.ok) {
      if (response.status === 400) {
        //res.render("login", {title: "Login"});
        const data = await response.json();
        res.status(400).json(data.errorMessage)
      }
    } else {
      const data = await response.json();
      res.clearCookie("authentication");
      res.cookie('authentication', data.token);
      res.status(200).json(data);
    }
  }
}));

//DISPLAY ALL RULES INFO ON THE RULES PAGE
router.get("/rules/show", asyncHandler(async(req, res) => {
  let cookie = req.cookies.authentication;
  if (cookie) {
    console.log(cookie);
    const response = await fetch(`https://flowatechapi.azurewebsites.net/api/SupplierIssue?token=${cookie}`, {method: "GET"});
    if (!response.ok) {
      const supplierData = await response.json();
      console.log(supplierData);
      if (response.status === 400) {
        return res.status(400).json(supplierData);
      } else {
        throw new Error('Request failed with status ' + response.status + ", " + supplierData[0].errorMessage);
      }
    }
    const supplierData = await response.json();
    console.log(supplierData);
    res.status(200).json(supplierData);
  } else {
    console.log("cook: "+cookie);
    res.status(401).json({data: "Not logged in", url: "/"});//.redirect("/");
  }
}))


//ADD NEW RULE ON RULES PAGE
router.post("/rules/new/rule", asyncHandler(async(req, res) => {
  dataToSend = {
    issueName: req.body.ruleName,
      proofName: req.body.ruleProof
  }
  if (req.body.ruleId) {
    dataToSend.supplierIssueId = req.body.ruleId
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dataToSend)
  }
  const response = await fetch(`https://flowatechapi.azurewebsites.net/api/SupplierIssue?token=${req.cookies.authentication}`, options)
  if (!response.ok) {
    if (response.status === 400) {
      //res.render("login", {title: "Login"});
      const data = await response.json();
      console.log(data);
      res.status(400).json(data.errorMessage);
    }
  } else {
    const data = await response.json();
    res.status(200).json(data);
  }
}));


//DELTE A RULE IN THE RULES PAGE
router.delete("/rule/delete", asyncHandler(async(req, res) => {
  if (req.cookies.authentication) {
    console.log(req.query.rule)
    const response = await fetch(`https://flowatechapi.azurewebsites.net//api/SupplierIssue?token=${req.cookies.authentication}&supplierissueid=${req.query.rule}`,  {method: "DELETE"})
    if (!response.ok) {
      if (response.status === 400) {
        //res.render("login", {title: "Login"});
        const data = await response.json();
        console.log(data)
        res.status(400).json(data.errorMessage)
      }
    } else {
      res.status(200).json({data: "Rule Deleted Successfully"});
    }
  }
}));

/*GET Customers List*/
router.get("/customers", asyncHandler(async (req, res) => {
    res.render("customers", {title: "Customers", tabInfo: 'customers'});
}));



// /* POST Login*/
// router.post("/login/api", asyncHandler(async (req, res) => {
//     login_details = req.body;
//     res.redirect("/dashboard", {details: login_details});
// }));


router.post('/login/api', asyncHandler(async (req, res) => {
  const {email , password} = req.body;
  console.log(email+" "+password);
  let options1 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      emailAddress: email,
      passwordVal: password
    })
  }
  try {
    const response = await fetch('https://flowatechapi.azurewebsites.net/api/logindetails', options1);
    if (!response.ok) {
      if (response.status === 401) {
        const data = await response.json();
        console.log(data);
        return res.status(401).json(data);
      } else {
        throw new Error('Request failed with status ' + response.status);
      }
    }
    const data = await response.json();
    console.log(data);

    const supplierResponse = await fetch(`https://flowatechapi.azurewebsites.net/api/Supplier?token=${data.token}`, { method: "GET" });
    if (!supplierResponse.ok) {
      const supplierData = await supplierResponse.json();
      console.log(supplierData);
      if (supplierResponse.status === 400) {
        return res.status(400).json(supplierData);
      } else {
        throw new Error('Request failed with status ' + supplierResponse.status + ", " + supplierData[0].errorMessage);
      }
    }

    const supplierData = await supplierResponse.json();
    console.log(supplierData);
    res.cookie('username', supplierData[0].supplierId);
    res.cookie('authentication', data.token);
    res.status(200).redirect("/dashboard");
  } catch (error) {
    console.error('Fetch error:', error);
    if (error instanceof Error && error.message.includes('status')) {
      const status = parseInt(error.message.match(/status (\d+)/)[1]);
      res.status(status).send({ error: error.message }).end();
    } else {
      res.status(500).send({ error: error.message }).end();
    }
  }
}));

router.post('/logout', async (req, res) => {
  res.clearCookie('username');
  res.clearCookie("authentication");
  res.redirect('/');
});

module.exports = router;
