import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Button, Container, Divider, Link, Typography
} from '@material-ui/core';
import { useCookies } from "react-cookie";

import { StateCtx, isAdminUser } from '../contexts';


const styles = (theme: Theme) => createStyles({
  rrHeader: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column"
  },
  rrHeaderRow: {
    margin: theme.spacing(1, 0),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rrLogo: {
    marginRight: theme.spacing(4),
    fontWeight: 700,
    fontSize: "20px",
    color: theme.palette.primary.main
  },
  rrHeaderActions: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center"
  },
});

const useStyles = makeStyles(styles);

export default function HeaderIn() {
  const classes = useStyles();

  const removeCookie = useCookies(["token"])[2];
  const { state } = React.useContext(StateCtx);

  const handleLogout = () => {
    removeCookie("token", { sameSite: true });
    window.location.href = "/";
  }

  return (
    <Container className={classes.rrHeader} maxWidth="md">
      <div className={classes.rrHeaderRow}>
        <Link href="/" className={classes.rrLogo}>Restaurant Reviews</Link>
        <div className={classes.rrHeaderActions}>
          {state.username.length && (
            <Typography variant="body2" style={{ marginRight: 16 }}>
              Welcome, {state.username}.
            </Typography>
          )}
          {isAdminUser(state) && (
            <React.Fragment>
              <Button
                size="small" variant="outlined" color="secondary"
                component={RouterLink}
                to="/admin"
              >
                {"Admin"}
              </Button>&nbsp;
            </React.Fragment>
          )}
          <Button
            size="small" variant="outlined" color="primary"
            onClick={handleLogout}
          >
            {"Logout"}
          </Button>
        </div>
      </div>
      <Divider />
    </Container>
  );
}
