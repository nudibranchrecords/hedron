export function threshold(val, m) {

	if (val > m) {
		return val;
	} else {
		return 0;
	}

}

export function gain(val, m) {

	// If gain is at 0.5, val stays the same
	return Math.min(val * m * 2, 1);

}

export function range(val, m) {

	return val * m;

}

export function rangeStart(val, m) {

	return val + m;

}