'use strict';
const
	gulp = require( 'gulp' ),
	sass = require( 'gulp-sass' ),
	browserSync = require( 'browser-sync' ),
	concat = require( 'gulp-concat' ),
	uglify = require( 'gulp-uglify' ),
	cssnano = require( 'gulp-cssnano' ),
	rename = require( 'gulp-rename' ),
	sourcemaps = require('gulp-sourcemaps'),
	babelify = require('babelify'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	path = {
		app: 'app/',
		bower: 'bower_components/',
		bundle: 'app/bundle/'
	};


gulp

	.task( 'sass',() => gulp.src( path.app + 'sass/**/*.+(sass|scss)')
		.pipe( sourcemaps.init() )
		.pipe( sass({ outputStyle: 'compressed' }) ).on( 'error', sass.logError )
		.pipe( sourcemaps.write() )
		.pipe( rename( {'suffix':'.min'} ) )
		.pipe( gulp.dest( path.bundle + 'css') )
		.pipe( browserSync.reload({ stream:!0 }) )
	)

	.task('browserify', () => browserify( { debug: true })
		.require( path.app + 'js-es6/app.js', { entry: true })
		.transform("babelify", {presets: ['env', 'react']})
		.bundle()
		.on("error", function (err) { console.log("Error: " + err.message); })
		.pipe(source('bundle.js'))
		.pipe(gulp.dest( path.bundle + 'js/'))
	)

	.task( 'js', ['browserify'],() => gulp.src( path.app + 'js-es6/**/*.js' )
		.pipe( sourcemaps.init() )
		.pipe( babel({
			presets: ['env']
		}) ).on('error', function(err){
			console.log('[Compilation Error]');
			console.log(err.fileName + ( err.loc ? `( ${err.loc.line}, ${err.loc.column} ): ` : ': '));
			console.log('error Babel: ' + err.message + '\n');
			console.log(err.codeFrame);
			this.emit('end');
		})
		// .pipe( concat( 'main.min.js' ) )
		.pipe( rename( {'suffix':'.min'} ) )
		.pipe( uglify() )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( path.bundle + 'js') )
	)

	.task( 'browser-sync', ()=>{
		browserSync({
			server: {
				baseDir: path.app
			}
			// notify: false
		});
	})

	.task( 'vendor-css',() => gulp.src( [
			path.bower + 'angular-material/angular-material.min.css'
		] )
		.pipe( sourcemaps.init() )
		.pipe( concat( 'vendor.min.css' ) )
		.pipe( cssnano() )
		.pipe( gulp.dest( path.bundle + 'css') ) )

	.task( 'vendor-js',() => gulp.src( [
			path.bower + 'angular/angular.min.js',
			path.bower + 'angular-aria/angular-aria.min.js',
			path.bower + 'angular-animate/angular-animate.min.js',
			path.bower + 'angular-material/angular-material.min.js',
			path.bower + 'angular-messages/angular-messages.min.js',
			path.bower + 'angular-resource/angular-resource.min.js',
			path.bower + 'angular-ui-router/release/angular-ui-router.min.js',
		] )
		.pipe( sourcemaps.init() )
		.pipe( concat( 'vendor.min.js') )
		// .pipe( uglify() )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( path.bundle + 'js' ) )
	)


	.task( 'vendor',[ 'vendor-css','vendor-js' ])



	.task( 'watch-js',['browserify'],(done)=>{
		browserSync.reload();
		done();
	} )


	.task( 'build',['sass','browserify','vendor'])


	.task( 'watch', ()=>{
		gulp.watch( path.app + 'sass/**/*.+(sass|scss)', ['sass'] );
		gulp.watch( path.app + 'js-es6/**/*.js', ['watch-js'] );
		gulp.watch( path.app + '**/*.html',() => {
			browserSync.reload();
		} );
	})

	.task( 'ease', ['sass','browserify','browser-sync','watch'])

	.task( 'default',['build','browser-sync','watch']);