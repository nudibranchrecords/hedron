"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineScene = void 0;
const postprocessing_1 = require("postprocessing");
const three_1 = require("three");
class EngineScene {
    constructor() {
        this.renderer = null;
        this.scene = new three_1.Scene();
        this.camera = new three_1.PerspectiveCamera(75, undefined, 0.1, 100000);
        this.camera.position.z = 5;
        this.renderPass = new postprocessing_1.RenderPass(this.scene, this.camera);
        this.passes = [this.renderPass];
    }
    setRatio(ratio) {
        this.camera.aspect = ratio;
        this.camera.updateProjectionMatrix();
    }
    addPass(pass) {
        this.passes.push(pass);
    }
    clearPasses() {
        this.passes = [this.renderPass];
    }
}
exports.EngineScene = EngineScene;
