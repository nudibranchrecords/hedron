import { initialState } from "@hedron/engine/store/initialState";
import { SetterCreator } from "@hedron/engine/store/types";

export const createReset: SetterCreator<"reset"> = (setState) => () => {
  setState(() => initialState);
};
