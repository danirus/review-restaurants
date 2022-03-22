import { TableCellProps } from "@material-ui/core";

export interface IRestaurant {
  name: string;
  country: string;
  id: string;
  address: string;
  phone_number: string;
  disabled: boolean;
  created_at: string;
  description: string;
  postal_code: string;
  webpage: string;
  avg_rating: number;
}

export interface IReview {
  id: string;
  restaurant_id: string;
  user_id: string;
  created_at: string;
  review: string;
  rating: number;
}

interface ILoadRestaurant {
  data: IRestaurant | undefined;
  review_count: number;
  best_review: IReview | undefined;
  worst_review: IReview | undefined;
  last_review: IReview | undefined;
}

interface ILoadRestaurants {
  data: IRestaurant[];
  count: number;
}

export interface IField {
  id: string;
  label: string;
  numeric: boolean;
  align: TableCellProps["align"];
  disablePadding?: boolean;
  monospaceFont?: boolean;
}

export interface IRestOp {
  name: string;
  method: string;
  endpoint: string;
  fields?: IField[];  // [field_name, display_title][]
}

export interface IApp {
  id: string;
  name: string;
  icon: SvgIconTypeMap<{}, "svg">;
  description: string;
  path: string;
  ops: IRestOp[];
}

interface ILoadItems {
  data: any[];
  count: number;
}
