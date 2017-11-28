'use strict';
const
	gulp = require( 'gulp' ),
	sass = require( 'gulp-sass' ),
	babel = require( 'gulp-babel' ),
	browserSync = require( 'browser-sync' ),
	concat = require( 'gulp-concat' ),
	uglify = require( 'gulp-uglify' ),
	cssnano = require( 'gulp-cssnano' ),
	rename = require( 'gulp-rename' ),
	sourcemaps = require('gulp-sourcemaps'),
	path = {
		app: 'app/',
		dist: 'dist/'
	};


gulp

	.task( 'sass',() => gulp.src( path.app + 'sass/**/*.+(sass|scss)')
		.pipe( sourcemaps.init() )
		.pipe( sass({ outputStyle: 'compressed' }) ).on( 'error', sass.logError )
		.pipe( sourcemaps.write() )
		.pipe( rename( {'suffix':'.min'} ) )
		.pipe( gulp.dest( path.app + 'css') )
		.pipe( browserSync.reload({ stream:!0 }) ) )


	.task( 'js', () => gulp.src( path.app + 'js-es6/**/*.js' )
		.pipe( babel({
			presets: ['env']
		}) ).on('error', function(err){
			console.log('[Compilation Error]');
			console.log(err.fileName + ( err.loc ? `( ${err.loc.line}, ${err.loc.column} ): ` : ': '));
			console.log('error Babel: ' + err.message + '\n');
			console.log(err.codeFrame);
			this.emit('end');
		})
		.pipe( concat( 'main.min.js' ) )
		.pipe( uglify() )
		.pipe( gulp.dest( path.app + 'js') ) )

	.task( 'browser-sync', ()=>{
		browserSync({
			server: {
				baseDir: path.app
			}
			// notify: false
		});
	})

	.task( 'vendor-css',() => gulp.src( [
			'node_modules/angular-material/angular-material.min.css'
		] )
		.pipe( sourcemaps.init() )
		.pipe( concat( 'vendor.min.css' ) )
		.pipe( cssnano() )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( path.app + 'css') ) )

	.task( 'vendor-js',() => gulp.src( [
			'node_modules/angular/angular.min.js',
			'node_modules/angular-material/angular-material.min.js'
		] )
		.pipe( concat( 'vendor.min.js') )
		.pipe( uglify() )
		.pipe( gulp.dest( path.app + 'js' ) ) )


	.task( 'vendor',[ 'vendor-css','vendor-js' ])



	.task( 'watch-js',['js'],(done)=>{
		browserSync.reload();
		done();
	} )


	.task( 'build',['sass','js','vendor'])


	.task( 'watch', ()=>{
		gulp.watch( path.app + 'sass/**/*.+(sass|scss)', ['sass'] );
		gulp.watch( path.app + 'js/**/*.js', ['watch-js'] );
		gulp.watch( path.app + '**/*.html',() => {
			browserSync.reload();
		} );
	})

	.task( 'ease', ['sass','js','browser-sync','watch'])

	.task( 'default',['build','browser-sync','watch']);