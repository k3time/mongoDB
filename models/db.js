var chalk = require('chalk');
var mongoose = require('mongoose');

//   ****** DB : local and server
//var dbURI =  'mongodb://127.0.0.1/technology';
var dbURI =  'mongodb://k3time:mlab7pass@ds151127.mlab.com:51127/technology';

//mongo interactive shell > mongo ds151127.mlab.com:51127/technology -u <dbuser> -p <dbpassword>
//MongoDB driver > mongodb://<dbuser>:<dbpassword>@ds151127.mlab.com:51127/technology

console.log(chalk.yellow("Establishing connection to the DB"));

//   ****** CONNECTIONS
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
  console.log(chalk.yellow('Mongoose connected to ' + dbURI));
});

mongoose.connection.on('error', function (err) {
  console.log(chalk.red('Mongoose connection error: ' + err));
});

mongoose.connection.on('disconnected', function () {
  console.log(chalk.red('Mongoose disconnected'));
});

// ***** *******  *  *****   Schema defs
var userSchema = new mongoose.Schema({
  username: {type: String, unique:true},
  email: {type: String, unique:true},
  password: String
}, {collection: 'UsersUnsafePassword'});

var techSchema = new mongoose.Schema({
  tech: {type: String, unique:true},
  description: {type: String}
}, {collection: 'Tech'});

// register the User model
mongoose.model( 'UserModel', userSchema);
mongoose.model( 'TechModel', techSchema);

