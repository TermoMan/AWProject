var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysqlsession = require('express-mysql-session');
var MySQLStore = mysqlsession(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var sessionStore = new MySQLStore({
    host: 'localhost',
    user: 'root',
    port: "3306",
    password: '',
    database: '404db'
});

const middlewareSession = session({
    saveUninitialized: false,
    secret: 'foobar34',
    store: sessionStore,
    resave: false
});
app.use(middlewareSession);

app.get("/", function(request, response, next) {
    if (request.session.email) {
        response.locals.email = request.session.email;
        response.locals.password = request.session.password;
        response.locals.name = request.session.name;
        response.locals.userId = request.session.userId;
        response.locals.image = request.session.image;
        response.locals.date = request.session.date;
        response.locals.reputation = request.session.reputation;

        response.redirect("/index");
    } else {
        response.redirect("/users/login");
    }
});

app.use('/index', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
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
app.listen(3000, function(err) {
    if (err) {
        console.error("la cagaste wey");
    } else {
        console.log("Serve on")
    }
})

module.exports = app;