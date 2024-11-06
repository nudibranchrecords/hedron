"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripForSave = void 0;
const stripForSave = (state) => {
    // @ts-expect-error ---
    const withoutActions = {};
    Object.entries(state).forEach(([key, data]) => {
        if (typeof data === 'function')
            return;
        // @ts-expect-error ---
        withoutActions[key] = data;
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sketchModules, isSketchModulesReady } = withoutActions, data = __rest(withoutActions, ["sketchModules", "isSketchModulesReady"]);
    return data;
};
exports.stripForSave = stripForSave;
