'use strict';
const
	gulp = require( 'gulp' ),
	sass = require( 'gulp-sass' ),
	browserSync = require( 'browser-sync' ),
	concat = require( 'gulp-concat' ),
	uglify = require( 'gulp-uglify' ),
	cssnano = require( 'gulp-cssnano' ),
	rename = require( 'gulp-rename' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	babelify = require( 'babelify' ),
	browserify = require( 'browserify' ),
	source = require( 'vinyl-source-stream' ),
	buffer = require( 'vinyl-buffer' ),
	del = require( 'del' ),
	cached = require( 'gulp-cached' ),
	path = {
		app: 'app/',
		bower: 'bower_components/',
		dist: 'dist/'
	},
	log = require( './gulp/log' );



gulp

	.task( 'sass',() => gulp.src( path.app + 'sass/**/*.+(sass|scss)' )
		.pipe( sourcemaps.init() )
		.pipe( cached() )
		.pipe( sass({ outputStyle: 'compressed' }) ).on( 'error', sass.logError )
		.pipe( rename( {'suffix':'.min'} ) )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( path.dist + 'css' ) )
		.pipe( browserSync.reload({ stream:!0 }) )
	)

	.task( 'browserify', () => browserify( {
		entries:[ path.app + 'js-es6/app.js'],
		debug: true,
		cache: {},
		packageCache: {}
	})
		.transform("babelify", {presets: ['env', 'react']})
		.bundle().on("error", log)
		.pipe( source( 'main.min.js' ) )
		.pipe( buffer() )
		.pipe( sourcemaps.init( {loadMaps: true} ) )
		.pipe( uglify() )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( path.dist + 'js' ) )
	)

	.task( 'html',() => gulp.src( path.app + '**/*.html' ).pipe( gulp.dest( path.dist ) ))
	.task( 'browser-sync-start',[ 'build' ], () => {
		browserSync({ server: {baseDir: path.dist } });
	})

	.task( 'browser-sync',['html','browserify','sass'], () => {
		browserSync({ server: { baseDir: path.dist } });
	})

	.task( 'vendor-css',() => gulp.src( [
			path.bower + 'angular-material/angular-material.min.css'
		] )
		.pipe( concat( 'vendor.min.css' ) )
		.pipe( cssnano() )
		.pipe( gulp.dest( path.dist + 'css' ) ) )

	.task( 'vendor-js',() => gulp.src( [
			path.bower + 'angular/angular.min.js',
			path.bower + 'angular-aria/angular-aria.min.js',
			path.bower + 'angular-animate/angular-animate.min.js',
			path.bower + 'angular-material/angular-material.min.js',
			path.bower + 'angular-messages/angular-messages.min.js',
			path.bower + 'angular-resource/angular-resource.min.js',
			path.bower + 'angular-ui-router/release/angular-ui-router.min.js',
		] )
		.pipe( concat( 'vendor.min.js' ) )
		// .pipe( uglify() )
		.pipe( gulp.dest( path.dist + 'js' ) )
	)


	.task( 'vendor',[ 'vendor-css','vendor-js' ])

	.task( 'img', () => gulp.src( path.app + 'img/**/*' ).pipe( gulp.dest( path.dist + 'img' ) ) )

	.task( 'clean', () => del( path.dist ) )

	.task( 'build',['html','sass','browserify','img','vendor'])

	.task( 'html-watch', [ 'html' ],( done ) => {
		browserSync.reload();
		done();
	})
	.task( 'js-watch', [ 'browserify' ],( done ) => {
		browserSync.reload();
		done();
	})


	.task( 'watch',['sass','browserify'], () => {
		gulp.watch( path.app + 'sass/**/*.+(sass|scss)', ['sass'] );
		gulp.watch( path.app + 'js-es6/**/*.js', ['js-watch']);
		gulp.watch( path.app + '**/*.html',['html-watch']);
	})

	.task( 'dev', ['html', 'sass', 'browserify', 'browser-sync','watch'])

	.task( 'default', ['build','browser-sync-start','watch']);