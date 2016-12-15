import { EventEmitter } from 'events';

class MidiInputs extends EventEmitter  {

    constructor() {
        
        super();

        this.inputs = [];

        navigator.requestMIDIAccess().then(( midiAccess ) => {

            midiAccess.inputs.forEach((entry) => {

                console.log(entry);

                entry.onmidimessage = (message) => {

                    var id = message.data[0].toString() + message.data[1].toString();
                    var val = Math.round(message.data[2] / 127 * 1000)/1000;

                    this.emit('message', id, val);

                };
            });

        });

    }

}

export default new MidiInputs;
