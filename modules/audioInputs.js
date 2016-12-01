var numLevels = 4;

class AudioInputs {

    constructor() {

        this.inputs = [];

        const gotStream = ( stream ) => {
            this.inputs.push(new AudioInput( stream ));
        }

        navigator.getUserMedia( {
                audio: true
            },
            gotStream,
            function( err ) {
                console.log( "The following error occured: " + err );
            }
        );

      
    }

    update() {

        if (this.inputs.length) {
            return this.inputs[0].update();
        }

    }

    getLevels() {
        return this.inputs[0].getLevels();
    }

}

class AudioInput {

    constructor(stream) {

        const context = new window.AudioContext;
        const source = context.createMediaStreamSource( stream );

        this.analyser = context.createAnalyser();
        this.freqs = new Uint8Array( this.analyser.frequencyBinCount );

        this.levelsData = [];

        source.connect( this.analyser );

        // Knocking off 500 redundant frequencies
        this.levelBins = Math.floor( ( this.analyser.frequencyBinCount - 500 ) / numLevels );

    }

    getLevels() {

        return this.levelsData;

    }

    update() {

        this.analyser.getByteFrequencyData( this.freqs );

        for ( let i = 0; i < numLevels; i++ ) {

            let sum = 0;

            for ( let j = 0; j < this.levelBins; j++ ) {

                sum += this.freqs[ ( i * this.levelBins ) + j ];
            }

            this.levelsData[ i ] = ( sum / this.levelBins ) / 256;

        }

        return this.levelsData;

    }

}

export default new AudioInputs;