import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import { IReview } from '../Ifaces';

import RatingStars from './RatingStars';

const styles = (theme: Theme) => createStyles({
  rrReviewDiv: {
    margin: theme.spacing(4, 0),
    borderTop: "1px solid #ddd",
    padding: theme.spacing(2, 0)
  },
  rrReview: {
    margin: theme.spacing(1, 0),
    fontSize: "1rem"
  }
});

const useStyles = makeStyles(styles);

interface IProps {
  title: string;
  review: IReview;
}

export default function RestaurantReviewItem(props: IProps) {
  const classes = useStyles();

  return (
    <div className={classes.rrReviewDiv}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body1" style={{ fontSize: "1.1rem" }}>
          {props.title}
        </Typography>
        <div><RatingStars rating={props.review.rating} /></div>
      </Grid>
      <div className={classes.rrReview}>
        {props.review.review}
      </div>
    </div>
  );
}
