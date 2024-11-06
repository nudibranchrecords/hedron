"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SketchManager = void 0;
const debugScene_1 = require("@hedron/engine/world/debugScene");
class SketchManager {
    constructor() {
        this.sketchInstances = {};
        this.createSketch = (instanceId, module) => {
            const sketch = new module();
            if (sketch.root) {
                sketch.root.name = instanceId;
            }
            this.sketchInstances[instanceId] = sketch;
            return sketch;
        };
        this.addSketchToScene = (instanceId, module) => {
            const scene = (0, debugScene_1.getDebugScene)().scene;
            const sketch = this.createSketch(instanceId, module);
            if (sketch.root) {
                scene.add(sketch.root);
            }
        };
        this.removeSketchFromScene = (instanceId) => {
            const scene = (0, debugScene_1.getDebugScene)().scene;
            const oldSketch = scene.getObjectByName(instanceId);
            if (!oldSketch) {
                throw new Error(`couldn't find sketch to remove: ${instanceId}`);
            }
            scene.remove(oldSketch);
            delete this.sketchInstances[instanceId];
        };
        this.getSketchInstances = () => {
            return this.sketchInstances;
        };
    }
}
exports.SketchManager = SketchManager;
