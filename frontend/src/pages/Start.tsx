import React from 'react';
import { Location as LocationType } from 'history';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Box, Button, Card, CardActions, CardContent, Container,
  Grid, Link, Typography
} from '@material-ui/core';

import { resPerPage } from '../config';
import { StateCtx } from '../contexts';
import { IRestaurant, ILoadRestaurants } from '../Ifaces';
import { apiCall, loadRestaurants } from '../api';

import RestaurantsWidget from '../components/RestaurantsWidget';


// This is just to fill the gap at the right side of the home page.
const promoted: IRestaurant[] = [
  {
    name: "Pizzeria Foo",
    country: "DE",
    id: "",
    address: "",
    phone_number: "",
    disabled: false,
    created_at: "",
    description: "Enjoy delightful Italian pasta, pizza and sea food, in an old classic decorated atmosphere.",
    postal_code: "",
    webpage: "",
    avg_rating: 1.1
  }, {
    name: "Der Obere Wirt zum Queri",
    country: "DE",
    id: "",
    address: "Georg-Queri-Ring 9",
    phone_number: "+49 (0)8152 91 83-0",
    disabled: false,
    created_at: "",
    description: "Look forward to dining, celebrating or meeting in our historic parlors, in the chestnut beer garden, in the vaulted cellar or in one of our event rooms.",
    postal_code: "82346",
    webpage: "",
    avg_rating: 2.2
  }
]

const styles = (theme: Theme) => createStyles({
  rrPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "flex-start",
    alignItems: "center"
  },
  rrMain: {
    margin: theme.spacing(4, 0),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  rrPromoted: {
    marginTop: theme.spacing(4)
  },
  rrPromoItem: {
    marginBottom: theme.spacing(5),
    "&:last-child": {
      marginBottom: 0
    }
  },
  rrTitle: {
    lineHeight: "1.2em",
    paddingBottom: theme.spacing(1)
  },
  rrPaginator: {
    margin: theme.spacing(6, 0, 5),
    textAlign: "center"
  },
  rrDisabledLink: {
    color: theme.palette.text.secondary
  },
  rrPlus1: {
    margin: theme.spacing(1, 0, 4),
    fontSize: "1.2rem"
  }
});

const useStyles = makeStyles(styles);

interface IPaginationProps {
  classes: ReturnType<typeof useStyles>;
  location: LocationType;
  page: number;
  totalPages: number;
  totalResults: number;
}

function Pagination(props: IPaginationProps) {
  const { classes, location, page, totalPages, totalResults } = props;

  return (
    <div className={classes.rrPaginator}>
      <Typography variant="body2" gutterBottom>
        Found {totalResults} restaurants.
      </Typography>
      <Typography variant="body2" gutterBottom>
        Page {page} of {totalPages}
      </Typography>
      <div>
        {page === 1 ? (
          <span className={classes.rrDisabledLink}>previous</span>
        ) : (
          <Link
            component={RouterLink}
            to={`/${page === 1 ? '' : `?page=${page - 1}`}`}
            {...(page === 1 && { disabled: true })}
          >
            previous
          </Link>
        )}
        &nbsp;|&nbsp;
        {page === totalPages ? (
          <span className={classes.rrDisabledLink}>next</span>
        ) : (
          <Link
            component={RouterLink}
            to={`${location.pathname}?page=${page + 1}`}
            {...(page === totalPages && { disabled: true })}
          >
            next
          </Link>
        )}
      </div>
    </div>
  )
}

export default function Start() {
  const classes = useStyles();
  const { state, dispatch } = React.useContext(StateCtx);
  const location = useLocation();

  const [country, setCountry] = React.useState<string>("");
  const [postcode, setPostcode] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");
  const [offset, setOffset] = React.useState<number>(0);

  const [restoData, setRestoData] = React.useState<IRestaurant[]>([]);
  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);

  React.useEffect(() => {
    setOffset((page - 1) * resPerPage);
    window.scrollTo(0, 0);
  }, [page, setOffset]);

  React.useEffect(() => {
    (async () => {
      if (state.access_token && state.refresh_token) {
        const results: ILoadRestaurants = await apiCall(
          state.access_token, state.refresh_token, dispatch,
          loadRestaurants, country, postcode, search, offset, resPerPage
        );
        if (results) {
          setRestoData(results.data as IRestaurant[]);
          setTotalResults(results.count);
          setTotalPages(Math.ceil(results.count / resPerPage));
        }
      }
    })();
  }, [
    state.access_token,
    state.refresh_token,
    country,
    postcode,
    search,
    offset,
    dispatch
  ]);

  return (
    <Box className={classes.rrPanel}>
      {state.logged_in ? (
        <Container component="main" className={classes.rrMain} maxWidth="md">
          <Grid container spacing={8}>
            <Grid item xs={12} md={8}>
              <RestaurantsWidget
                data={restoData}
                onCountryChange={(value) => setCountry(value)}
                onPostcodeChange={(value) => setPostcode(value)}
                onSearchChange={(value) => setSearch(value)}
              />
              <Pagination
                classes={classes}
                location={location}
                page={page}
                totalPages={totalPages}
                totalResults={totalResults}
              />
            </Grid>
            <Grid item xs={12} md={4} className={classes.rrPromoted}>
              {promoted.map((item: IRestaurant, index: number) => (
                <Card
                  key={`promo-${index}`}
                  variant="outlined"
                  className={classes.rrPromoItem}
                >
                  <CardContent>
                    <Typography variant="overline" color="textSecondary">
                      Promoted
                    </Typography>
                    <Typography
                      variant="h6" component="h2" className={classes.rrTitle}
                    >
                      {item.name}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              ))}
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Container component="main" className={classes.rrMain} maxWidth="sm">
          <Typography variant="body1" className={classes.rrPlus1} gutterBottom>
            {"To read other users' restaurant reviews you should login first. If you don't have an account yet, please, click on the button at the top right to register your username."}
          </Typography>
          <Typography variant="body1" className={classes.rrPlus1} gutterBottom>
            {"Restaurant Reviews is a social experiment to implement an automatic moderation review system based on NLP and AI. The service does not require users to register their email addresses, it only keeps username and passwords."}
          </Typography>
        </Container>
      )}
    </Box>
  );
}
