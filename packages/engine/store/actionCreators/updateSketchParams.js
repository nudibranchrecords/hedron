"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdateSketchParams = void 0;
const types_1 = require("@hedron/engine/store/types");
const createUniqueId_1 = require("@hedron/engine/utils/createUniqueId");
const createUpdateSketchParams = (setState) => (sketchId) => {
    setState((state) => {
        var _a;
        const sketch = state.sketches[sketchId];
        if (!sketch) {
            throw new Error(`Sketch with id ${sketchId} not found.`);
        }
        const moduleId = sketch.moduleId;
        const { config } = state.sketchModules[moduleId];
        const existingParamIds = new Set(sketch.paramIds);
        const newParamIds = [];
        // 1. Add new params that are in the new config but not in the current sketch.
        for (const paramConfig of config.params) {
            const valueType = (_a = paramConfig.valueType) !== null && _a !== void 0 ? _a : types_1.NodeTypes.Number;
            const { key, defaultValue } = paramConfig;
            // Find existing node for this key, if any.
            let paramId = Array.from(existingParamIds).find((id) => { var _a; return ((_a = state.nodes[id]) === null || _a === void 0 ? void 0 : _a.key) === key; });
            // If no existing node, create a new one.
            if (!paramId) {
                paramId = (0, createUniqueId_1.createUniqueId)();
                state.nodes[paramId] = {
                    id: paramId,
                    key,
                    type: 'param',
                    valueType,
                    sketchId,
                };
                // Set the default value if it matches the valueType.
                if ((typeof defaultValue === 'number' && valueType === types_1.NodeTypes.Number) ||
                    (typeof defaultValue === 'boolean' && valueType === types_1.NodeTypes.Boolean) ||
                    (typeof defaultValue === 'string' && valueType === types_1.NodeTypes.Enum)) {
                    state.nodeValues[paramId] = defaultValue;
                }
                else {
                    throw new Error(`valueType of param ${paramConfig.key} does not match defaultValue for sketch ${moduleId}`);
                }
            }
            // Add this paramId to the new list.
            newParamIds.push(paramId);
            existingParamIds.delete(paramId); // Remove from the set of existing IDs, indicating it's still valid.
        }
        // 2. Remove params that are no longer in the new config.
        for (const oldParamId of existingParamIds) {
            delete state.nodes[oldParamId];
            delete state.nodeValues[oldParamId];
        }
        // 3. Update the sketch with the new list of param IDs.
        sketch.paramIds = newParamIds;
    });
};
exports.createUpdateSketchParams = createUpdateSketchParams;
