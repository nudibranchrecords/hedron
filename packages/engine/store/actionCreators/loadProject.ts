import { EngineData, SetterCreator } from "@hedron/engine/store/types";

export const createLoadProject: SetterCreator<"loadProject"> =
  (setState) => (project: EngineData) =>
    setState(() => project);
