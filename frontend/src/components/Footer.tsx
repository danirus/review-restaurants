import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Box, Container, Link, Typography } from '@material-ui/core';

import { webUrl } from '../config';


const styles = (theme: Theme) => createStyles({
  rrFooter: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: "#e5e8ec",
    "& .MuiLink-root": {
      fontWeight: 700
    }
  }
});

const useStyles = makeStyles(styles);

export default function Footer() {
  const classes = useStyles();

  return (
    <Box component="footer" className={classes.rrFooter}>
      <Container maxWidth="sm">
        <Typography variant="body1">
          Yet another social project.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {"Copyright © "}
          <Link color="inherit" href={webUrl}>
            Restaurant Reviews
          </Link>
          {" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </Box>
  );
}
