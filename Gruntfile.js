/**
 * Created by Omry_Nachman on 12/31/14.
 */
"use strict";

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      files: ['src/**/*.js', 'test/**/*.js', '*.js'],
      options: {
        eqeqeq: true,
        jasmine: true,
        node: true,
        globals: {
          jasmine: false
        }
      }
    },
    simpleJasmine: {
      unit: {
        options: {
          spec_dir: "test"
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-jasmine');

  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', ['jshint', 'simpleJasmine']);
};


