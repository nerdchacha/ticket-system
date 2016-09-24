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
	sass: 'src/sass/**/*.scss',
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
				'src/js/angular-grid.js',
				'src/js/yg-modal.js'
			],
	js: 	[
				'src/js/app.js',
				'src/js/directives/directive.js',
				'src/js/services/TicketsService.js',
				'src/js/services/CommonService.js',
				'src/js/services/UsersService.js',
				'src/js/services/Authentication.js',
				'src/js/services/HelperService.js',
				'src/js/services/ActionService.js',
				'src/js/controllers/**/*.js'
				// 'src/js/controllers/Ticket/TicketsCtrl.js',
				// 'src/js/controllers/Ticket/NewTicketCtrl.js',
				// 'src/js/controllers/Ticket/TaskCtrl.js',
				// 'src/js/controllers/Ticket/ViewTicketCtrl.js',
				// 'src/js/controllers/Ticket/EditTicketCtrl.js',
				// 'src/js/controllers/MainCtrl.js',
				// 'src/js/controllers/User/LoginCtrl.js',
				// 'src/js/controllers/User/MainLoginCtrl.js',
				// 'src/js/controllers/User/ProfileCtrl.js',
				// 'src/js/controllers/User/RegisterCtrl.js',
				// 'src/js/controllers/User/SetUserCtrl.js',
				// 'src/js/controllers/Admin/ManageUsersCtrl.js'
			]
};

var output = {
	js: 'public/javascripts',
	css: 'public/stylesheets',
	miniCss: 'main.min.css',
	miniJs: 'main.min.js',
	miniDepsJs: 'dependencies.min.js',	
	html: 'public/templates/**/*.html'
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


