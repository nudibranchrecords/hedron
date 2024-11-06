"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoadProject = void 0;
const createLoadProject = (setState) => (project) => setState(() => project);
exports.createLoadProject = createLoadProject;
