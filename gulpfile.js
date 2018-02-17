"use strict";

/* ----------------------------------------------------------------------------

                            BSD 3-Clause License

                        Copyright (c) 2018, wrightm-mac
                            All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  * Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived from
    this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

----------------------------------------------------------------------------- */

const gulp = require('gulp');
const clean = require('gulp-clean');
const del = require('del');
const concat = require('gulp-concat');
const less = require('gulp-less');
const babel = require('gulp-babel');
const minifyCss = require('gulp-clean-css');
const minify = require('gulp-minify-html');
const uglify = require('gulp-uglify');
const jsonmin = require('gulp-jsonmin');
const chalk = require('chalk');

let src = 'assets/';
let dest = 'public/';


gulp.task('clean:client', function() {
  return gulp.src('public', { read: false })
              .pipe(clean());
});

gulp.task('clean:server', function() {
  let sources = [
    'routes',
    'app.js'
  ];

  return gulp.src(sources, { read: false })
              .pipe(clean());
});

gulp.task('client:3rdParty', function() {
  gulp.src('assets/client/3rdparty/**/*.js')
    .pipe(gulp.dest('public/scripts'));

    gulp.src('assets/client/3rdparty/**/*.css')
    .pipe(gulp.dest('public/css'));
});

gulp.task('client:css:less', function() {
  gulp.src('assets/client/css/styles.less')
    .pipe(less())
    .pipe(minifyCss({ keepBreaks: false }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('client:css:images', function() {
  gulp.src('assets/client/css/images/*')
    .pipe(gulp.dest('public/css/images'));
});

gulp.task('client:css', ['client:css:less', 'client:css:images']);

gulp.task('client:data', function() {
  gulp.src('assets/client/data/**/*.json')
    .pipe(jsonmin())
    .pipe(gulp.dest('public/data'));
});

gulp.task('client:html', function() {
  gulp.src('assets/client/html/**/*.html')
    .pipe(minify())
    .pipe(gulp.dest('public'));
});

gulp.task('client:images', function() {
  gulp.src('assets/client/images/**/*')
    .pipe(gulp.dest('public/images'));

  gulp.src('assets/client/favicon.ico')
    .pipe(gulp.dest('public'));
});

gulp.task('client:scripts', function() {
  let sources = [
    'assets/client/scripts/**/*.js'
  ];

  gulp.src(sources)
    .pipe(babel({ presets: ['env'] }))
    .pipe(uglify())
    .pipe(concat('application.js'))
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('client:static:css', function() {
  gulp.src('assets/client/static/*.css')
    .pipe(minifyCss({ keepBreaks: false }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('client:static:scripts', function() {
  let sources = [
    'assets/client/static/**/*.js'
  ];

  gulp.src(sources)
    .pipe(babel({ presets: ['env'] }))
    .pipe(uglify())
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('client:fast', ['client:css', 'client:scripts']);

gulp.task('client:static', ['client:static:css', 'client:static:scripts']);

gulp.task('client', ['client:3rdParty', 'client:data', 'client:css', 'client:html', 'client:images', 'client:scripts', 'client:static']);

gulp.task('server:scripts', function() {
  let sources = [
    'assets/server/**/*.ts',
    'assets/server/**/*.js'
  ];

  gulp.src(sources)
    .pipe(babel({ presets: ['env'] }))
    .pipe(uglify())
    .pipe(gulp.dest(''));
});

gulp.task('server', ['server:scripts']);

gulp.task('_out:watchstart', function() {
  console.log(chalk.yellow('assets changed - starting rebuild...'));
});

gulp.task('_out:watchend', function() {
  console.log(chalk.yellow('...rebuild done!\n\n'));
});

gulp.task('watch', function() {
  console.log('Watching...');

  let watchFiles = [
    'assets/client/**',
    'assets/server/**',
    'assets/client/css/**/*.less',
    'assets/client/images/*',
    'assets/client/scripts/**/*.js',
    'assets/client/scripts/**/*.ts',
    'assets/server/lib/**/*.js',
    'assets/server/lib/**/*.ts'
  ];

  gulp.watch(watchFiles, ['_out:watchstart', 'build', '_out:watchend']);
});

gulp.task('clean', ['clean:client', 'clean:server']);

gulp.task('build:fast', ['client:fast', 'server']);

gulp.task('build', ['client', 'server']);

gulp.task('build:all', ['clean', 'build']);

gulp.task('default', ['build']);