"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeleteSketchModule = void 0;
const createDeleteSketchModule = (setState) => (moduleId) => {
    setState((state) => {
        delete state.sketchModules[moduleId];
    });
};
exports.createDeleteSketchModule = createDeleteSketchModule;
