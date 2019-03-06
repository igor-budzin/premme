var gulp = require("gulp"),
	sass = require("gulp-sass"),
	postcss = require("gulp-postcss"),
	autoprefixer = require("autoprefixer"),
	cssnano = require("cssnano"),
	sourcemaps = require("gulp-sourcemaps"),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	browserSync = require("browser-sync").create();

var paths = {
	styles: {
		src: "src/scss/*.scss",
		dest: "dist/css"
	},
	images: {
		src: 'src/images/*.+(png|jpg|gif|svg)',
		dest: 'dist/images'
	},
	html: {
		src: 'src/*.html',
		dest: 'dist'
	}
};

function style() {
	return gulp
		.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());
}

function image() {
	return gulp
		.src(paths.images.src)
		.pipe(gulp.dest(paths.images.dest))
		.pipe(browserSync.stream());
}

function reload(done) {
	browserSync.reload();
	done();
}

function html() {
	return gulp
		.src(paths.html.src)
		.pipe(gulp.dest(paths.html.dest))
		.pipe(browserSync.stream());
}

function watch() {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
	gulp.watch(paths.styles.src, style);
	gulp.watch(paths.html.src, html);
	gulp.watch(paths.images.src, image);
}

exports.watch = watch
exports.style = style;
exports.image = image;
exports.html = html;

var build = gulp.parallel(style, html, image, watch);

gulp.task('default', build);