require("./config/config");

const express = require('express');
const app = express();

const mongoose = require('mongoose');

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
//configuracion global de rutas
app.use(require("./routes/index"));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
    if (err)
        throw err;
    else
        console.log("You R conected");
});

app.listen(process.env.PORT, () => {
    console.log(`Corriendo en el server ${process.env.PORT}`);
});