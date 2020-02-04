/*
  Include this file in the root of your project, along with jsconfig.json,
  to get VS Code intellisense hints on the packages that hedron exposes with the HEDRON global var.

  You will need to update the import path, please see the docs for details.

  Example import paths:

  Installed (Windows)
  C:/Users/alex/AppData/Local/Programs/Hedron/resources/static/globalVars

  Installed (OSX)
  /Applications/Hedron.app/Contents/Resources/static/globalVars

  From source
  /path/to/hedron/src/electron/renderer/globalVars
*/

// This local path only works for example projects inside of the hedron folder
import { dependencies } from '../src/electron/renderer/globalVars' 

export as namespace HEDRON;

export { dependencies }