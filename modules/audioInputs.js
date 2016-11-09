var numLevels = 4;

module.exports = new AudioInputs;

function AudioInputs() {

    var _self = this;
    this.inputs = [];

    navigator.getUserMedia( {
            audio: true
        },
        gotStream,
        function( err ) {
            console.log( "The following error occured: " + err );
        }
    );

    function gotStream( stream ) {
        _self.inputs.push(new AudioInput( stream ));
    }

}

AudioInputs.prototype.update = function() {

    if (this.inputs.length) {
        return this.inputs[0].update();
    }
    

}

AudioInputs.prototype.getLevels = function() {

    return this.inputs[0].getLevels();

}

function AudioInput( stream ) {

    var context = new window.AudioContext;
    var source = context.createMediaStreamSource( stream );

    this.analyser = context.createAnalyser();
    this.freqs = new Uint8Array( this.analyser.frequencyBinCount );

    this.levelsData = [];

    source.connect( this.analyser );

    // Knocking off 500 redundant frequencies
    this.levelBins = Math.floor( ( this.analyser.frequencyBinCount - 500 ) / numLevels );


}

AudioInput.prototype.getLevels = function() {

    return this.levelsData;

}

AudioInput.prototype.update = function() {

    this.analyser.getByteFrequencyData( this.freqs );

    for ( var i = 0; i < numLevels; i++ ) {

        var sum = 0;

        for ( var j = 0; j < this.levelBins; j++ ) {

            sum += this.freqs[ ( i * this.levelBins ) + j ];
        }

        this.levelsData[ i ] = ( sum / this.levelBins ) / 256;

    }

    return this.levelsData;

}