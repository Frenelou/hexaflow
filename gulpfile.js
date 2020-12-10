var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('scripts', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./'));
});