import React from 'react';
import { Grid, Icon } from '@material-ui/core';
import StarRateIcon from '@material-ui/icons/StarRate';


interface IProps {
  handleClick: (value: number) => void;
}

export default function RatingWidget(props: IProps) {
  const [rating, setRating] = React.useState<number>(0);
  const [hovered, setHovered] = React.useState<number>(0);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
    >
      {Array.from({ length: 5 }, (_, i) => i + 1).map((value: number) => (
        <Icon
          key={`star-${value}`}
          color={value <= (hovered || rating) ? 'secondary' : 'disabled'}
          onClick={() => {
            setRating(value);
            props.handleClick(value);
          }}
          onMouseEnter={() => setHovered(value)}
          onMouseLeave={() => setHovered(rating)}
        >
          <StarRateIcon />
        </Icon>
      ))}
    </Grid>
  )
}