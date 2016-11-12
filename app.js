var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');
var hbars = require('express-handlebars');
var chalk = require('chalk');
var db = require('./models/db.js'); // db.js must be required before routes.js
var app = module.exports = express(); // exporting apps must be done before routes.js
var routes = require('./routes/routes.js');
var net = require('net');

app.use(express.static(__dirname + "/"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: false
}));
app.set('view engine', 'handlebars');
app.engine('handlebars', hbars({
    defaultLayout: 'layout'
}));

app.get('/', routes.loginPageHandler);
app.get('/logout', routes.logoutPageHandler);
app.post('/auth', routes.authHandler);
app.get('/console', routes.consoleHandler);
app.get('/registerForm', routes.registerFormHandler);
app.post('/register', routes.registerUserHandler);
app.get('/edit', routes.editPageHandler);
app.post('/saveChanges', routes.saveChangesHandler);
app.get('/delete', routes.deletePageHandler);
app.get('/addForm', routes.addFormHandler);
app.post('/add', routes.addHandler);

//error handling
app.use("*", function(req, res) {
    res.status(404);
    res.render('message.handlebars', {
        message: '<blockquote class="mainLines"><code> The page you are looking for is not available or may have been moved.</code> </blockquote>'
    });
});

app.use(function(error, req, res, next) {
    console.log(chalk.red('Error : 500::' + error))
    res.status(500);
    res.render('message.handlebars', {
        message: '<blockquote class="mainLines"><code>something went wrong as you tried to access this page</code>Probably this happened because there are some bugs in the application</blockquote>'
    });
});

var port = process.env.PORT || 3333; //using local port 3333

console.log("Checking the availability of port %d", port);
var netServer = net.createServer();
netServer.once('error', function(err) {
    if (err.code === 'EADDRINUSE') {
        console.log(chalk.red("port %d is currently in use", port));
        return;
    }
});

netServer.listen(port, function() {
    console.log(chalk.green('Net server is able to listen on port: ' + port));
    netServer.close();
    console.log(chalk.green('Closing Net server on port: ' + port));

    app.listen(port, function() {
        console.log(chalk.green("Http server is listening on port [" + port + '] '));
    });
});
