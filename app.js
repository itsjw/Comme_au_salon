var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var fs=require('fs');

var app = express();

/*chargement configuration JSON des actions --> controleurs */
GLOBAL.dynRoutes = JSON.parse(fs.readFileSync("./routes/dynRoutes.json", 'utf8'));

hbs.registerPartials(__dirname + '/views/partials', function() {
    console.log('partials registered')
});

/*ajout comparaison*/
hbs.registerHelper('compare', function (lvalue, rvalue, options) {
   // console.log("####### COMPARE lvalue: ",lvalue," et rvalue: ", rvalue);
    if (arguments.length < 3)
        throw new Error ("Handlebars Helper 'compare' needs 2 parameters");
    var operator = options.hash.operator || "==";
    var operators = {
        '==': function (l,r) {
            return l == r;
        },
        'isEmptyTab': function(obj) {
            return (!obj || obj.length ==0);
        } 
    }
if (!operators[operator])
    throw new Error("'compare' doesn't know the operator " + operator);
var result = operators[operator](lvalue, rvalue);
if (result) {
    return options.fn(this);
} else {
    return options.inverse(this);
       } 
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// gestion dynamique des routes
require('./dynRouter')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
