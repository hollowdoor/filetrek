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
        find = null,
        holdError = null;


    if(Object.prototype.toString.call(options.ignore) === '[object Array]')
        ignore = new Matcher(options.ignore);

    if(Object.prototype.toString.call(options.find) === '[object Array]')
        find = new Matcher(options.find);


    return new Promise(function(resolve, reject){

        if(typeof folder !== 'string')
            return reject(TypeError('filetrek error: First argument must be a string.'));


        var info = [],
            dirs = [],
            thenables = [];

        getFiles(folder);

        function getFiles(folder){

            var base = path.resolve(folder + ''),
                s = fs.statSync(base);

            if(!s.isDirectory())
                return reject(new TypeError('filetrek error: '+folder+' is not a directory.'));

            fs.readdir(base, function(err, files){

                if(files && !files.length){
                    if(!dirs.length)
                        return resolve(info);
                    return getFiles(dirs.shift());
                }

                var cancel = false,
                    index = 0;

                if(find)
                    files = find.find(files);

                if(err)
                    return reject(new Error('filetrek error: '+err.message));

                var stat = function(name){

                    var fullname = path.resolve(base, name),
                        returned;

                    if(ignore && ignore.test(fullname)){
                        if(++index >= files.length)
                            return resolve(thenables.length ? Promise.all(thenables) : info);
                        return;
                    }

                    fs.lstat(fullname, function(err, stats){

                        if(cancel)
                            return;

                        if(err){
                            cancel = true;
                            return reject(new Error('filetrek error: '+err.message));
                        }

                        if(cb){
                            returned = cb(name, stats, base);

                            if(returned !== undefined){
                                if(typeof returned === 'string'){
                                    dirs.push(returned);

                                }else if(Object.prototype.toString.call(returned) ===
                                    '[object Object]' && typeof returned.then === 'function'){
                                    thenables.push(returned);
                                }
                            }

                        }

                        info.push({
                            base: base,
                            name: name,
                            stats: stats
                        });


                        if(++index === files.length){
                            if(!dirs.length)
                                return resolve(thenables.length ? Promise.all(thenables) : info);
                            return getFiles(dirs.shift());
                        }

                        stat(files[index]);

                    });
                };

                stat(files[index]);

            });
        }

    });
};
