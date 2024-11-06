"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenToStore = void 0;
const listenToStore = (store, addSketch, removeSketch) => store.subscribe((state) => state.sketches, (sketches, previousSketches) => {
    Object.keys(previousSketches).forEach((prevId) => {
        if (!sketches[prevId]) {
            removeSketch(prevId);
        }
    });
    Object.keys(sketches).forEach((id) => {
        if (!previousSketches[id]) {
            addSketch(id, sketches[id].moduleId);
        }
    });
});
exports.listenToStore = listenToStore;
