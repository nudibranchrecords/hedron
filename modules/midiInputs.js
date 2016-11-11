var inputs = require('./inputs');

module.exports = new MidiInputs;

function MidiInputs() {

    var _self = this;
    this.inputs = [];

    navigator.requestMIDIAccess().then( function( midiAccess ) {

        midiAccess.inputs.forEach( function(entry) {
            console.log(entry);

            entry.onmidimessage = function(message) {

                var id = message.data[0].toString() + message.data[1].toString();
                var val = message.data[2] / 127;

                console.log(id, val);

                inputs.onMidiInput(id, val);

            };
        });

    });

}