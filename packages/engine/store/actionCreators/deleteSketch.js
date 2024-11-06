"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeleteSketch = void 0;
const createDeleteSketch = (setState) => (instanceId) => setState((state) => {
    state.sketches[instanceId].paramIds.forEach((paramId) => {
        delete state.nodes[paramId];
        delete state.nodeValues[paramId];
    });
    delete state.sketches[instanceId];
});
exports.createDeleteSketch = createDeleteSketch;
