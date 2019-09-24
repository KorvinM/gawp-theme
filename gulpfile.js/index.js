/* Gulp.js configuration*/
'use strict';

const config = require('./config.js');
//convert config.theme_name into themeName and themeSlug
const themeName = config.theme_name,
      themeSlug = themeName.toLowerCase().replace(/\s/g, '');
const
  // Gulp and plugins
  gulp          = require('gulp'),
  noop          = require('gulp-noop'),
  newer         = require('gulp-newer'),//https://www.npmjs.com/package/gulp-newer
  imagemin      = require('gulp-imagemin'),
  sass          = require('gulp-sass'),
  postcss       = require('gulp-postcss'),
  deporder      = require('gulp-deporder'),//https://www.npmjs.com/package/gulp-deporder
  concat        = require('gulp-concat'),
  terser        = require('gulp-terser'),//https://www.npmjs.com/package/gulp-terser
  del           = require("del"),
  replace       = require("gulp-replace")//https://www.npmjs.com/package/gulp-replace
;

// Browser-sync
var browsersync = false;


/* PHP processing*/
//settings
const php = {
  src           : config.src + 'php/**/*.php',
  build         : config.build
};
// copy PHP files
gulp.task('php', () => {
  return gulp.src(php.src)
    .pipe(newer(php.build))
    .pipe(replace('gawp', themeSlug))
    .pipe(replace('Gawp', themeName))
    .pipe(gulp.dest(php.build));
});

/* image processing*/
// settings
const images = {
  src         : config.src + 'img/**/*',
  build       : config.build + 'img/'
};
//copy and minify images
gulp.task('images', () => {
  return gulp.src(images.src)
    .pipe(newer(images.build))
    .pipe(imagemin())
    .pipe(gulp.dest(images.build));
});

/* CSS processing*/
//settings
var css = {
  src         : config.src + 'scss/style.scss',
  watch       : config.src + 'scss/**/*',
  build       : config.build,
  sassOpts: {
    outputStyle     : 'nested',
    imagePath       : images.build,
    precision       : 3,
    errLogToConsole : true
  },
  processors: [
    require('postcss-assets')({//https://www.npmjs.com/package/postcss-assets
      loadPaths: ['img/'],
      basePath: config.build,
      baseUrl: config.build
    }),
    require('autoprefixer')({
    }),
    require('css-mqpacker'),
    require('cssnano')
  ]
};
//compile from sass, pass thru postCss
gulp.task('css', gulp.series('images', () => {
  return gulp.src(css.src)
    .pipe(sass(css.sassOpts))
    .pipe(postcss(css.processors))
    .pipe(replace('Gawp', themeName))
    .pipe(gulp.dest(css.build))
    .pipe(browsersync ? browsersync.reload({ stream: true }) : noop());
}));

/* js processing
 * this is where it gets complicated */
//our build directory for js remains constant, so lets abstract it here
const build_js = config.build + 'js/';

 // first, bundle two files from _s concerning navigation
const nav_js = {
  src         : config.src + ['js/+(navigation|skip-link-focus-fix).js'],
  filename    : 'nav.js'
};
//no need to browsersync this task
gulp.task('nav_js', () => {
  return gulp.src(nav_js.src)
    .pipe(deporder())
    .pipe(concat(nav_js.filename))
    .pipe(terser())
    .pipe(gulp.dest(build_js));
});

// customizer.js needs to be bundled separately; it's loaded by customizer.php
const customizer_js = {
  src         : config.src + ['js/customizer.js'],
};
//no need to deporder, concat or browsersync this task
gulp.task('customizer_js', () => {
  return gulp.src(customizer_js.src)
    .pipe(terser())
    .pipe(gulp.dest(build_js));
});

//user scripts can be added here.
const js = {
  src         : config.src + 'js/scripts/**/*',
  filename    : 'scripts.js'
};
// JavaScript processing
gulp.task('js', () => {

  return gulp.src(js.src)
    .pipe(deporder())
    .pipe(concat(js.filename))
    .pipe(terser())
    .pipe(gulp.dest(build_js))
    .pipe(browsersync ? browsersync.reload({ stream: true }) : noop());

});

/* straight copy
 * copy files as is, from the copy directory to the root*/
//settings
const copy = {
  src         : config.src + 'copy/**/*'
};
// copy the files
gulp.task('copy', () => {
  return gulp.src(copy.src)
    .pipe(gulp.dest(config.build));
});

//clean settings
const clean = {
  //force:true is needed if the build folder is specified as outside the root
  force: true
}
gulp.task('clean', () => {
  return del(config.build, clean);
});

// run all build tasks
gulp.task('build', gulp.parallel('php', 'css', 'nav_js','customizer_js', 'js', 'copy'));

/*
 * browsersync
 */
 // Browsersync options
 //https://www.browsersync.io/docs/options
 const syncOpts = {
   proxy       : config.wp_siteurl,
   files       : config.build + '**/*',
   open        : false,
   notify      : false,
   ghostMode   : false,
   ui: {
     port: 8001
   }
 };

 // browser-sync
 gulp.task('browsersync', () => {
   if (browsersync === false) {
     browsersync = require('browser-sync').create();
     browsersync.init(syncOpts);
   }
 });

 // watch for file changes
gulp.task('watch', gulp.parallel('browsersync', () => {

  // page changes
  gulp.watch(
    php.src,
    gulp.series('php', browsersync ? browsersync.reload : {})
  );

  // image changes
  gulp.watch(
    images.src,
    gulp.series('images')
  );

    // CSS changes
  gulp.watch(css.watch,
    gulp.series('css')
  );

  // JavaScript main changes
  gulp.watch(js.src,
    gulp.series('js')
  );

}));

// default task
gulp.task('default', gulp.series('clean', 'build', 'watch'));
