import { EventEmitter } from 'events';

class KeyboardInput extends EventEmitter  {

    constructor() {
        
        super();

        window.addEventListener('keydown', (e) => {
            this.emit('keypress', e.key)
        })

    }

}

export default new KeyboardInput;
