const child = require('child_process');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const svgSprite = require("gulp-svg-sprites");

const siteRoot = '_site';
const cssFiles = '_/assets/css/**/*.?(s)css';


/**
 * Build the Jekyll Site
 */
// gulp.task('jekyll-build', function (done) {
//     return child.spawn('jekyll', ['build'], {stdio: 'inherit'})
//         .on('close', done);
// });

gulp.task('css', () => {
  gulp.src('_/assets/css/main.scss')
    .pipe(plumber((error) => {
      console.log(error);
      this.emit('end');
    }))
    .pipe(sass())
    .pipe(gulp.dest(siteRoot + '/css'))
    .pipe(reload({ stream: true }));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['serve',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('sprites', function () {
  return gulp.src('_assets/img/icons/*.svg')
    .pipe(svgSprite({
      // preview: false,
      svg: {
        sprite: "img/icons/svg-sprite.svg"
      },
      cssFile: "css/base/_sprite.scss"
    }))
    .pipe(gulp.dest("_assets"));
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    open: false,
    server: {
      baseDir: siteRoot
    },
    logFileChanges: true,
    logConnections: false,
    injectChanges: true,
    timestamps: false,
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: false
    }
  });
});

gulp.task('html', ['jekyll'], () => {
  gulp.src([path.join(deploy, '*.html'),path.join(deploy, '*/*/*/*.html')]/*'*.html'*/)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(deploy))
    .pipe(browserSync.reload({stream:true, once: true}));
});


// WATCH
gulp.task('watch', function () {
    gulp.watch(cssFiles, ['css']);
    // gulp.watch(['index.html', '_layouts/*.html', '_posts/*', '**/*.html', 'js/**/*', 'images/*']);
});


gulp.task('default', ['css', 'jekyll', 'serve', 'watch']);