var app = require('./controller/app.js');
var hostname = 'localhost';
var port = 3000;

app.listen(port, hostname,() =>{
    console.log(`Store database hosted at http://${hostname}:${port}`)
})
