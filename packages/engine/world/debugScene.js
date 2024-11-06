"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDebugScene = exports.getDebugScene = void 0;
// import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three'
const createUniqueId_1 = require("@hedron/engine/utils/createUniqueId");
const scenes_1 = require("@hedron/engine/world/scenes");
let debugScene;
const getDebugScene = () => {
    if (!debugScene)
        throw new Error('No sketches server url');
    return debugScene;
};
exports.getDebugScene = getDebugScene;
const createDebugScene = (renderer) => {
    const id = (0, createUniqueId_1.createUniqueId)();
    const scene = (0, scenes_1.addScene)(id);
    scene.setRatio(renderer.aspectRatio);
    if (!renderer.composer) {
        throw new Error("couldn't get renderer composer");
    }
    scene.renderer = renderer.composer.getRenderer();
    debugScene = scene;
    return debugScene;
};
exports.createDebugScene = createDebugScene;
