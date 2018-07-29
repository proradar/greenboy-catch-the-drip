var express = require('express'),
    app = express(),
    path = require('path')

app.listen(9000, function() {
  console.log("Running on port: "+9000)
})

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
})

app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'fonts')));
