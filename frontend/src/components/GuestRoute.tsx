import { Redirect, Route, RouteProps } from 'react-router-dom';


interface GuestRouteProps extends RouteProps {
  component: any;
  loggedIn: boolean;
}

export default function GuestRoute(props: GuestRouteProps) {
  const { component: Component, loggedIn, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(routeProps) => loggedIn ? (
        <Redirect to={{
          pathname: '/',
          state: { from: routeProps.location }
        }} />
      ) : (
        <Component {...props} />
      )}
    />
  );
}
