import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { useCookies } from 'react-cookie';

import { refreshToken } from './api';
import { StateCtx } from './contexts';

import Footer from './components/Footer';
import HeaderIn from './components/HeaderIn';
import HeaderOut from './components/HeaderOut';
import GuestRoute from './components/GuestRoute';
import PrivateRoute from './components/PrivateRoute';

import Start from './pages/Start';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurant from './pages/Restaurant';
import Dashboard from './pages/Dashboard';
import AdminApp from './pages/AdminApp';


const styles = (theme: Theme) => createStyles({
  rrRoot: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  }
});

const useStyles = makeStyles(styles);

export default function Main() {
  const classes = useStyles();
  const [ cookies ] = useCookies(["token"]);
  const { state, dispatch } = React.useContext(StateCtx);

  React.useEffect(() => {
    const do_refresh_token = async (refresh_token: string) => {
      await refreshToken(refresh_token, dispatch);
    }

    if (!state.access_token.length  && cookies.token)
      do_refresh_token(cookies.token);

  }, [state.access_token, cookies, dispatch]);

  return (
    <Box className={classes.rrRoot}>
      <BrowserRouter>
        {state.logged_in ? <HeaderIn /> : <HeaderOut />}
        <Switch>
          <Route exact path="/" component={Start} />
          <GuestRoute
            exact path="/login"
            loggedIn={state.logged_in}
            component={Login}
          />
          <GuestRoute
            exact path="/register"
            loggedIn={state.logged_in}
            component={Register}
          />
          <PrivateRoute
            exact path="/restaurant/:restaurant_id"
            component={Restaurant}
          />
          <PrivateRoute exact onlyAdmin path="/admin" component={Dashboard} />
          <PrivateRoute onlyAdmin path="/admin/:app" component={AdminApp} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </Box>
  );
}
