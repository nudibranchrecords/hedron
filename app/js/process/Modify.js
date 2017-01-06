import * as Modifiers from './Modifiers';

class Modify {
	modifyInput(value, modifierArray) {

		for (let i = 0; i < modifierArray.length; i++) {

			const m = parseFloat(modifierArray[i].m);
			const modifyFunction = Modifiers[modifierArray[i].id];

			if (modifyFunction) {
				value = modifyFunction(value, m);
			} else {
				console.error('Modifier not recognised: ', modifierArray[i].id)
			}
			
		}

		return value;

	}
}

export default new Modify();