"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.importSketchModule = void 0;
const createUniqueId_1 = require("@hedron/engine/utils/createUniqueId");
const importSketchModule = (baseUrl, moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cacheBust = (0, createUniqueId_1.createUniqueId)();
    // Get the sketch module
    const sketchPath = `${baseUrl}/${moduleId}/index.js?${cacheBust}`;
    if ((yield fetch(sketchPath)).status !== 200) {
        return Promise.reject(`Sketch module not found: ${sketchPath}`);
    }
    const sketchModule = yield Promise.resolve(`${sketchPath}`).then(s => __importStar(require(s)));
    const module = sketchModule.default;
    // Get the sketch config
    const configPath = `${baseUrl}/${moduleId}/config.js?${cacheBust}`;
    let config;
    if ((yield fetch(configPath)).status !== 200) {
        // No config file found
        // Try instancing the sketch, and call getConfig() on it
        const tempModule = new module();
        config = (_a = tempModule.getConfig) === null || _a === void 0 ? void 0 : _a.call(tempModule);
        if (!config) {
            return Promise.reject(`Sketch config not found: ${configPath} and no valid getConfig() function found in sketch`);
        }
    }
    else {
        const configModule = yield Promise.resolve(`${configPath}`).then(s => __importStar(require(s)));
        config = configModule.default;
    }
    // A config could be missing a title, but it is a required parameter
    if (!config.title) {
        config.title = moduleId;
    }
    return {
        moduleId,
        config,
        module,
    };
});
exports.importSketchModule = importSketchModule;
