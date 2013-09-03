module.exports = function(grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		watch : {
			livereload : {
				files : ['**/*.*'],
				options : {
					livereload : true
				}
			},
		}
	});

	grunt.registerTask('default', 'watch');
}