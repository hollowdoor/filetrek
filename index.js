require("setimmediate");
var Promise = require('es6-promise').Promise,
    fs = require('graceful-fs'),
    Matcher = require('multimatcher'),
    path = require('path'),
    cwd = process.cwd();

/*
git remote add origin https://github.com/hollowdoor/filetrek.git
git push -u origin master
npm publish
*/


module.exports = function(folder, options, cb){

    cb = cb || null;

    if(typeof options === 'function'){
        cb = options;
        options = {};
    }

    var ignore = null,
        find = null;


    if(Object.prototype.toString.call(options.ignore) === '[object Array]')
        ignore = new Matcher(options.ignore);

    if(Object.prototype.toString.call(options.find) === '[object Array]')
        find = new Matcher(options.find);


    return new Promise(function(resolve, reject){

        var info = [],
            base = path.resolve(folder);


        fs.readdir(folder, function(err, files){

            var cancel = false,
                running = files.length;

            if(find)
                files = find.find(files);


            if(err)
                return reject(new Error('filetrek error: '+err.message));

            var stat = function(name){

                var fullname = path.resolve(base, name);

                if(ignore && ignore.test(fullname)){
                    if(!--running)
                        return resolve(info);
                    return;
                }

                fs.lstat(fullname, function(err, stats){

                    if(cancel)
                        return;

                    if(err){
                        cancel = true;
                        return reject(new Error('filetrek error: '+err.message));
                    }

                    if(cb)
                        cb(name, stats, base);

                    info.push({
                        base: base,
                        name: name,
                        stats: stats
                    });

                    if(!--running)
                        return resolve(info);

                });
            };

            for(var i=0; i<files.length; i++){
                stat(files[i]);
            }
        });


    });
};
