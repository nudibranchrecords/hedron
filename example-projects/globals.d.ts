/*
 Include this file in the root of your project, along with jsconfig.json,
 to get VS Code intellisense hints on the packages that hedron exposes with the HEDRON global var.

 You will need to update the import path, please see the docs for details.

 For this to work, you must also include jsconfig.json in the root of your project.
*/

import { dependencies } from '../src/electron/renderer/globalVars'

export as namespace HEDRON;

export { dependencies }