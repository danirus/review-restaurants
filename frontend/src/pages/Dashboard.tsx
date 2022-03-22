import { useHistory } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Box, Card, CardActionArea, CardContent, Container, Grid, Typography
} from '@material-ui/core';

import { IApp } from '../Ifaces';
import { apps } from '../config';


const styles = (theme: Theme) => createStyles({
  rrPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "flex-start",
    alignItems: "center"
  },
  rrMain: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  rrAppsPanel: {
    margin: theme.spacing(4, 0, 2),
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center"
  },
  rrAppsGrid: {
    padding: theme.spacing(0, 2),
    flexGrow: 1,
  },
  rrApp: {
    width: 280,
    "& .MuiCardContent-root": {
      height: 160,
    }
  },
  rrFlexRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingBottom: 4,
    marginBottom: theme.spacing(1),
    borderBottomWidth: 2,
    borderBottomColor: theme.palette.grey[200],
    borderBottomStyle: "solid",
    "& .MuiSvgIcon-root": {
      color: theme.palette.secondary.main
    },
    "& .MuiTypography-h6": {
      marginLeft: theme.spacing(2),
      fontSize: "18px",
      color: theme.palette.secondary.main
    }
  }
});

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box className={classes.rrPanel}>
      <Container component="main" className={classes.rrMain} maxWidth="sm">
        <Typography variant="h3" gutterBottom>
          Admin dashboard
        </Typography>
        <Typography variant="body1">
          Missing everything here, but it will come soon. This is a work-in-progress. The dashboard is meant to give administrative access to users with the appropriate security scopes.
        </Typography>
      </Container>
      <Container className={classes.rrAppsPanel} maxWidth="md">
        <Grid container className={classes.rrAppsGrid} spacing={2}>
          {apps.map((item: IApp, index: number) => (
            <Grid key={`app-${index}`} item>
              <Card className={classes.rrApp} variant="outlined">
                <CardActionArea onClick={() => history.push(item.path)}>
                  <CardContent>
                    <div className={classes.rrFlexRow}>
                      <item.icon fontSize="large" />
                      <Typography variant="h6">{item.name}</Typography>
                    </div>
                    <div style={{ padding: "8px 8px" }}>
                      <Typography variant="body1">{item.description}</Typography>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
