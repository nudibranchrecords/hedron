"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSetSketchModuleItem = void 0;
const createSetSketchModuleItem = (setState) => (newItem) => {
    setState((state) => {
        state.sketchModules[newItem.moduleId] = newItem;
    });
};
exports.createSetSketchModuleItem = createSetSketchModuleItem;
