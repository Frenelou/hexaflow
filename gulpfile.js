var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('main', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('core', function () {
    return gulp.src('src/js/core.js')
        .pipe(gulp.dest('./'));
});

gulp.task('default', gulp.parallel('core', 'main'));
