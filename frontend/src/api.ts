import { Actions, ActionTypes } from "./reducers";
import { ILoadRestaurants, ILoadRestaurant, IReview } from "./Ifaces";
import { apiUrl } from "./config";


export const apiCall = async (
  access_token: string,
  refresh_token: string,
  dispatch: (action: Actions) => void,
  func: Function,
  ...args: any[]
) => {
  let valid = false;
  let trials = 2;
  while (!valid && trials) {
    try {
      const results = await func(access_token, ...args);
      if (results) {
        valid = true;
        return results;
      }
    } catch (error: any) {
      if (error.status === 401 || error.status === 422) {
        trials--;
        access_token = await refreshToken(refresh_token, dispatch);
      }
    }
  }
}

export const refreshToken = async (
  refresh_token: string,
  dispatch: (action: Actions) => void
) => {
  if (!refresh_token)
    return;

  const refresh_url = "/refresh";
  try {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + refresh_token
    }
    let response = await fetch(`${apiUrl}${refresh_url}`, {
      mode: "cors",
      method: "POST", headers
    });
    const data = await response.json();
    if (data && data.access_token) {
      dispatch({
        type: ActionTypes.LOGIN,
        access_token: data.access_token,
        refresh_token: refresh_token
      });
      return data.access_token;
    }
  } catch (error: any) {
    dispatch({
      type: ActionTypes.SET_BACKEND_ERROR,
      error_msg: error.message
    });
  }
}


export const loadRestaurants = async (
  access_token: string,
  country: string,
  postcode: string,
  name: string,
  offset: number,
  limit: number
) => {
  // Build the URL to hit to fetch restaurants, there are
  // two possible API endpoints. If the user selects a country and
  // provides a postcode, then we will use a different URL.
  // The idea underneath is that in a larger site, a more specific URL
  // based on a country/postcode combination would allow caching.
  let url_path = `/restaurants`;
  if (country.length && postcode.length) {
    url_path += `/${country}/${postcode}`;
  }
  const search_params = new URLSearchParams({
    name: name, offset: `${offset}`, limit: `${limit}`
  }).toString();
  const url = `${apiUrl}${url_path}?${search_params}`;

  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + access_token
  }

  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    headers
  });
  if (response.status === 200) {
    const result: ILoadRestaurants = await response.json();
    return result;
  } else {
    throw response;
  }
}


export const loadRestaurant = async (
  access_token: string,
  restaurant_id: string,
) => {
  const url_path = `/restaurant/${restaurant_id}`;
  const url = `${apiUrl}${url_path}`;
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + access_token
  }

  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    headers
  });
  if (response.status === 200) {
    const result: ILoadRestaurant = await response.json();
    return result;

  } else {
    throw response;
  }
}


export const sendReview = async (
  access_token: string,
  restaurant_id: string,
  review: string,
  rating: number
) => {
  const url_path = `/review/${restaurant_id}`;
  const url = `${apiUrl}${url_path}`;
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + access_token
  }
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: headers,
    body: JSON.stringify({ review, rating })
  });
  if (response.status === 201) {
    const result: IReview = await response.json();
    return result;
  } else {
    throw response;
  }
}


export const loadItems = async (
  access_token: string,
  offset: string,
  limit: number,
  endpoint: string
) => {
  const search_params = new URLSearchParams({
    offset: `${offset}`, limit: `${limit}`
  }).toString();
  const url = `${apiUrl}${endpoint}?${search_params}`;

  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + access_token
  }

  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    headers
  });
  if (response.status === 200) {
    return await response.json();
  } else {
    throw response;
  }
}
