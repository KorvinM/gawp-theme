/* Gulp.js configuration*/
'use strict';

const
  // source and build folders
  dir = {
    src         : 'src/',
    build       : 'build/'
  },

  // Gulp and plugins
  gulp          = require('gulp'),
  gutil         = require('gulp-util'),
  newer         = require('gulp-newer'),//https://www.npmjs.com/package/gulp-newer
  imagemin      = require('gulp-imagemin'),
  sass          = require('gulp-sass'),
  postcss       = require('gulp-postcss'),
  deporder      = require('gulp-deporder'),//https://www.npmjs.com/package/gulp-deporder
  concat        = require('gulp-concat'),
  stripdebug    = require('gulp-strip-debug'),
  uglify        = require('gulp-uglify'),
  del           = require("del");
;

// Browser-sync
var browsersync = false;


/* PHP processing*/
//settings
const php = {
  src           : dir.src + 'php/**/*.php',
  build         : dir.build
};
// copy PHP files
gulp.task('php', () => {
  return gulp.src(php.src)
    .pipe(newer(php.build))
    .pipe(gulp.dest(php.build));
});

/* image processing*/
// settings
const images = {
  src         : dir.src + 'img/**/*',
  build       : dir.build + 'img/'
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
  src         : dir.src + 'scss/style.scss',
  watch       : dir.src + 'scss/**/*',
  build       : dir.build,
  sassOpts: {
    outputStyle     : 'nested',
    imagePath       : images.build,
    precision       : 3,
    errLogToConsole : true
  },
  processors: [
    require('postcss-assets')({
      loadPaths: ['img/'],
      basePath: dir.build,
      baseUrl: '/wp-content/themes/gawp/'
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
    .pipe(gulp.dest(css.build))
    .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop());
}));

/* js processing
 * this is where it gets complicated */
//our build directory for js remains constant, so lets abstract it here
const build_js = dir.build + 'js/';

 // first, bundle two files from _s concerning navigation
const nav_js = {
  src         : dir.src + ['js/+(navigation|skip-link-focus-fix).js'],
  filename    : 'nav.js'
};
//no need to browsersync this task
gulp.task('nav_js', () => {
  return gulp.src(nav_js.src)
    .pipe(deporder())
    .pipe(concat(nav_js.filename))
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(gulp.dest(build_js));
});

// customizer.js needs to be bundled separately; it's loaded by customizer.php
const customizer_js = {
  src         : dir.src + ['js/customizer.js'],
  filename    : 'customizer.js'
};
//no need to browsersync this task
gulp.task('customizer_js', () => {
  return gulp.src(customizer_js.src)
    .pipe(deporder())
    .pipe(concat(customizer_js.filename))
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(gulp.dest(build_js));
});

//user scripts can be added here. TODO: test this
const js = {
  src         : dir.src + 'js/scripts/**/*',
  filename    : 'scripts.js'
};
// JavaScript processing
gulp.task('js', () => {

  return gulp.src(js.src)
    .pipe(deporder())
    .pipe(concat(js.filename))
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(gulp.dest(build_js))
    .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop());

});

/* straight copy - used to copy files as is to the root*/
//settings
const copy = {
  src         : dir.src + 'copy/**/*'
};
// copy the files
gulp.task('copy', () => {
  return gulp.src(copy.src)
    .pipe(gulp.dest(dir.build));
});

//clean settings
const clean = {
  //dryRun:true,
  force: true
}
gulp.task('clean', () => {
  return del(dir.build, clean);
});

// run all build tasks
gulp.task('build', gulp.parallel('php', 'css', 'nav_js','customizer_js', 'js', 'copy'));

/*
 * browsersync
 */
 // Browsersync options
 //https://www.browsersync.io/docs/options
 const syncOpts = {
   proxy       : 'http://two.wordpress.test',
   files       : dir.build + '**/*',
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
