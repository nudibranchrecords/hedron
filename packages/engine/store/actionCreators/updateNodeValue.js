"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdateNodeValue = void 0;
const createUpdateNodeValue = (setState) => (nodeId, value) => {
    setState((state) => {
        state.nodeValues[nodeId] = value;
    });
};
exports.createUpdateNodeValue = createUpdateNodeValue;
