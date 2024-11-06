"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addScene = exports.engineScenes = void 0;
const EngineScene_1 = require("@hedron/engine/world/EngineScene");
exports.engineScenes = new Map();
const addScene = (sceneId) => {
    const newScene = new EngineScene_1.EngineScene();
    exports.engineScenes.set(sceneId, newScene);
    // renderer.setSize()
    // if (shouldSetPost) renderer.setPostProcessing()
    return newScene;
};
exports.addScene = addScene;
