require("setimmediate");
var Promise = require('es6-promise').Promise,
    fs = require('fs');

module.exports = function(names, on_next){

    var blockError = false;

    if(typeof on_next !== 'function')
        blockError = new TypeError('forstats Error: Second argument must be a function.');

    if(Object.prototype.toString.call(names) !== '[object Array]')
        blockError = new TypeError('forstats Error: First argument must be an array.');


    return new Promise(function(resolve, reject){
        var index = 0,
            info = [],
            list;

        if(blockError)
            return reject(blockError);

        if(!names.length)
            return resolve([]);

        list = names.concat([]);

        stat(list[index]);

        function stat(name){

            fs.lstat(name, function(err, stats){

                if(err)
                    return reject(new Error('forstats Error: '+err.message));

                on_next(stats, index, list);

                info.push({
                    name: name,
                    stats: stats
                });

                if(++index === names.length)
                    return resolve(info);

                stat(list[index]);
            });
        }
    });
}
