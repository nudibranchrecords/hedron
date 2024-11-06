"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const postprocessing_1 = require("postprocessing");
const three_1 = require("three");
const scenes_1 = require("@hedron/engine/world/scenes");
class Renderer {
    constructor() {
        this.rendererHeight = 0;
        this.rendererWidth = 0;
        this.aspectRatio = 1;
        this.isSendingOutput = false;
        this.setResizeObserver = (el) => {
            const resizeObserver = new ResizeObserver((0, lodash_debounce_1.default)(() => {
                this.setSize();
            }, 300));
            resizeObserver.observe(el);
        };
    }
    createCanvas(containerEl) {
        const renderer = new three_1.WebGLRenderer({
            antialias: false, // Antialiasing should be handled by the composer
        });
        this.composer = new postprocessing_1.EffectComposer(renderer);
        this.canvas = renderer.domElement;
        containerEl.innerHTML = '';
        containerEl.appendChild(this.canvas);
        this.viewerContainer = containerEl;
        this.setResizeObserver(containerEl);
    }
    setSize() {
        if (!this.composer)
            throw new Error('Renderer not set');
        if (!this.viewerContainer)
            throw new Error('viewerEl not set');
        const settings = {
            aspectW: 16,
            aspectH: 9,
        };
        let width, ratio;
        if (this.isSendingOutput) {
            if (!this.previewCanvas)
                throw new Error('previewCanvas not set');
            if (!this.outputCanvas)
                throw new Error('outputCanvas not set');
            if (!this.outputContainer)
                throw new Error('outputContainer not set');
            // Get width and ratio from output window
            width = this.outputContainer.offsetWidth;
            ratio = width / this.outputContainer.offsetHeight;
            this.previewCanvas.width = width;
            this.previewCanvas.height = width / ratio;
            this.outputCanvas.width = width;
            this.outputCanvas.height = width / ratio;
        }
        else {
            // Basic width and ratio if no output
            width = this.viewerContainer.offsetWidth;
            ratio = settings.aspectW / settings.aspectH;
        }
        const perc = 100 / ratio;
        const height = width / ratio;
        this.composer.setSize(width, height);
        // Set ratios for each scene
        scenes_1.engineScenes.forEach((scene) => {
            scene.setRatio(ratio);
        });
        this.rendererWidth = width;
        this.rendererHeight = height;
        // CSS trick to resize canvas
        this.viewerContainer.style.paddingBottom = perc + '%';
        this.aspectRatio = ratio;
    }
    // Set the output to a second canvas (e.g. a separate window for making full screen)
    setOutput(container) {
        this.stopOutput();
        this.outputContainer = container;
        if (!this.outputContainer)
            throw new Error("Can't find container");
        if (!this.canvas)
            throw new Error("Can't find canvas");
        if (!this.viewerContainer)
            throw new Error("Can't find viewerContainer");
        this.rendererHeight = this.outputContainer.offsetWidth;
        this.rendererWidth = this.outputContainer.offsetHeight;
        // Move renderer canvas to new output container
        this.outputContainer.appendChild(this.canvas);
        this.canvas.setAttribute('style', '');
        // Setup output canvas
        this.outputCanvas = this.canvas;
        // Setup preview canvas in dom
        this.previewCanvas = document.createElement('canvas');
        this.previewContext = this.previewCanvas.getContext('2d');
        this.viewerContainer.appendChild(this.previewCanvas);
        this.isSendingOutput = true;
        this.setResizeObserver(this.outputContainer);
    }
    copyPixels(context) {
        if (!this.canvas)
            throw new Error("Can't find canvas");
        context.drawImage(this.canvas, 0, 0, this.rendererWidth, this.rendererHeight);
    }
    stopOutput() {
        if (!this.isSendingOutput)
            return;
        if (!this.outputContainer)
            throw new Error("Can't find container");
        if (!this.canvas)
            throw new Error("Can't find canvas");
        if (!this.viewerContainer)
            throw new Error("Can't find viewerContainer");
        this.viewerContainer.innerHTML = '';
        this.canvas.setAttribute('style', '');
        this.viewerContainer.appendChild(this.canvas);
        this.isSendingOutput = false;
        this.setSize();
    }
    render(scene) {
        if (!this.composer)
            return;
        this.composer.removeAllPasses();
        this.composer.passes = scene.passes;
        for (let i = 0; i < scene.passes.length - 1; i++) {
            scene.passes[i].renderToScreen = false;
        }
        scene.passes[scene.passes.length - 1].renderToScreen = true;
        this.composer.render();
        if (this.isSendingOutput) {
            if (!this.previewContext)
                throw new Error('No preview context');
            this.copyPixels(this.previewContext);
        }
    }
}
exports.Renderer = Renderer;
