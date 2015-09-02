var filetrek = require('../index.js'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp-omen'),
    rimraf = require('rimraf'),
    top = 'orig/';

var p = filetrek(top, function(name, stats, root){
    console.log(arguments);
    if(stats.isDirectory()){
        console.log('directory name = '+name);
        return path.join(root, name);
    }
    console.log('file name = ',name);
    //console.log('stats.isFile() = ', stats.isFile());
});

p.then(function(all){
    console.log('done');
    //recursiveWalk();
}, function(e){ console.log(e); });

function recursiveWalk(){
    var dir = 'alt'; //path.resolve('alt');

    console.log('dir = '+dir);

    rimraf(dir, function(e){
        var p = filetrek(top, function(name, stats, root, dirname){
            //console.log(dir);

            if(stats.isDirectory()){
                console.log('root = ', root);
                console.log('directory name = '+name);
                console.log('dirname = '+dirname);

                return mkdirp(path.join(dir, dirname)).then(function(){
                    return path.join(root, name);
                });
            }

            console.log('file name = ',name);
            return copyfile(path.join(root, name), path.join(dir, dirname, name));

        });

        p.then(function(all){
            console.log('done');
        }, function(e){ console.log(e); });
    });
}
