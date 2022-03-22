import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Button, FormControl, FormHelperText, IconButton, InputAdornment,
  InputLabel, Link, OutlinedInput, TextField, Typography
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { apiUrl } from "../config";


const styles = (theme: Theme) => createStyles({
  registerBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    margin: theme.spacing(4, 4, 3),
    padding: theme.spacing(3),
    border: "2px solid #e5e8ec",
    borderRadius: 5,
  },
  registerBoxTitle: {
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

interface ICompState {
  username: string;
  password: string;
  showPass: boolean;
  passRepeat: string;
  showRepeat: boolean;
  errorMsg: string;
  submitted: boolean;
  success: boolean;
}

export default function RegisterWidget() {
  const classes = useStyles();

  const [cstate, setCstate] = React.useState<ICompState>({
    username: "",
    password: "",
    showPass: false,
    passRepeat: "",
    showRepeat: false,
    errorMsg: "",
    submitted: false,
    success: false
  });

  const usernameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setCstate({ ...cstate, username: value });
  }

  const passwordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setCstate({ ...cstate, password: value });
  }

  const showPassClicked = () => {
    setCstate({ ...cstate, showPass: !cstate.showPass })
  }

  const passRepeatChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setCstate({ ...cstate, passRepeat: value });
  }

  const showRepeatClicked = () => {
    setCstate({ ...cstate, showRepeat: !cstate.showRepeat })
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const register = async () => {
    const register_url = "/signup";
    setCstate({ ...cstate, submitted: true, errorMsg: "" })

    if (
      cstate.username.length && cstate.password.length &&
      cstate.password === cstate.passRepeat
    ) {
      try {
        let response = await fetch(`${apiUrl}${register_url}`, {
          method: "POST",
          mode: "cors",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            username: cstate.username,
            password: cstate.password
          })
        });
        const data = await response.json();
        if (response.status === 403) {
          setCstate({ ...cstate, errorMsg: data.detail })
        } else if (response.status === 201) {
          setCstate({ ...cstate, success: true, errorMsg: "" });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className={classes.registerBox}>
      <div className={classes.registerBoxTitle}>
        <Typography variant="h6" className={classes.title}>
          {"Create an account by typing your preferred username and password."}
        </Typography>
      </div>
      {cstate.errorMsg.length > 0 && (
        <div className={classes.alertDiv}>
          <Alert classes={{ message: classes.alertMsg }} severity="error">
            {cstate.errorMsg}
          </Alert>
        </div>
      )}
      {cstate.success && (
        <div className={classes.alertDiv}>
          <Alert classes={{ message: classes.alertMsg }} severity="success">
            <span>Your username and password have been registered.<br/>You can <Link href="/login"><strong>login</strong></Link> now.</span>
          </Alert>
      </div>
      )}
      <FormControl className={classes.formControl}>
        <TextField
          id="register-username"
          label="username"
          variant="outlined"
          defaultValue={cstate.username}
          onChange={usernameChanged}
          inputProps={{ tabIndex: 1 }}
          {...((cstate.submitted && cstate.username.length === 0) && {
            error: true,
            helperText: "This field is required."
          })}
          {...(cstate.success && { disabled: true })}
        />
      </FormControl>
      <FormControl className={classes.formControl} variant="outlined">
        <InputLabel htmlFor="register-password">password</InputLabel>
        <OutlinedInput
          id="register-password"
          type={cstate.showPass ? 'text' : 'password'}
          value={cstate.password}
          onChange={passwordChanged}
          inputProps={{ tabIndex: 2 }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={showPassClicked}
                onMouseDown={handleMouseDown}
                edge="end"
              >
                {cstate.showPass ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={73}
          {...(cstate.success && { disabled: true })}
        />
        {(cstate.submitted && cstate.password.length === 0) && (
          <FormHelperText error={true}>
            {"This field is required."}
          </FormHelperText>
        )}
      </FormControl>
      <FormControl className={classes.formControl} variant="outlined">
        <InputLabel htmlFor="repeat-password">repeat password</InputLabel>
        <OutlinedInput
          id="repeat-password"
          type={cstate.showRepeat ? 'text' : 'password'}
          value={cstate.passRepeat}
          onChange={passRepeatChanged}
          inputProps={{ tabIndex: 3 }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={showRepeatClicked}
                onMouseDown={handleMouseDown}
                edge="end"
              >
                {cstate.showRepeat ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={124}
          {...(cstate.success && { disabled: true })}
        />
        {(cstate.submitted && cstate.passRepeat.length === 0) && (
          <FormHelperText error={true}>
            {"This field is required."}
          </FormHelperText>
        )}
        {(cstate.submitted && cstate.password !== cstate.passRepeat) && (
          <FormHelperText error={true}>
            {"Passwords do not match."}
          </FormHelperText>
        )}
      </FormControl>
      <Button
        size="large"
        color="secondary"
        variant="contained"
        className={classes.loginBtn}
        onClick={() => register()}
        tabIndex="3"
        {...(cstate.success && {disabled: true})}
      >
        {"Register"}
      </Button>
    </div>
  );
}
