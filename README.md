# GAWP

Gawp is a Gulp Augmented WordPress starter theme.
It uses a modified version of underscores and adds a Gulp build process.
The theme's source files and build files are kept seperate.

The Gulp build process is based on a [tutorial by Craig Buckler](https://www.sitepoint.com/fast-gulp-wordpress-theme-development-workflow/), updated for Gulp 4.

Gawp compiles css from SASS and PostCss, and bundles JavaScript.
It’s quite minimalist, with no transpiling or linting of JavaScript.
It does however minify the bundled JS and compiled CSS.

## How To Use

### Installation
1. Clone or download the repo
1. Rename gulpfile.js/config-sample.js to gulpfile.js/config.js
1. Run `npm install`

### Usage
* Gawp is intended to sit outside the public directory of your WordPress environment
* Edit your gulpfile.js/config.js file to specify:
  * your build path: it should be a new directory within wp-content/themes/
  * your WordPress url
* Gulp tasks are defined in gulpfile.js/index.js
  * `gulp build` builds the theme into the build directory specified
  * `gulp clean` will delete the build directory.
  * `gulp watch` will run browsersync as a proxy to the WordPress url specified.
  * `gulp` runs the default task, which runs `clean`, `build`, and `watch` in series.
