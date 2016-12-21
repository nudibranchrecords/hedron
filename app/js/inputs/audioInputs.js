import { EventEmitter } from 'events';

import AudioBandsStore from '../stores/AudioBandsStore';

class AudioInputs extends EventEmitter  {

    constructor() {

        super();

        this.input = false;

        const gotStream = ( stream ) => {
            this.input = new AudioInput( stream );
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

        if (this.input) {

            this.input.update();
             this.emit('updated');

        }

    }

    getData() {
        return this.input.levelsData;
    }

}

class AudioInput {

    constructor(stream) {

        const context = new window.AudioContext;
        const source = context.createMediaStreamSource( stream );

        this.numBands = AudioBandsStore.getCount();

        this.analyser = context.createAnalyser();
        this.freqs = new Uint8Array( this.analyser.frequencyBinCount );

        this.levelsData = [];

        source.connect( this.analyser );

        // Knocking off 500 redundant frequencies
        this.levelBins = Math.floor( ( this.analyser.frequencyBinCount - 500 ) / this.numBands );

    }

    update() {

        this.analyser.getByteFrequencyData( this.freqs );

        for ( let i = 0; i < this.numBands; i++ ) {

            let sum = 0;

            for ( let j = 0; j < this.levelBins; j++ ) {

                sum += this.freqs[ ( i * this.levelBins ) + j ];
            }

            this.levelsData[ i ] = Math.round((( sum / this.levelBins ) / 256)*1000)/1000;

        }

    }

}

const audioInputs = new AudioInputs;

window.audioInputs = audioInputs;

export default new AudioInputs;