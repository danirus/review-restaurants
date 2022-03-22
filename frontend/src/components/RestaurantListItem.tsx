import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, Link, Typography } from '@material-ui/core';

import { IRestaurant } from '../Ifaces';

import RatingStars from '../components/RatingStars';


const styles = (theme: Theme) => createStyles({
  rrItem: {
    margin: theme.spacing(3, 0, 3),
    padding: theme.spacing(2, 0, 2),
    borderBottom: "1px solid #eee",
    "&:first-child": {
      marginTop: theme.spacing(1),
      paddingTop: theme.spacing(1)
    },
    "&:last-child": {
      borderBottom: "none"
    }
  },
  rrItemHeader: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  rrItemDescription: {
    margin: theme.spacing(2, 1, 1),
    display: "block",
    width: "100%"
  }
});

const useStyles = makeStyles(styles);

export default function RestaurantListItem(props: IRestaurant) {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      className={classes.rrItem}
    >
      <div className={classes.rrItemHeader}>
        <Typography variant="h6">
          <Link
            component={RouterLink}
            to={`/restaurant/${props.id}`}
          >
            {props.name}
          </Link>
        </Typography>
        <div>
          <RatingStars rating={props.avg_rating} />
        </div>
      </div>
      <div className={classes.rrItemDescription}>
      <Typography variant="body1">{props.description}</Typography>
      </div>
    </Grid>
  );
}
