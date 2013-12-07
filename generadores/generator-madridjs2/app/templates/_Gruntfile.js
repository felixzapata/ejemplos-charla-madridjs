(function() {
    'use strict';

    var path = require('path'),
        mountFolder = function(connect, dir) {
            return connect['static'](require('path').resolve(dir));
        };

    module.exports = function(grunt) {
        // load all grunt tasks
        require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

        // configurable paths
        var yeomanConfig = {
            app: '.',
            dist: 'dist',
            tmp: '.tmp',
            componentName: '<%= _.slugify(componentName) %>'
        };

        try {
            yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
        } catch (ignore) {}

        grunt.initConfig({
            yeoman: yeomanConfig,
            watch: {

                compass: {
                    files: ['<%%= yeoman.app %>/scss/{,*/}*.{scss,sass}'],
                    tasks: ['compass:server']
                },
                styles: {
                    files: ['<%%= yeoman.app %>/styles/{,*/}*.css'],
                    tasks: ['copy:styles']
                },
                jade: {
                    files: ['<%%= yeoman.app %>/templates/**/*.jade'],
                    tasks: ['jade']
                },
                livereload: {
                    options: {
                        // Start a live reload server on the default port 35729
                        livereload: true
                    },
                    files: [
                        '<%%= yeoman.tmp %>/{,*/}*.html',
                        '<%%= yeoman.tmp %>/styles/{,*/}*.css',
                        '{<%%= yeoman.tmp %>,<%%= yeoman.app %>}/scripts/{,*/}*.js',
                        '<%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                    ],
                    tasks: []
                }
            },
            connect: {
                options: {
                    port: 9000,
                    hostname: 'localhost'
                },
                dev: {
                    options: {
                        middleware: function(connect) {
                            return [
                                require('connect-livereload')(),
                                mountFolder(connect, yeomanConfig.tmp)
                            ];
                        }
                    }
                },
            },
            open: {
                server: {
                    path: 'http://localhost:<%%= connect.options.port %>'
                }
            },
            jade: {
                html: {
                    files: {
                        '<%%= yeoman.tmp %>': ['<%%= yeoman.app %>/templates/*.jade']
                    },
                    options: {
                        client: false,
                        pretty: true
                    }
                }
            },
            clean: {
                dist: {
                    files: [{
                        dot: true,
                        src: [
                            '<%%= yeoman.tmp %>',
                            '<%%= yeoman.dist %>/*',
                            '!<%%= yeoman.dist %>/.git*'
                        ]
                    }]
                },
                server: '<%%= yeoman.tmp %>'
            },
            jshint: {
                options: {
                    jshintrc: '.jshintrc'
                },
                all: [
                    '!Gruntfile.js',
                    '<%%= yeoman.app %>/scripts/{,*/}*.js',
                    '!<%%= yeoman.app %>/scripts/vendor/*'
                ]
            },
            compass: {
                options: {
                    sassDir: '<%%= yeoman.app %>/scss',
                    cssDir: '<%%= yeoman.tmp %>/styles',
                    generatedImagesDir: '<%%= yeoman.tmp %>/images/generated',
                    imagesDir: '<%%= yeoman.app %>/images',
                    javascriptsDir: '<%%= yeoman.app %>/scripts',
                    fontsDir: '<%%= yeoman.app %>/styles/fonts',
                    importPath: '<%%= yeoman.app %>',
                    httpImagesPath: '../images',
                    httpGeneratedImagesPath: '/images/generated',
                    httpFontsPath: '/styles/fonts',
                    relativeAssets: false,
                    outputStyle: 'compressed',
                    noLineComments: true
                },
                server: {
                    options: {
                        debugInfo: true
                    }
                }
            },
            copy: {
                views: {
                    files: [{
                        src: ['<%%= yeoman.app %>/views/*.html'],
                        dest: '<%%= yeoman.tmp %>/'
                    }]
                },
                images: {
                    files: [{
                        src: ['<%%= yeoman.app %>/images/*'],
                        dest: '<%%= yeoman.tmp %>/'
                    }]
                },
                scripts: {
                    files: [{
                        src: ['<%%= yeoman.app %>/scripts/*'],
                        dest: '<%%= yeoman.tmp %>/'
                    }]
                },
                styles: {
                    expand: true,
                    dot: true,
                    cwd: '<%%= yeoman.app %>/styles',
                    dest: '<%%= yeoman.tmp %>/styles/',
                    src: '{,*/}*.css'
                }
            }
        });

        grunt.registerTask('server', [
            'clean:server',
            'compass:server',
            'jade',
            'copy',
            'jshint',
            'connect:dev',
            'open',
            'watch'
        ]);

        grunt.registerTask('build', [
            'clean:dist',
            'jade',
            'copy:dist'
        ]);

        grunt.registerTask('default', [
            'jshint',
            'build'
        ]);

        grunt.registerTask('default', ['server']);
    };

}());
