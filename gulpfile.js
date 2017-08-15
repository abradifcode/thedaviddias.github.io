const child = require('child_process');
const browserSync = require('browser-sync');

const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps');
const svgSprite = require("gulp-svg-sprites");
const shell = require('gulp-shell');

const siteRoot = '_site';
const cssFiles = './_assets/scss/**/*.?(s)css';

gulp.task('styles', () => {
  gulp.src(['./_assets/scss/main.scss', './_assets/scss/critical.scss', './_assets/scss/amp.scss'])
    .pipe(plumber((error) => {
      console.log(error);
      this.emit('end');
    }))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))    
    .pipe(gulp.dest('./_assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('jekyll-build', shell.task(['jekyll build --watch --drafts --incremental --config config/shared/_config.yml']))

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

gulp.task('jekyll-serve', () => {

  browserSync.init({
    files: [siteRoot + '/**'],    
    port: 4000,
    open: false,
    server: {
      baseDir: siteRoot
    },
    injectChanges: true,
    timestamps: false
  })
  // WATCH
    // gulp.watch('_site/**/*.*').on('change', browserSync.reload)
    // gulp.watch('_assets/css/main.css').on('change', browserSync.reload)    
    // gulp.watch(['index.html', '_layouts/*.html', '_posts/*', '**/*.html', 'js/**/*', 'images/*']);


});

gulp.task('watch', function () {
    gulp.watch(cssFiles, ['styles'])
});

gulp.task('minify', ['jekyll-build'], () => {
  return gulp.src([path.join(deploy, '*.html'),path.join(deploy, '*/*/*/*.html')]/*'*.html'*/)
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyJS: true      
    }))
    .pipe(gulp.dest(deploy))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('build-site',
  ['styles'],
  shell.task('JEKYLL_ENV=production jekyll build --config config/shared/_config.yml,config/production/_config.yml')
)

gulp.task('default', [
  'styles', 'jekyll-build', 'jekyll-serve', 'watch'
]);

gulp.task('build-production', [
    'styles', 'build-site', 'minify'
]);