import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import RateReviewIcon from '@material-ui/icons/RateReview';
import RestaurantIcon from '@material-ui/icons/Restaurant';

import { IApp } from './Ifaces';


export const webUrl = process.env.NODE_ENV !== "production"
  ? "http://localhost:3000"
  : "https://restaurant.reviews";

export const apiUrl = process.env.NODE_ENV !== "production"
  ? process.env.REACT_APP_USE_DOCKER
    ? "http://backend:8100/api/v1"
    : "http://localhost:8100/api/v1"
  : "https://official.sagittarius.url/api/v1";

export const resPerPage = 10;  // Results per page.

export const apps: IApp[] = [
  {
    id: "users",
    name: "Users",
    icon: AccountCircleIcon,
    description: "Manage users: list, create, update and delete them.",
    path: "/admin/users",
    ops: [
      {
        name: "list",
        method: "get",
        endpoint: "/users",
        fields: [
          {
            id: "username", label: "User name", numeric: false,
            align: "left", disablePadding: true
          }, {
            id: "disabled", label: "Disabled account?", numeric: false,
            align: "center"
          }, {
            id: "id", label: "User UUID", numeric: false, align: "center",
            monospaceFont: true
          }
        ]
      }
    ]
  }, {
    id: "restaurants",
    name: "Restaurants",
    icon: RestaurantIcon,
    description: "Manage restaurants: list, create, update and delete them.",
    path: "/admin/restaurants",
    ops: [
      {
        name: "list",
        method: "get",
        endpoint: "/restaurants",
        fields: [
          {
            id: "name", label: "Restaurant name", numeric: false, align: "left", disablePadding: true
          }, {
            id: "country", label: "Country code", numeric: false, align: "center", monospaceFont: true
          }, {
            id: "postal_code", label: "Post Code", numeric: false, align: "center"
          }, {
            id: "id", label: "Restaurant UUID", numeric: false, align: "center", monospaceFont: true
          }
        ]
      }
    ]
  }, {
    id: "reviews",
    name: "Reviews",
    icon: RateReviewIcon,
    description: "Manage reviews: list, create, update and delete them.",
    path: "/admin/reviews",
    ops: [
      {
        name: "list",
        method: "get",
        endpoint: "/reviews",
        fields: [
          {
            id: "id", label: "Review UUID", numeric: false, align: "center", monospaceFont: true
          }, {
            id: "country", label: "Country code", numeric: false, align: "center", monospaceFont: true
          }, {
            id: "restaurant_id", label: "Restaurant UUID", numeric: false, align: "center", monospaceFont: true
          }, {
            id: "user_id", label: "User UUID", numeric: false, align: "center", monospaceFont: true
          }
        ]
      }
    ]

  }
]