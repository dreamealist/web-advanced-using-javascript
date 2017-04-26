/*jslint node: true */

'use strict';

    // Gulp plugins
var gulp                           = require('gulp'),
    del                            = require('del'),
    sass                           = require('gulp-sass'),
    CSSCompressor                  = require('gulp-csso'),
    browserSpecificPrefixGenerator = require('gulp-autoprefixer'),
    HTMLMinifier                   = require('gulp-htmlmin'),
    HTMLValidator                  = require('gulp-html'),
    JSConcatenator                 = require('gulp-concat'),
    JSLinter                       = require('gulp-eslint'),
    JSCompressor                   = require('gulp-uglify'),
    imageCompressor                = require('gulp-imagemin'),
    tempCache                      = require('gulp-cache'),
    browserSync                    = require('browser-sync'),
    reload                         = browserSync.reload,

    // Folder name variables
    devSourceFolder  = 'dev',
    devTargetFolder  = 'temp',
    prodTargetFolder = 'prod',
    HTMLSourceFolder = 'html',
    JSFolder         = 'scripts',
    imagesFolder     = 'img',
    sassCSSFolder    = 'styles',

    // Filenames and paths
    JSTargetFilename = 'main.js',
    preConcatenatedJSFiles = devSourceFolder + '/' + JSFolder + '/*.js',
    HTMLFiles = [
        devSourceFolder + '/' + HTMLSourceFolder + '/*.html',
        devSourceFolder + '/' + HTMLSourceFolder + '/**/*.html'
    ],
    sassMainFile = devSourceFolder  + '/' + sassCSSFolder + '/main.scss',

    // Folder paths
    expendableFolders        = [devTargetFolder, prodTargetFolder],
    JSDevTargetFolder        = devTargetFolder  + '/' + JSFolder,
    JSProdTargetFolder       = prodTargetFolder + '/' + JSFolder,
    cssDevDestinationFolder  = devTargetFolder  + '/' + sassCSSFolder + '/',
    cssProdDestinationFolder = prodTargetFolder + '/' + sassCSSFolder + '/',
    browserPref              = 'default';

/**
 * CHOOSE A BROWSER OTHER THAN THE DEFAULT
 *
 * The following four tasks set the browser preference variable (browserPref) in
 * the browserSync preferences read by the serve task. To use either of the four
 * browsers when serving this project, invoke Gulp as follows:
 *
 *    gulp safari serve
 *    gulp firefox serve
 *    gulp chrome serve
 *    gulp opera serve
 *
 * Testing in Windows and Linux is pending.
 */

// Works in Mac OS X 10.11
gulp.task('safari', function () {
    browserPref = 'safari';
});

// Unknown
gulp.task('firefox', function () {
    browserPref = 'firefox';
});

// Doesn’t work in Mac OS X 10.11
gulp.task('chrome', function () {
    browserPref = 'chrome';
});

// Works in Mac OS X 10.11
gulp.task('opera', function () {
    browserPref = 'opera';
});

/**
 * VALIDATE HTML
 *
 * This task validates HTML pages. If no errors are found, the Gulp task will simply
 * move down a line, reporting the task is done.
 *
 * On error, however, you’ll receive one or more messages about your HTML errors.
 * These errors are reported as having been found at line and column values. For
 * example, 1.5 means an error on line 1, column 5.
 *
 * Regardless of whether your HTML validates or not, no files are copied to any
 * destination folder.
 */
gulp.task('validateHTML', function () {
    return gulp.src(HTMLFiles)
        .pipe(HTMLValidator());
});

/**
 * COMPRESS HTML
 *
 * This task compresses all the HTML files in the HTMLFiles array, then writes the
 * compressed files to the prodTargetFolder.
 */
gulp.task('compressHTML', function () {
    return gulp.src(HTMLFiles)
        .pipe(HTMLMinifier({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(prodTargetFolder));
});

/**
 * COMPILE CSS FOR DEVELOPMENT WORK
 *
 * This task looks for a single Sass file (sassMainFile), compiles the CSS from it,
 * and writes the resulting file to the cssDevDestinationFolder. The final CSS file
 * will be formatted with 2-space indentations. Any floating-point calculations will
 * be carried out 10 places, and browser-specific prefixes will be added to support 2
 * browser versions behind all current browsers’ versions.
 */
gulp.task('compileCSSForDev', function () {
    return gulp.src(sassMainFile)
        .pipe(sass({
            outputStyle: 'expanded',
            precision: 10
        }).on('error', sass.logError))
        .pipe(browserSpecificPrefixGenerator({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest(cssDevDestinationFolder));
});

/**
 * COMPILE CSS FOR PRODUCTION
 *
 * This task looks for a single Sass file (sassMainFile), compiles the CSS from it,
 * and writes the resulting single CSS file to the cssProdDestinationFolder. Any
 * floating-point calculations will be carried out 10 places, and browser-specific
 * prefixes will be added to support 2 browser versions behind all current browsers’
 * versions. Lastly, the final CSS file is passed through two levels of compression:
 * “outputStyle” from Sass and compressCSS().
 */
gulp.task('compileCSSForProd', function () {
    return gulp.src(sassMainFile)
        .pipe(sass({
            outputStyle: 'compressed',
            precision: 10
        }).on('error', sass.logError))
        .pipe(browserSpecificPrefixGenerator({
            browsers: ['last 2 versions']
        }))
        .pipe(CSSCompressor())
        .pipe(gulp.dest(cssProdDestinationFolder));
});

/**
 * CONCATENATE JAVASCRIPT FILES
 *
 * This task concatenates all the files in the preConcatenatedJSFiles array, using
 * the JSConcatenator, then writes the result to the JSDevTargetFolder with the
 * filename value to the JSTargetFilename variable.
 */
gulp.task('concatenateJSFiles', function () {
    return gulp.src(preConcatenatedJSFiles)
        .pipe(JSConcatenator(JSTargetFilename))
        .pipe(gulp.dest(JSDevTargetFolder));
});

/**
 * CONCATENATE JAVASCRIPT FOR PRODUCTION
 *
 * This task compiles one or more JavaScript files into a single file whose name is
 * the value to the JSTargetFilename variable. The resulting file is compressed then
 * written to the JSProdTargetFolder.
 *
 * Note: This task does not contain the grid used during development.
 */
gulp.task('concatenateJSForProd', ['concatenateJSFiles'], function () {
    return gulp.src(JSDevTargetFolder + '/' + JSTargetFilename)
        .pipe(JSCompressor())
        .pipe(gulp.dest(JSProdTargetFolder));
});

/**
 * LINT JAVASCRIPT
 *
 * This task lints JavaScript (JS) using the linter defined by JSLinter, the second
 * pipe in this task. (ESLint is the linter in this case.) In order to generate a
 * linting report, the multiple JS files in the preConcatenatedJSFiles are
 * compiled into a single, memory-cached file with a temporary name, then sent to the
 * linter for processing.
 *
 * Note: The temporary file is *not* written to a destination folder.
 */
gulp.task('lintJS', function () {
    return gulp.src(preConcatenatedJSFiles)
        .pipe(JSConcatenator(JSTargetFilename))
        .pipe(JSLinter({
            'rules': {
                'indent': [2, 4],
                'quotes': [2, 'single'],
                'linebreak-style': [2, 'unix'],
                'semi': [2, 'always'],
                'max-len': [2, 85,4]
            },
            'env': {
                'node': true,
                'browser': true
            },
            'extends': 'eslint:recommended'
        }))
        .pipe(JSLinter.formatEach('compact', process.stderr))
        //
        // “To have the process exit with an error code (1) on lint error, return the
        //  stream and pipe to failAfterError last.”
        //
        //     — https://github.com/adametry/gulp-eslint
        //
        .pipe(JSLinter.failAfterError());
});

/**
 * COMPRESS THEN COPY IMAGES TO THE PRODUCTION FOLDER
 *
 * This task sources all the images in the devSourceFolder, compresses PNGs and JPGs,
 * then copies the final compressed images to the prodTargetFolder.
 */
gulp.task('compressThenCopyImagesToProdFolder', function () {
    return gulp.src(devSourceFolder + '/' + imagesFolder + '/**/*')
        .pipe(tempCache(
            imageCompressor({
                optimizationLevel: 3, // For PNG files. Accepts 0 – 7; 3 is default.
                progressive: true,    // For JPG files.
                multipass: false,     // For SVG files. Set to true for compression.
                interlaced: false     // For GIF files. Set to true for compression.
            })
        ))
        .pipe(gulp.dest(prodTargetFolder + '/' + imagesFolder));
});

/**
 * COPY UNPROCESSED ASSETS TO THE PRODUCTION FOLDER
 *
 * This task copies all unprocessed assets in the devSourceFolder to the
 * prodTargetFolder that aren’t images, JavaScript, or Sass/CSS. This is because
 * those files are processed by other tasks, then copied after processing:
 *
 * — Images are compressed then copied by the compressThenCopyImagesToProdFolder task
 * — JavaScript is concatenated and compressed by the concatenateJSForProd task
 * — Sass/CSS is concatenated and compressed by the compileCSSForProd task
 */
gulp.task('copyUnprocessedAssetsToProdFolder', function () {
    return gulp.src([
        devSourceFolder + '/*.*',                              // Source all files,
        devSourceFolder + '/**',                               // and all folders,but
        '!' + devSourceFolder + '/' + imagesFolder,            // ignore images;
        '!' + devSourceFolder + '/**/*.js',                    // ignore JS;
        '!' + devSourceFolder + '/' + sassCSSFolder + '/**',   // ignore Sass/CSS.
        '!' + devSourceFolder + '/' + HTMLSourceFolder + '/**' // ignore HTML files
                                                               // that have already
                                                               // been processed.
    ], {dot: true}).pipe(gulp.dest(prodTargetFolder));
});

/**
 * BUILD
 *
 * This task validates HTML, lints JavaScript, compiles any files that require
 * pre-processing, then copies the pre-processed and unprocessed files to the
 * prodTargetFolder.
 */
gulp.task('build',
    [
        'validateHTML',
        'compressHTML',
        'compileCSSForProd',
        'lintJS',
        'concatenateJSForProd',
        'compressThenCopyImagesToProdFolder',
        'copyUnprocessedAssetsToProdFolder'
    ]);

/**
 * SERVE
 *
 * Used for development only, this task compiles CSS via Sass, concatenates one or
 * more JavaScript (JS) files into a single file, lints it, then, finally, validates
 * HTML.
 *
 * The localhost server looks for index.html from either the devTargetFolder or
 * the devSourceFolder as the first page to load. In this case, index.html is
 * *only* found in the devTargetFolder.
 *
 * Because Gulp uses a stream-based system over a file-based system, files that
 * require pre-processing must be written to a folder before being served.
 * Thus, this task serves HTML, CSS, and JavaScript from a temp folder, the
 * development target folder (devTargetFolder), while un-processed files, such
 * as fonts and images, are served from the development source folder
 * (devSourceFolder).
 *
 * If a JavaScript file is changed, all JavaScript files are rebuilt, the
 * resulting file is linted, and the browser reloads. The same goes for HTML.
 *
 * If a Sass file is changed, a re-compilation of the primary CSS file is
 * generated, and the browser reloads.
 *
 * Finally, changes to images also trigger a browser reload.
 */
gulp.task('serve',
    [
        'validateHTML',
        'compileCSSForDev',
        'concatenateJSFiles',
        'lintJS'
    ],
    function () {
        browserSync({
            notify: true,
            port: 9000,
            reloadDelay: 100,
            server: {
                baseDir: [
                    devSourceFolder,
                    devTargetFolder,
                    devSourceFolder + '/' + HTMLSourceFolder
                ]
            },
            browser: browserPref //Adding browser Preference option to browserSync
        });

        gulp.watch(devSourceFolder + '/' + JSFolder + '/*.js',
            ['concatenateJSFiles', 'lintJS']).on(
            'change',
            reload
        );

        gulp.watch(devSourceFolder + '/' + imagesFolder + '/**/*').on(
            'change',
            reload
        );

        gulp.watch(devSourceFolder + '/' + HTMLSourceFolder + '/**/*.html',
            ['validateHTML']).on(
            'change',
            reload
        );

        gulp.watch(devSourceFolder + '/' + sassCSSFolder + '/**/*.scss',
            ['compileCSSForDev']).on(
            'change',
            reload
        );
    });

/**
 * CLEAN
 *
 * This tasks deletes the devTargetFolder and prodTargetFolder directories, both of
 * which are expendable, since Gulp can re-build them at any moment.
 */
gulp.task('clean', function () {
    var fs = require('fs');

    for (var i = 0; i < expendableFolders.length; i++ ) {
        try {
            fs.accessSync(expendableFolders[i], fs.F_OK);
            process.stdout.write('\n\tThe ' + expendableFolders[i] +
                ' directory was found and will be deleted.\n');
            del(expendableFolders[i]);
        } catch (e) {
            process.stdout.write('\n\tThe ' + expendableFolders[i] +
                ' directory does NOT exist or is NOT accessible.\n');
        }
    }

    process.stdout.write('\n');
});

/**
 * DEFAULT
 *
 * This task does nothing. See the output message below.
 */
gulp.task('default', function () {
    process.stdout.write('\n\tThis default gulp task does nothing except generate ' +
        'this message.\n\tRun “gulp --tasks” to see the available tasks.\n\n');
});
