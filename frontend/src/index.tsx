import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

import App from './App';
import theme from './theme';


ReactDOM.render(
  <React.Suspense fallback="...">
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.Suspense>,
  document.getElementById('root')
);
