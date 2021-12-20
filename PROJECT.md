# Implementation requirements for the project

The requirements for the test project are:
Write an application to Review Restaurants

User must be able to create an account and log in. (If a mobile application, this means that more users can use the app from the same phone).

Implement 2 roles with different permission levels
    * Regular User: Can rate and leave a comment for a restaurant
    * Admin: Can add/edit/delete, restaurants, users and reviews

Reviews should have:
    * A 5 star based rate
    * Date of the visit
    * Comment

When a Regular User logs in he will see a Restaurant List ordered by Rate Average

When a restaurant is selected, a detailed view should be presented showing:
    * The overall average rating
    * The highest rated review
    * The lowest rated review
    * Latest review showing with rate and comment

## REST API

Make it possible to perform all user actions via the API, including authentication (If a mobile application and you don’t know how to create your own backend you can use Firebase.com or similar services to create the API).

In any case, you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.

## Frontend

If it’s a web application, it must be a single-page application. All actions need to be done client side using AJAX, refreshing the page is not acceptable. (If a mobile application, disregard this).

Functional UI/UX design is needed. You are not required to create a unique design, however, do follow best practices to make the project as functional as possible.

## Tests

Bonus: unit and e2e tests.