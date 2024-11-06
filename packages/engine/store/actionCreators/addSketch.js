"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddSketch = void 0;
const types_1 = require("@hedron/engine/store/types");
const createUniqueId_1 = require("@hedron/engine/utils/createUniqueId");
const createAddSketch = (setState) => (moduleId) => {
    const newSketchId = (0, createUniqueId_1.createUniqueId)();
    setState((state) => {
        var _a;
        const { config } = state.sketchModules[moduleId];
        const paramIds = [];
        for (const paramConfig of config.params) {
            const valueType = (_a = paramConfig.valueType) !== null && _a !== void 0 ? _a : types_1.NodeTypes.Number;
            const { key, defaultValue } = paramConfig;
            const id = (0, createUniqueId_1.createUniqueId)();
            paramIds.push(id);
            state.nodes[id] = {
                id,
                key,
                type: 'param',
                valueType,
                sketchId: newSketchId,
            };
            if ((typeof defaultValue === 'number' && valueType === types_1.NodeTypes.Number) ||
                (typeof defaultValue === 'boolean' && valueType === types_1.NodeTypes.Boolean) ||
                (typeof defaultValue === 'string' && valueType === types_1.NodeTypes.Enum)) {
                state.nodeValues[id] = defaultValue;
            }
            else {
                throw new Error(`valueType of param ${paramConfig.key} does not match defaultValue for sketch ${moduleId}`);
            }
        }
        state.sketches[newSketchId] = {
            id: newSketchId,
            moduleId,
            title: config.title,
            paramIds,
        };
    });
    return newSketchId;
};
exports.createAddSketch = createAddSketch;
