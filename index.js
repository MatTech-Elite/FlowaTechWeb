const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const routes = require('./routes/requests');
//const express = require('express')
const app = express()


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use('/', routes);


const port = 3000

/*GET Home Login page*/
app.get("/", async (req, res) => {
  if (req.cookies.authentication && req.cookies.username) {
    const response = await fetch(`https://flowatechapi.azurewebsites.net/api/Supplier?token=${req.cookies.authentication}`, {method: "GET"})
    if (!response.ok) {
      if (response.status === 400) {
        res.clearCookie('username');
        res.clearCookie("authentication");
        res.render("login", {title: "Login"});
      }
    } else {
      res.redirect("/dashboard");
    }
  } else {
    res.render("login", {title: "Login"});
  }
});


//DASHBOARD PAGE
app.get("/dashboard", async(req, res) => {
  res.render("dashboard", {title: "Dashboard", tabInfo: 'dashboard'});
});


/*Order Details page*/
app.get("/order_details", async(req, res) => {
  let orderNum = req.query.orderNumber;
  console.log(orderNum);
  res.render("order_details", {title: "Order Details", tabInfo: "OrderDetails", orderNum});
});


/*Profile NAD sETTINGS */
app.get("/profile", async(req, res) => {
  res.render("profile", {title: "Profile", tabInfo: "profile"});
});

/*Supplier Rules Page*/
app.get("/profile/rules", async(req, res) => {
  res.render("rules", {title: "Profile/Rules"});
});


// catch 404 and forward to error handler
app.use( (req, res, next) => {
  //next(createError(404));
  res.status(404).render('404', {title: "404"});
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.msg);
  //res.render('error');
});


app.listen(port, () => {
  console.log(`FlowaTech Website listening on port ${port}`)
})

module.exports = app;