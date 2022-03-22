import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { refreshToken } from '../api';
import { StateCtx, isAdminUser } from '../contexts';


interface PrivateRouteProps extends RouteProps {
  component: any;
  onlyAdmin?: boolean;
}

export default function PrivateRoute(props: PrivateRouteProps) {
  const { component: Component, ...rest } = props;
  const [ cookies ] = useCookies(["token"]);
  const { state, dispatch } = React.useContext(StateCtx);

  React.useEffect(() => {
    const do_refresh_token = async (refresh_token: string) => {
      await refreshToken(refresh_token, dispatch);
    }

    if (!state.access_token.length  && cookies.token)
      do_refresh_token(cookies.token);

  }, [state.access_token, cookies, dispatch]);

  const isAllowed = () => {
    if (!state.logged_in)
      return false;

    if (props.onlyAdmin === true) {
      return isAdminUser(state) ? true : false;
    }

    return true;
  }

  if (!state.access_token)
    return <span />;

  return (
    <Route
      {...rest}
      render={(routeProps) => isAllowed() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/',
          state: { from: routeProps.location }
        }} />
      )}
    />
  );
}
