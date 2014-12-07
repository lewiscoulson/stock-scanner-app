module.exports = function(grunt){
	grunt.initConfig({
		jasmine: {
			dev: {
        src: ["public/js/build/dependencies.js"],
        options: {
          specs: "public/js/build/specs.js"
        }
      }
	  },
	  browserify: {
    	dist: {
		    files: {
		      'public/js/build/app.js': ['public/js/init.js','public/js/models/*.js','public/js/collections/*.js','public/js/routers/*.js','public/js/views/*.js'],
		    }
		  },
		  specs: {
        src: ["spec/testspec.js"],
        dest: "public/js/build/specs.js"
      }
    },
    sass: {
	    dist: {
	      files: {
	        'public/css/main.css': 'public/css/scss/main.scss'
	      }
	    }
	  },
	  watch: {
	    files: ['public/**/*'],
	    tasks: ['browserify', 'jasmine', 'sass'],
	  },
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
}