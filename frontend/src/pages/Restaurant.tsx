import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Box, Breadcrumbs, Button, Container, Divider, Grid, Link, Typography
} from '@material-ui/core';

import { StateCtx } from '../contexts';
import { ILoadRestaurant } from '../Ifaces';
import { apiCall, loadRestaurant } from '../api';

import RatingStars from '../components/RatingStars';
import RestaurantReviewDialog from '../components/RestaurantReviewDialog';
import RestaurantReviewItem from '../components/RestaurantReviewItem';
import ThankYouDialog from '../components/ThankYouDialog';


const styles = (theme: Theme) => createStyles({
  rrPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "flex-start",
    alignItems: "center"
  },
  rrBreadcrumbs: {
    margin: theme.spacing(1, 0),
    "& .MuiTypography-root": {
      fontSize: "0.9rem"
    }
  },
  rrMain: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2)
  },
  rrName: {
    margin: theme.spacing(3, 0),
  },
  rrDesc: {
    margin: theme.spacing(3, 0),
    fontSize: "1.2rem"
  },
});

const useStyles = makeStyles(styles);

interface IUrlParams {
  restaurant_id: string;
}

export default function Restaurant() {
  const classes = useStyles();
  let { restaurant_id } = useParams() as IUrlParams;
  const { state, dispatch } = React.useContext(StateCtx);
  const [cstate, setCstate] = React.useState<ILoadRestaurant>({
    data: undefined,
    review_count: 0,
    best_review: undefined,
    worst_review: undefined,
    last_review: undefined
  });

  const [updatePage, setUpdatePage] = React.useState<boolean>(true);
  const [openRevDialog, setOpenRevDialog] = React.useState<boolean>(false);
  const [openThkDialog, setOpenThkDialog] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      if (updatePage && state.access_token && state.refresh_token) {
        const result: ILoadRestaurant = await apiCall(
          state.access_token, state.refresh_token, dispatch,
          loadRestaurant, restaurant_id
        );
        if (result) {
          setCstate({ ...result });
        }
      }
    })();
    if (updatePage)
      setUpdatePage(false);
  }, [
    updatePage,
    state.access_token,
    state.refresh_token,
    restaurant_id,
    dispatch,
  ]);

  if (cstate.data === undefined)
    return <span />

  return (
    <Box className={classes.rrPanel}>
      <RestaurantReviewDialog
        restaurant={cstate.data}
        open={openRevDialog}
        handleClose={(success: boolean) => {
          setOpenRevDialog(false);
          if (success) {
            setOpenThkDialog(true);
          }
        }}
      />
      <ThankYouDialog
        open={openThkDialog}
        handleClose={() => {
          setOpenThkDialog(false);
          setUpdatePage(true);
        }}
      />
      <Container component="main" className={classes.rrMain} maxWidth="sm">
        <Breadcrumbs className={classes.rrBreadcrumbs}>
          <Link color="inherit" component={RouterLink} to="/">Search</Link>
          <Typography color="textPrimary">{cstate.data.name}</Typography>
        </Breadcrumbs>

        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          className={classes.rrName}
        >
          <Typography variant="h5">
            {cstate.data.name}
          </Typography>
          <div style={{ textAlign: "center" }}>
            <Typography variant="h3" color="secondary">
              {cstate.data.avg_rating.toFixed(2)}
            </Typography>
            <RatingStars rating={cstate.data.avg_rating} />
          </div>
        </Grid>
        <Divider />

        <Typography className={classes.rrDesc}>
          {cstate.data.description}
        </Typography>

        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1">
            {(cstate.review_count === 0 || cstate.review_count > 1)
              ? `${cstate.review_count} reviews`
              : `${cstate.review_count} review`
            }
          </Typography>
          <Button
            variant="outlined" size="small" color="secondary"
            onClick={() => setOpenRevDialog(true)}
          >
            {"Add your review"}
          </Button>
        </Grid>

        {cstate.best_review && (
          <RestaurantReviewItem
            title="Best review"
            review={cstate.best_review}
          />
        )}

        {cstate.worst_review && (
          <RestaurantReviewItem
            title="Worst review"
            review={cstate.worst_review}
          />
        )}
        {cstate.last_review && (
          <RestaurantReviewItem
            title="Last review"
            review={cstate.last_review}
          />
        )}
      </Container>
    </Box>
  );
}