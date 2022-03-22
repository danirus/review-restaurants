import { Grid } from '@material-ui/core';

import { IRestaurant } from '../Ifaces';

import RestaurantListItem from './RestaurantListItem';


interface IProps {
  data: IRestaurant[];

  onCountryChange: (value: string) => void;
  onPostcodeChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export default function RestaurantsWidget(props: IProps) {
  return (
    <Grid item>
      {props.data && props.data.map((item: IRestaurant, index: number) => (
        <RestaurantListItem key={`r-it-${index}`} {...item} />
      ))}
    </Grid>
  );
}
