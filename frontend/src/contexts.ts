import React from "react";

import { IState, Actions } from "./reducers";

// --------------------------
// Context to hold App State.

interface IStateCtxProps {
  state: IState;
  dispatch: (action: Actions) => void;
}

export const StateCtx = React.createContext({} as IStateCtxProps);

export function isAdminUser(state: IState) {
  if (
    (state.usr_scps.indexOf("users:read") > -1) ||
    (state.usr_scps.indexOf("users:write") > -1)
  ) {
    return true;
  }

  return false;
}