import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, Typography
} from '@material-ui/core';

import { apiCall, sendReview } from '../api';
import { IRestaurant, IReview } from '../Ifaces';

import RatingWidget from './RatingWidget';
import { StateCtx } from '../contexts';


const styles = (theme: Theme) => createStyles({
  rrForm: {
    padding: theme.spacing(2, 1),
    width: "100%"
  },
  rrReviewField: {
    width: "100%",
    marginBottom: theme.spacing(3),
  },
  rrRatingField: {
    width: "100%",
    textAlign: "center",
    marginBottom: theme.spacing(3),
  }
});

const useStyles = makeStyles(styles);

interface IProps {
  restaurant: IRestaurant;
  open: boolean;
  handleClose: (success: boolean) => void;
}

export default function RestaurantReviewDialog(props: IProps) {
  const classes = useStyles();
  const { state, dispatch } = React.useContext(StateCtx);

  const [yourReview, setYourReview] = React.useState<string>("");
  const [yourRating, setYourRating] = React.useState<number>(0);

  const yourReviewChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setYourReview(value);
  }

  const submitReview = async () => {
    if (state.access_token && state.refresh_token) {
      const result: IReview = await apiCall(
        state.access_token, state.refresh_token, dispatch,
        sendReview, props.restaurant.id, yourReview, yourRating
      );
      if (result) {
        setYourReview("");
        setYourRating(0);
        props.handleClose(true);
      }
    }
  }

  return (
    <Dialog
      open={props.open}
      onClose={() => props.handleClose(false)}
      aria-labelledby="form-dialog-title"
      maxWidth="sm"
    >
      <DialogTitle>{"Add your review"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please, tell us your experience at <strong>{props.restaurant.name}</strong>.
        </DialogContentText>
        <div className={classes.rrForm}>
          <TextField
            multiline
            id="your-review"
            label="Your review"
            rows={4}
            defaultValue={yourReview}
            className={classes.rrReviewField}
            onChange={yourReviewChanged}
            inputProps={{ tabIndex: 1 }}
            variant="outlined"
          />
          <div className={classes.rrRatingField}>
            <Typography variant="body1">Your rating</Typography>
            <RatingWidget
              handleClick={(value: number) => setYourRating(value)}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => props.handleClose(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => submitReview()}
        >
          Send Review
        </Button>
      </DialogActions>
    </Dialog>
  );
}