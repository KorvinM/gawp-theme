# GAWP

Gawp is a Gulp Augmented WordPress starter theme.
It uses a modified version of underscores and adds a Gulp build process.
The theme's source files and build files are kept seperate.

The Gulp build process is based on a [tutorial by Craig Buckler](https://www.sitepoint.com/fast-gulp-wordpress-theme-development-workflow/), updated for Gulp 4.

Gawp compiles css from SASS and PostCss, and bundles JavaScript, minifying those
assets. It’s quite minimalist, with no transpiling or linting.

## How To Use

### Installation
1. Clone or download the repo
1. Rename gulpfile.js/config-sample.js to gulpfile.js/config.js
1. Run `npm install`

### Usage
* Gawp is designed to sit outside the public directory of your WordPress environment
* Edit your gulpfile.js/config.js file, where indicated, to specify:
  * your build path: it should be a new directory within wp-content/themes/
  * your WordPress site url
  * your theme name, and theme slug (i.e. your theme name in lowercase with no spaces) (TODO: automate this)
    * gawp uses these two options in the build process, replacing 'Gawp' and 'gawp' in the theme templates, and sets the theme name in style.css's comments
* edit src/style.scss as appropriate.
* Gulp tasks are defined in gulpfile.js/index.js, which is defined as the entry point for node purposes.
  * `gulp build` builds the theme into the build directory specified
  * `gulp clean` deletes the build directory.
  * `gulp watch` runs browsersync as a proxy to the WordPress url specified.
  * `gulp` runs the default task: `clean`, `build`, and `watch` in series.
