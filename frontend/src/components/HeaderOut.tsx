import { useLocation } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Box, Button, Container, Link, Typography
} from '@material-ui/core';


const styles = (theme: Theme) => createStyles({
  rrPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "flex-start",
    alignItems: "center"
  },
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
  rrHeaderActions: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  rrLink: {
    color: "#355"
  }
});

const useStyles = makeStyles(styles);

export default function HeaderOut() {
  const classes = useStyles();
  const location = useLocation();

  return (
    <Box className={classes.rrPanel}>
      <Container component="main" className={classes.rrHeader} maxWidth="md">
        <div className={classes.rrHeaderRow}>
          <div className={classes.rrHeaderActions}>
            <Button
              href="/login" size="small" color="primary" variant="outlined"
              { ...(location.pathname === "/login" && {disabled: true}) }
            >
              {"Login"}
            </Button>
            &nbsp;
            <Button
              href="/register" size="small" color="primary" variant="outlined"
              { ...(location.pathname === "/register" && {disabled: true}) }
            >
              {"Register"}
            </Button>
          </div>
        </div>
      </Container>
      <Container component="main" maxWidth="sm">
        <Typography variant="h2" component="h1" gutterBottom>
          <Link href="/" className={classes.rrLink}>Restaurant.reviews</Link>
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          {"Find restaurants and what people think about them."}
        </Typography>
      </Container>
    </Box>
  );
}
