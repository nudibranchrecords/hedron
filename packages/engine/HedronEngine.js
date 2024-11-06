"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HedronEngine = void 0;
const importSketchModule_1 = require("./importSketchModule");
const storeListener_1 = require("./storeListener");
const stripForSave_1 = require("@utils/stripForSave");
const Renderer_1 = require("@world/Renderer");
const SketchManager_1 = require("@world/SketchManager");
const debugScene_1 = require("@world/debugScene");
const getSketchesOfModuleId_1 = require("@store/selectors/getSketchesOfModuleId");
const engineStore_1 = require("@store/engineStore");
class HedronEngine {
    constructor() {
        this.sketchesUrl = null;
        this.removeSketchModule = (moduleId) => __awaiter(this, void 0, void 0, function* () {
            this.store.getState().deleteSketchModule(moduleId);
        });
        this.store = (0, engineStore_1.createEngineStore)();
        this.sketchManager = new SketchManager_1.SketchManager();
        this.renderer = new Renderer_1.Renderer();
    }
    setSketchesUrl(sketchesUrl) {
        this.sketchesUrl = sketchesUrl;
        const { removeSketchFromScene } = this.sketchManager;
        const addSketchToScene = (sketchId, moduleId) => {
            const modules = this.store.getState().sketchModules;
            const module = modules[moduleId].module;
            this.sketchManager.addSketchToScene(sketchId, module);
        };
        (0, storeListener_1.listenToStore)(this.store, addSketchToScene, removeSketchFromScene);
    }
    initiateSketchModules(moduleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const moduleId of moduleIds) {
                yield this.addSketchModule(moduleId);
            }
            this.store.setState({ isSketchModulesReady: true });
        });
    }
    addSketchModule(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sketchesUrl)
                throw new Error('Sketches URL not ready');
            const moduleItem = yield (0, importSketchModule_1.importSketchModule)(this.sketchesUrl, moduleId);
            this.store.getState().setSketchModuleItem(moduleItem);
            return moduleItem;
        });
    }
    reimportSketchModuleAndReloadSketches(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleItem = yield this.addSketchModule(moduleId);
            const sketchesToRefresh = (0, getSketchesOfModuleId_1.getSketchesOfModuleId)(this.store.getState(), moduleId);
            for (const sketch of sketchesToRefresh) {
                this.sketchManager.removeSketchFromScene(sketch.id);
                this.sketchManager.addSketchToScene(sketch.id, moduleItem.module);
                this.store.getState().updateSketchParams(sketch.id);
            }
        });
    }
    createCanvas(containerEl) {
        return this.renderer.createCanvas(containerEl);
    }
    setOutput(container) {
        this.renderer.setOutput(container);
    }
    stopOutput() {
        this.renderer.stopOutput();
    }
    getStore() {
        return this.store;
    }
    getSaveData() {
        return (0, stripForSave_1.stripForSave)(this.store.getState());
    }
    run() {
        const debugScene = (0, debugScene_1.createDebugScene)(this.renderer);
        const loop = () => {
            const { sketches, nodeValues, nodes } = this.store.getState();
            const sketchInstances = this.sketchManager.getSketchInstances();
            debugScene.clearPasses();
            Object.values(sketches).forEach((sketch) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const paramValues = {};
                sketch.paramIds.forEach((id) => {
                    const value = nodeValues[id];
                    const paramKey = nodes[id].key;
                    paramValues[paramKey] = value;
                });
                const instance = sketchInstances[sketch.id];
                if (instance.getPasses) {
                    instance.getPasses(debugScene).forEach((pass) => {
                        debugScene.addPass(pass);
                    });
                }
                instance.update({ deltaFrame: 1, params: paramValues });
            });
            requestAnimationFrame(loop);
            if (debugScene) {
                this.renderer.render(debugScene);
            }
        };
        loop();
    }
}
exports.HedronEngine = HedronEngine;
