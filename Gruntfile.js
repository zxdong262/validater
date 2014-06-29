module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    ,uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        ,report: ['min', 'gzip']
        ,mangle: {
          except: ['exports', 'module', 'require']
        }
      }
      ,dist: {
        files: [{
          expand: true
          ,src: 'validater.js'
          ,dest: 'validater.min.js'
        }]
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-newer')
  grunt.registerTask('nu', ['newer:uglify'])
  grunt.registerTask('default', ['newer:uglify'])

}