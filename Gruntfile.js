module.exports = function(grunt){
	grunt.initConfig({
		jasmine: {
			dev: {
        src: ["public/dist/js/dependencies.js"],
        options: {
          specs: "public/dist/test/specs.js"
        }
      }
	  },
	  browserify: {
    	dist: {
		    files: {
		      'public/dist/js/app.js': ['public/js/init.js','public/js/models/*.js','public/js/collections/*.js','public/js/routers/*.js','public/js/views/*.js']
        }
		  },
		  specs: {
        src: ["spec/**/*_spec.js"],
        dest: "public/dist/test/specs.js"
      }
    },
    uglify: {
      my_target: {
        files: {
          'public/dist/js/app.min.js': ['public/dist/js/app.js'],
          'public/dist/js/dependencies.min.js': ['public/dist/js/dependencies.js']
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          'public/dist/css/main.min.css': ['public/dist/css/main.css']
        }]
      }
    },
    sass: {
	    dist: {
        options: {
          sourcemap: 'none'
        },
	      files: {
	        'public/dist/css/main.css': 'public/css/main.css'
	      }
	    }
	  },
	  watch: {
	    files: ['public/js/**','public/css/**'],
	    tasks: ['browserify', 'jasmine', 'uglify', 'sass', 'cssmin'],
	  }
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify', 'sass', 'cssmin', 'jasmine', 'uglify', 'watch']);
}