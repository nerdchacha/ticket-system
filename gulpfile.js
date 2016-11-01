var gulp 		= require('gulp'),
	sass		= require('gulp-sass'),
	concat		= require('gulp-concat'),
	watch		= require('gulp-watch'),
	plumber		= require('gulp-plumber'),
	minifyCss	= require('gulp-minify-css'),
	uglify		= require('gulp-uglify'),
	sourcemaps	= require('gulp-sourcemaps'),
	autoprefixer= require('gulp-autoprefixer'),
	browserSync = require('browser-sync');

var input = {
	sass: 'client/src/sass/**/*.scss',
	depsjs: [
				'bower_components/jquery/dist/jquery.js',
				'bower_components/bootstrap/dist/js/bootstrap.js',
				'bower_components/angular/angular.min.js',
				'bower_components/angular-route/angular-route.min.js',
				'bower_components/textAngular/dist/textAngular-rangy.min.js',
				'bower_components/textAngular/dist/textAngular-sanitize.min.js',
				'bower_components/textAngular/dist/textAngular.min.js',
				'bower_components/angular-flash-alert/dist/angular-flash.min.js',
				'bower_components/angular-ui-router/release/angular-ui-router.js',
				'bower_components/chart.js/dist/Chart.min.js',
				'client/src/js/angular-grid.js',
				'client/src/js/angular-multi-select.js',
				'client/src/js/yg-modal.js',
				'client/src/js/yg-notification.js'
			],
	js: 	[
				'client/src/js/app.js',
				'client/src/js/directives/directive.js',
				'client/src/js/services/TicketsService.js',
				'client/src/js/services/CommonService.js',
				'client/src/js/services/UsersService.js',
				'client/src/js/services/Authentication.js',
				'client/src/js/services/HelperService.js',
				'client/src/js/services/ActionService.js',
				'client/src/js/controllers/**/*.js'
			]
};

var output = {
	js: 'client/public/javascripts',
	css: 'client/public/stylesheets',
	miniCss: 'main.min.css',
	miniJs: 'main.min.js',
	miniDepsJs: 'dependencies.min.js',	
	html: 'client/public/templates/**/*.html'
};


//----------------------------------------------------
//--------------- Error Handelr ----------------------
//----------------------------------------------------

var onError = function(err){
	console.log(err);
	this.emit('end');
}


//----------------------------------------------------
//--------------------- Sass -------------------------
//----------------------------------------------------

gulp.task('sass',function(){
	return gulp.src(input.sass)
	.pipe(plumber({
		errorHandler: onError
	}))
	.pipe(sass())
	.pipe(autoprefixer())
	.pipe(concat(output.miniCss))
	.pipe(gulp.dest(output.css))
	.pipe(minifyCss())
	.pipe(sourcemaps.init())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(output.css));
	// .pipe(browserSync.reload({stream: true}));
});


//----------------------------------------------------
//---------------------- JS --------------------------
//----------------------------------------------------

gulp.task('js',function(){
	return gulp.src(input.js)
	.pipe(plumber({
		errorHandler: onError
	}))
	.pipe(uglify())
	.pipe(concat(output.miniJs))
	.pipe(sourcemaps.init())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(output.js));
	// .pipe(browserSync.reload({stream: true}));
});

gulp.task('depsjs',function(){
	return gulp.src(input.depsjs)
	.pipe(plumber({
		errorHandler: onError
	}))
	// .pipe(uglify())
	.pipe(concat(output.miniDepsJs))
	.pipe(sourcemaps.init())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(output.js));
});



//----------------------------------------------------
//--------------------- Watch ------------------------
//----------------------------------------------------

gulp.task('watch', function(){
    // browserSync.init({
    //     server: {
    //         baseDir: "./"
    //     }
    // });
    gulp.watch(input.sass, ['sass']);
    gulp.watch(input.js, ['js']);
    gulp.watch(input.depsjs, ['depsjs']);
    // gulp.watch(output.html).on('change', browserSync.reload);
});


//----------------------------------------------------
//---------------------- Task ------------------------
//----------------------------------------------------

gulp.task('default',['watch','sass','js','depsjs']);


