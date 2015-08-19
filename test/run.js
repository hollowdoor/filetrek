var forlstats = require('../index.js'),
    fs = require('fs');

var files = fs.readdirSync('./');

forlstats(files, function(stats, index, arr){
    console.log(stats);
})
.then(function(info){
    console.log(info);
});
