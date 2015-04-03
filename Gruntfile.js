'use strict';

module.exports = function(grunt) {
    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            bin: {
                src: ['bin/**/*.js']
            },
            etc: {
                src: ['etc/**/*.conf']
            },
            lib: {
                src: ['lib/**/*.js']
            }
        }
    });
    
    grunt.registerTask('start', 'Start Well', function()
    {
        var done = this.async();
        
        grunt.log.writeln('Running server at "%s"...', process.cwd());
        
        process.chdir('bin');
        
        grunt.log.writeln('Moved to "%s"...', process.cwd());
        
        var spawn = require('child_process').spawn;
        
        var child = spawn('./well', [], {'cwd': process.cwd()});
        
        child.stdout.on('data', function (data)
        {
            grunt.log.write('' + data);
        });
        
        child.stderr.setEncoding('utf8');
        
        child.stderr.on('data', function (data)
        {
            if (/^execvp\(\)/.test(data))
            {
                grunt.log.writeln('Failed to start child process.');
            }
        });

        child.on('close', function (code)
        {
            grunt.log.writeln('child process exited with code ' + code);
            
            done();
        });
    });
    

    // Default task.
    grunt.registerTask('default', ['jshint']);
};
