module.exports = function(control, val) {

	if (val < control) {
		return val;
	} else {
		return 0;
	}

}