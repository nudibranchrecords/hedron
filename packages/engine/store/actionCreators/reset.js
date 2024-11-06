"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReset = void 0;
const initialState_1 = require("@hedron/engine/store/initialState");
const createReset = (setState) => () => {
    setState(() => initialState_1.initialState);
};
exports.createReset = createReset;
