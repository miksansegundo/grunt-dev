'use strict';

var _ = require("underscore/underscore-min.js");

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    project: {

      app: "app",
      dist: "dist",
      img: "/img/",
      js: "/js/",
      css: "/css/",
      scss: "/scss/",
      bower: "bower/",
      fonts: "/fonts/",
      bower_comp: "/bower_components"
    },

    pkg: grunt.file.readJSON('package.json'),

    // Concat all bower components in one file
    bower_concat: {

      all: {
        src: "bower.json",
        dest: "<%= project.app %><%= project.js %><%= project.bower %>bower_concat.js",
        dependencies: {
          'jquery': 'console-polyfill',
          'underscore': 'jquery',
          'backbone': 'underscore' 
        }
        /*,
        callback: function(mainFiles, component) {
          // Ya minifico con Uglify en total de ficheros
          return _.map(mainFiles, function(filepath) {
              // Use minified files if available
            var min = filepath.replace(/\.js$/, '.min.js');
            return grunt.file.exists(min) ? min : filepath;
          });
        }*/
      }

    },

    requirejs: {
      compile: {
        options: {
          baseUrl: "<%= project.app %><%= project.js %>",
          //findNestedDependencies: true,
          optimize: 'none',
          include: [
            "text", 
            "text!components/modules/main_menu.html",
            "text!components/modules/main_idiomas.html",
            "text!components/modules/home/home.html",
            "text!components/modules/menu/menu.html"
          ],
          paths: {
            text: 'libs/require/text'    
          },
          name: "libs/require/require", // assumes a production build using almond
          out: "<%= project.app %><%= project.js %>require_modules.js"
        }
      }
    },

    uglify: {

      options: {
        mangle: {
          except: ['jQuery', 'Backbone']
        }
      }
    },

    compass: {     

      options: {
        sassDir: '<%= project.app %><%= project.scss %>',
        cssDir: '<%= project.app %><%= project.css %>',
        generatedImagesDir: '<%= project.app %><%= project.img %>',
        imagesDir: '<%= project.app %><%= project.img %>',
        fontsDir: '<%= project.app %><%= project.fonts %>',
        importPath: [
          '<%= project.app %>/<%= project.scss %>/', 
          '<%= project.app %>/<%= project.scss %>/compass-animate/stylesheets/', 
          '<%= project.app %>/<%= project.scss %>/bootstrap-sass/stylesheets/'
        ],
        httpImagesPath: '<%= project.img %>',
        httpGeneratedImagesPath: '<%= project.img %>',
        httpFontsPath: '..<%= project.fonts %>',
        relativeAssets: false,
        assetCacheBuster: false,
        watch: false,
        specify: '<%= project.app %><%= project.scss %>*.*',
        //specify: ['**/*.{scss,sass}', '!**/*_.{scss,sass}'],
        raw: 'Sass::Script::Number.precision = 10\n'
        //raw: 'require "animate"\n' Para añadir un plugin de compass
      },
      dist: {
        options: {
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= project.dist %>/*',
            '!<%= project.dist %>/.git*'
          ]
        }]
      },
      server: [
      ]
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
        {
          expand: true,
          dot: true,
          cwd: '<%= project.app %>',
          dest: '<%= project.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'img/*',
            '!img/Thumbs.db',
            'fonts/*',
            '!fonts/Thumbs.db',
            'js/components/modules/{,*/}*.js',
            'js/cordova.js'
          ]
        }]
      },
      all: {
          expand: true,
          dot: true,
          cwd: '<%= project.app %><%= project.bower_comp %>/bootstrap-sass/fonts/',
          dest: '<%= project.dist %>/fonts/',
          src: ['**']
        }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= project.app %>/index.html',
      options: {
        dest: '<%= project.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= project.dist %>/{,*/}*.html'],
      css: ['<%= project.dist %><%= project.css %>{,*/}*.css'],
      options: {
        assetsDirs: ['<%= project.dist %>', '<%= project.dist %><%= project.img %>']
      }
    },

    concat: {
      options: {
        root: '<%= project.app %>',
        dest: '<%= project.dist %>'
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
      }

    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %><%= project.img %>',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= project.dist %><%= project.img %>'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %><%= project.img %>',
          src: '{,*/}*.svg',
          dest: '<%= project.dist %><%= project.img %>'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= project.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= project.dist %>'
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %><%= project.css %>',
          src: '{,*/}*.css',
          dest: '<%= project.app %><%= project.css %>'
        }]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= project.dist %><%= project.js %>{,*/}*.js',
            '<%= project.dist %><%= project.css %>{,*/}*.css'
            //'<%= project.dist %><%= project.img %>{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            //'<%= project.dist %><%= project.css %><%= project.fonts %>*'
          ]
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= project.app %><%= project.js %>{,*/}*.js'],
        tasks: [/*'newer:jshint:all'*/],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      require: {
        files: [
            "js/components/modules/main_menu.html",
            "js/components/modules/main_idiomas.html",
            "js/components/modules/home/home.html",
            "js/components/modules/menu/menu.html"
        ],
        task: ["requirejs"]
      },
      compass: {
        files: [
          "<%= project.app %><%= project.scss %>{,*/}*.{scss,sass}"
        ],
        tasks: ['compass:server', 'newer:autoprefixer']
      },
      gruntfile: {
        files: ['gruntfile.js']
      },
      bower: {
        files: ['bower.json'],
        tasks: ['bower_concat']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= project.app %>/{,*/}*.html',
          '<%= project.app %><%= project.css %>{,*/}*.css',
          '<%= project.app %><%= project.img %>{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    plato: {
      your_task: {
        options : {
            exclude: /\.min\.js$/    // excludes source files finishing with ".min.js"
        },
        files: {
            'public/reports': ['public/js/app/**/*.js']
        }
      }
    },



    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= project.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            'test',
            '<%= project.app %>'
          ]
        }
      },
      dist: {
        options: {
          port: 9002,
          open: true,
          base: ['<%= project.dist %>']
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server',
        'newer:bower_concat:all', 
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin'      ]
    },

    nodemon: {
        dist: {
            script: 'run.js',
            options: {
                cwd: 'nodeserver',
                ext: 'js,json',
                watch: ['./'],
                ignore: ['node_modules/**', 'tmp/**']
            }
        }
    }

  });
  
  // Events - demo
  grunt.event.on('watch', function(action, filepath, target) {

    if (target === "compass") {
      grunt.config('compass.server.options.specify', filepath);
    }
  });

  // Load task - demo
  /*grunt.loadNpmTasks('grunt-bower-concat');*/

  // Default task(s).
  grunt.registerTask('default', [
    
  ]);

  grunt.registerTask('serve', [
    'clean:server',
    'concurrent:server',
    'newer:autoprefixer',
    'requirejs',
    'connect:livereload',
    'watch'

  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    'concurrent:dist',
    'copy:dist',
    'requirejs',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    //'rev',
    'usemin',
    'htmlmin',
    'nodemon'
  ]);
};  