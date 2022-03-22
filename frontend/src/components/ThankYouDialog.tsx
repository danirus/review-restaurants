import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Dialog, DialogContent, DialogContentText, DialogTitle,
  IconButton
} from '@material-ui/core';

import RestaurantIcon from '@material-ui/icons/Restaurant';


const styles = (theme: Theme) => createStyles({
  rrThanks: {
    textAlign: "center",
    fontSize: "1.2rem",
  },
  rrButton: {
    padding: theme.spacing(0, 0, 4),
    textAlign: "center",
  }
});

const useStyles = makeStyles(styles);

interface IProps {
  open: boolean;
  handleClose: () => void;
}

export default function ThankYouDialog(props: IProps) {
  const classes = useStyles();

  return (
    <Dialog
      open={props.open}
      onClose={() => props.handleClose()}
      maxWidth="xs"
    >
      <DialogTitle>{"Thank you!"}</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.rrThanks}>
          Your review has been added.<br/>
          <span style={{
            fontSize: "1.4rem",
            fontWeight: 700,
          }}>Thank you!</span>
        </DialogContentText>
      </DialogContent>
      <div className={classes.rrButton}>
      <IconButton color="secondary" onClick={() => props.handleClose()}>
        <RestaurantIcon fontSize="large" />
      </IconButton>
      </div>
    </Dialog>
  )
}