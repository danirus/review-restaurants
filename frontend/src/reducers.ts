export interface IState {
  backend_error_msg: string;
  logged_in: boolean;
  access_token: string;
  refresh_token: string;
  username: string;
  usr_scps: string[];  // User scopes.
}

export enum ActionTypes {
  SET_BACKEND_ERROR = "SET_BACKEND_ERROR",
  LOGIN = "LOGIN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
}

export interface ISetBackendError {
  type: ActionTypes.SET_BACKEND_ERROR,
  error_msg: string;
}

export interface ILogin {
  type: ActionTypes.LOGIN;
  access_token: string;
  refresh_token: string;
}

export interface IRefreshToken {
  type: ActionTypes.REFRESH_TOKEN;
  access_token: string;
}

export type Actions =
  | ISetBackendError
  | ILogin
  | IRefreshToken;

export const initialState: IState = {
  backend_error_msg: "",
  logged_in: false,
  access_token: "",
  refresh_token: "",
  username: "",
  usr_scps: [],
}

const decodeToken = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')
  );
  return JSON.parse(jsonPayload);
}

export function reducer(state: IState, action: Actions) {
  switch (action.type) {
    case ActionTypes.SET_BACKEND_ERROR: {
      return {
        ...state,
        backend_error_msg: action.error_msg
      }
    }
    case ActionTypes.LOGIN: {
      const dec_token = decodeToken(action.access_token);
      return {
        ...state,
        logged_in: true,
        access_token: action.access_token,
        refresh_token: action.refresh_token,
        username: dec_token.sub !== undefined ? dec_token.sub : "",
        usr_scps: dec_token.scopes !== undefined ? dec_token.scopes : []
      };
    }
    case ActionTypes.REFRESH_TOKEN: {
      return {
        ...state,
        access_token: action.access_token
      }
    }
    default:
      return state;
  }
}