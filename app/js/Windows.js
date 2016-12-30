import renderer from './engine/renderer.js';
import DisplaysStore from './stores/DisplaysStore';

class Windows {

	constructor() {

		nw.Screen.Init();

		this.externalDisplay = nw.Screen.screens[1];

		console.log(this.externalDisplay)

		const win = nw.Window.get();

		win.on('resize', function() {
			renderer.resize();
		})

		win.on('loaded', function() {
			win.maximize();
		})


		DisplaysStore.on('init', this.startOutput.bind(this));

	}

	startOutput() {

		if (this.externalDisplay) {

			nw.Window.open('app/output.html', {}, (win) => {

				const x = this.externalDisplay.bounds.x;
				const y = this.externalDisplay.bounds.y;

				win.moveTo(x,y);
				win.maximize();
				win.enterFullscreen()

				win.on('loaded', function() {

					renderer.initOutput(win.window.document.querySelector('#container'));

				})

				win.on('resize', function() {

					renderer.resizeOutput();

				})

			});

		}

	}

}

export default new Windows();