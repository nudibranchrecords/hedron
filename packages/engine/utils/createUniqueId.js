"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUniqueId = void 0;
const uid_1 = require("uid");
const createUniqueId = () => (0, uid_1.uid)(16);
exports.createUniqueId = createUniqueId;
