import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';

import OxygenLight from './assets/Oxygen-Light.ttf';
import OxygenRegular from './assets/Oxygen-Regular.ttf';
import OxygenBold from './assets/Oxygen-Bold.ttf';

import OxygenMonoRegular from './assets/OxygenMono-Regular.ttf';


const oxygenLight = {
  fontFamily: 'Oxygen',
  fontStyle: 'normal',
  fontWeight: 300,
  src: `
    local('Oxygen-Light'),
    url(${OxygenLight}) format('truetype')
  `
};

const oxygenRegular = {
  fontFamily: 'Oxygen',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src: `
    local('Oxygen-Regular'),
    url(${OxygenRegular}) format('truetype')
  `
};

const oxygenBold = {
  fontFamily: 'Oxygen',
  fontStyle: 'normal',
  fontWeight: 700,
  src: `
    local('Oxygen-Bold'),
    url(${OxygenBold}) format('truetype')
  `
};

const oxygenMono = {
  fontFamily: 'Oxygen Mono',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src: `
    local('OxygenMono-Regular'),
    url(${OxygenMonoRegular}) format('truetype')
  `
};


let theme = createTheme({
  typography: {
    fontFamily: ["Oxygen", "sans-serif"].join(","),
    fontSize: 14,
    h1: {
      fontSize: "2.4rem",
      fontWeight: 700
    },
    h2: {
      fontSize: "2.2rem",
      fontWeight: 700
    },
    h3: {
      fontSize: "2.0rem",
      fontWeight: 700
    },
    h4: {
      fontSize: "1.8rem",
      fontWeight: 400
    },
    h5: {
      fontSize: "1.6rem",
      fontWeight: 400
    },
    h6: {
      fontSize: "1.4rem",
      fontWeight: 400
    }
  },
  palette: {
    primary: {
      main: '#78909c',
    },
    secondary: {
      main: '#d81b60',
    },
    text: {
      primary: '#263238',
    },
    error: {
      main: '#d50000',
    },
  },
  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    "none",  // Button shadow.
    "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)", // Fab.
    "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
    "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
    "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
    "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
    "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
    "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
    "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
    "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
    "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
    "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
    "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
    "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
    "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
    "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
  ],
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [oxygenLight, oxygenRegular, oxygenBold, oxygenMono],
        HTML: {
          backgroundColor: "#fff"
        },
        body: {
          backgroundColor: "#fff",
        }
      }
    },
    MuiLink: {
      root: {
        color: "#0072e5"
      }
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;
