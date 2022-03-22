
import React from "react";

import Main from "./Main";
import { StateCtx } from "./contexts";
import { Actions, IState, initialState, reducer } from "./reducers";

export default function App() {
  const [state, dispatch]: [
    IState,
    (action: Actions) => void
  ] = React.useReducer(reducer, initialState);

  return (
    <StateCtx.Provider value={{ state, dispatch }}>
      <Main />
    </StateCtx.Provider>
  );
}
