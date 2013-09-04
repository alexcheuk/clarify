module.exports = function(grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		watch : {
			livereload : {
				files : ['demo/**/*.*'],
				options : {
					livereload : true
				}
			},

			css : {
				files : ['src/clarify.css'],
				tasks : ['cssmin']
			},

			js : {
				files : ['src/clarify.js'],
				tasks : ['jshint', 'uglify']
			},
		},

		uglify: {
			ugly: {
				files: {
					'demo/lib/clarify.min.js' : ['src/clarify.js']
				}
			}
		},

		cssmin: {
			combine: {
				files: {
					'demo/lib/clarify.min.css': ['src/*.css']
				}
			}
		},

		jshint: {
			all: {
				options : {
					'-W099': true,
				},

				src : ['Gruntfile.js', 'src/*.js'],
			}
		}
	});

	grunt.registerTask('default', 'watch');
};