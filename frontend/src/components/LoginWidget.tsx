import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button, FormControl, TextField, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useCookies } from "react-cookie";

import { StateCtx } from '../contexts';
import { apiUrl } from "../config";
import { ActionTypes } from '../reducers';


const styles = (theme: Theme) => createStyles({
  loginBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    margin: theme.spacing(4, 4, 3),
    padding: theme.spacing(3),
    border: "2px solid #e5e8ec",
    borderRadius: 5,
  },
  loginBoxTitle: {
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: "1.2rem"
  },
  alertDiv: {
    marginBottom: theme.spacing(3),
  },
  alertMsg: {
    fontWeight: "normal",
  },
  formControl: {
    marginTop: 4,
    marginBottom: 16,
  },
  loginBtn: {
    marginTop: theme.spacing(2),
  },
});

const useStyles = makeStyles(styles);

export default function LoginWidget() {
  const classes = useStyles();

  const setCookie = useCookies(["token"])[1];
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const { dispatch } = React.useContext(StateCtx);

  const handleChange = (field_name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = (event.target as HTMLInputElement).value;
    if (field_name === "username") {
      setUsername(value);
    } else if (field_name === "password") {
      setPassword(value);
    }
  }

  const login = async (username: string, password: string) => {
    const login_url = "/login";
    setSubmitted(true);
    setErrorMsg("");

    if (username.length && password.length) {
      try {
        let response = await fetch(`${apiUrl}${login_url}`, {
          method: "POST",
          mode: "cors",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.status === 200) {
          if (data && data.access_token && data.refresh_token) {
            dispatch({
              type: ActionTypes.LOGIN,
              access_token: data.access_token,
              refresh_token: data.refresh_token
            });
            setCookie("token", data.refresh_token, { sameSite: true });
          }
        } else {
          if (data.detail) {
            setErrorMsg(data.detail);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className={classes.loginBox}>
      <div className={classes.loginBoxTitle}>
        <Typography variant="h6" className={classes.title}>
          {"Please, login with your username and password."}
        </Typography>
      </div>
      {errorMsg.length > 0 && (
        <div className={classes.alertDiv}>
          <Alert classes={{ message: classes.alertMsg }} severity="error">
            {errorMsg}
          </Alert>
        </div>
      )}
      <FormControl className={classes.formControl}>
        <TextField
          id="login-username"
          label="username"
          variant="outlined"
          defaultValue={username}
          onChange={handleChange("username")}
          inputProps={{ tabIndex: 1 }}
          {...((submitted && username.length === 0) && {
            error: true,
            helperText: "This field is required."
          })}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          id="login-password"
          label="password"
          type="password"
          variant="outlined"
          defaultValue={password}
          onChange={handleChange("password")}
          inputProps={{ tabIndex: 2 }}
          {...((submitted && password.length === 0) && {
            error: true,
            helperText: "This field is required."
          })}
        />
      </FormControl>
      <Button
        size="large"
        color="secondary"
        variant="contained"
        className={classes.loginBtn}
        onClick={() => login(username, password)}
        tabIndex="3"
      >
        {"Login"}
      </Button>
    </div>
  );
}
