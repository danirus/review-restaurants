import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Box, Container, Typography
} from '@material-ui/core';

import RegisterWidget from '../components/RegisterWidget';

const styles = (theme: Theme) => createStyles({
  rrPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "flex-start",
    alignItems: "center"
  },
  rrMain: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2)
  },
  rrRegister: {
    margin: theme.spacing(5, 0, 2)
  }
});

const useStyles = makeStyles(styles);

export default function Login() {
  const classes = useStyles();

  return (
    <Box className={classes.rrPanel}>
      <Container component="main" className={classes.rrMain} maxWidth="sm">
        <Typography variant="h5" component="h2" gutterBottom>
          {"Welcome to Restaurant Reviews."}
        </Typography>

        <div className={classes.rrRegister}>
          <RegisterWidget />
        </div>
      </Container>
    </Box>
  );
}