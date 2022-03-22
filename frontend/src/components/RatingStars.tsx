import { Grid, Icon } from '@material-ui/core';
import StarRateIcon from '@material-ui/icons/StarRate';


interface IProps {
  rating: number;
}

export default function RatingStars(props: IProps) {
  const rating = Math.round(props.rating);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
    >
      {Array.from({length: 5}, (_, i) => i + 1).map((value: number) => (
        <Icon
          key={`star-${value}`}
          color={value <= rating ? 'secondary' : 'disabled'}
        >
          <StarRateIcon />
        </Icon>
      ))}
    </Grid>
  )
}