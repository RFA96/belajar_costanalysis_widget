const express = require("express");
const app = express();
const path = require("path");

/*** Front end config ***/
app.use(express.static(path.join(__dirname, 'node_modules')));
app.set('views', path.join(__dirname, 'pages'));

/*** File .js router initialized with variable ***/
let analysisController = require("./fe_controllers/analysis");

/*** Set the endpoint ***/
app.use('/analysis', analysisController);

/*** Run the server ***/
app.listen(process.env.APP_PORT || 3000);
console.log(path.join(__dirname, 'pages'));
console.log("Running at port 3000");
