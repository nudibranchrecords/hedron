"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSketchesOfModuleId = void 0;
const getSketchesOfModuleId = (state, moduleId) => Object.values(state.sketches).filter((sketch) => sketch.moduleId === moduleId);
exports.getSketchesOfModuleId = getSketchesOfModuleId;
