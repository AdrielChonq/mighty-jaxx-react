# Coding Challenge for Full Stack Engineers

## Getting Started 
This project is running on Vercel. Endpoint is https://mighty-jaxx-react.vercel.app

Login account:

email: tester@mail.com

pw: P@ssw0rd1234

## Run on local machine
Clone this repo to your local machine and run the following commands to start the application

Installation
```sh
$ yarn install
# or
$ npm install
```

Prepare environment file at root folder
```sh
NEXT_PUBLIC_BASE_URL{{backend_nodejs_endpoint}}
#eg. http://localhost:8081
```

Or you can use the endpot below connect to the backend that deployed on vercel
>  NEXT_PUBLIC_BASE_URL=https://mighty-jaxx-nodejs.vercel.app

Build
```sh
$ nodemon
# or 
$ yarn build
# or
$ npm run build
```

Run
```sh
$ nodemon
# or 
$ yarn start
# or
$ npm run start
``` 

## Recommended to run on local machine
While you using https://mighty-jaxx-react.vercel.app for testing, you might encounter some of the iamges have loading issue. Checked the log and found out seem like having some connectivity issue network connectivity between Vercel and Mongodb even though whitelisted all IP addresses on Mongodb Atlas. I'm still finding a solution to resolve this issue. Instead, recommeded you clone both backend and frontend to your local machine and conduct the testing.

Below is the error message capture from the vercel.
>Connection error MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted. Make sure your current IP address is on your Atlas cluster's IP whitelist

## Requirements
- React 
- Any state management library. Redux is preferred, but no penalty for using other state management libraries. No props drilling
- MongoDB or Firestore database
- Node.JS
- Express.JS

You have 14 days upon receiving this test to complete and submit it back to us

## Instructions
The purpose of this code challenge is to build an admin dashboard with authentication protection and the ability to add new products.

1. Clone this repository and create your own GitHub repository.
2. Push your git repository to GitHub.
3. Initialize a new React project and Node.JS project. 
4. The website should make API calls to the Node.JS app and not interact with the database directly.
5. Create the login page with the following features: 
   - Text inputs for email and password.
   - Submit button.
   - Show an error message for incorrect credentials.
   - Make the page responsive for mobile and desktop devices.
   - Redirect to the admin dashboard page (to be built in the next step) for correct credentials.
6. Build the admin dashboard page:
   - Show a list of products (the products should be fetched from a database). Each product has the following data: SKU, title and image.
   - Add the option to add a new product (should be added to the database as well).
   - Add the option to edit an existing product (should be edited in the database as well).
   - Add the option to remove an existing product (should be removed from the database as well).
   - Add a logout button that redirects to the login page. 
   - Make the page responsive for mobile and desktop devices.
7. When you are done, send us the link to your GitHub repository with a clear readme file and also deploy it on a small server such as Heroku/Vercel and send us the link to test

## Bonus
Bonus points for adding a search bar in the admin dashboard to search for products. 
