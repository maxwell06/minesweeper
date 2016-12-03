/**
 * Created by Administrator on 2016/12/2 0002.
 */
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var port = 8080;
app.listen(port);
console.log('Listening on port: ' + port);