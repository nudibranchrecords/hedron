import gulp from 'gulp';
import Perf from 'react-addons-perf'

window.Perf = Perf;

gulp.task('reload', function () {
	if (location) location.reload();
});

gulp.task('css', function () {
	const styles = document.querySelectorAll('link[rel=stylesheet]');

	for (let i = 0; i < styles.length; i++) {
	  // reload styles
	  const restyled = styles[i].getAttribute('href') + '?v='+Math.random(0,10000);
	  styles[i].setAttribute('href', restyled);
	};
});


gulp.watch(['app/**/!(*.css)'], ['reload']);
gulp.watch(['app/css/*.css'], ['css']);