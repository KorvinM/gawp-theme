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
1. Run `npm install`

### Usage
* Gulp tasks are defined in gulpfile.js/index.js
* `gulp build` builds the theme into the build directory specified in gulpfile.js/index.js
* You could then copy the contents of the build dir into your empty theme directory
* `gulp clean` will delete the build directory.
* Alternatively gawp could be placed outside the public directory of your WP environment and the build directory specified as a new directory within wp-content/themes/
* `gulp watch` - you'll need to specify the proxy setting in the Browsersync options
* `gulp` runs the default task, which runs `clean`, `build`, and `watch` in series.
