# Nodejs Tasks REST API with Express

# Environment variables
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|NODE_ENV           | Node enviroment development or production            | -     |
|DATABASE           | MongoDB srv        | -   |
|PORT           | PORT for connection 3000 || 8000            | -     |
|JWT_SECRET           | 32 chars long string for crypting           | -     |
|JWT_EXPIRE           | Expiration for JWT as 30d (30 DAYS)          | -      |
|EMAIL_ADDRESS         | Email address for sending mail         | -      |
|EMAIL_PASSWORD          | Email password of mail          | -      |
|EMAIL_HOST          | Email host          | -      |
|EMAIL_PORT        | Email port        | -      |
|COOKIE_JWT_EXPIRATION          | Days as 30 (30 DAYS)          | -      |



# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 20.9.0


# Getting started
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:3000`

- API Document endpoints

  **GET : http://localhost:8001/api/v1/tasks/critics Get all the critic tasks**<br>
  **GET : http://localhost:8001/api/v1/tasks/stats Get the stats of tasks**<br>
  **GET : http://localhost:8001/api/v1/tasks Get all tasks**<br>
  **POST : http://localhost:8001/api/v1/tasks Create task**<br>
  **GET : http://localhost:8001/api/v1/tasks/:id Get task by id**<br>
  **PATCH : http://localhost:8001/api/v1/tasks Update task**<br>
  **DELETE : http://localhost:8001/api/v1/tasks Delete task**<br><br>
  
  **POST : http://localhost:8001/api/v1/users/signup Sign up**<br>
  **POST : http://localhost:8001/api/v1/users/login Log in**<br>
  **POST : http://localhost:8001/api/v1/users/forgotPassword Forgot password request**<br>
  **PATCH : http://localhost:8001/api/v1/users/resetPassword/:token Reset password for forgotPassword**<br>
  **DELETE : http://localhost:8001/api/v1/users/deleteMyAccount Delete current account**<br>
  **PATCH : http://localhost:8001/api/v1/users/updatePassword Update Password**<br>
  **GET : http://localhost:8001/api/v1/users Get all the users**<br>
  **GET : http://localhost:8001/api/v1/users/:id Get user by id**<br>
  **PATCH : http://localhost:8001/api/v1/users/:id Update user**<br>
  **DELETE : http://localhost:8001/api/v1/users/deleteMyAccount Delete your own account**<br>

  

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **node_modules**         | Contains all  npm dependencies                                                            |                        |
| **/controllers**      | Controllers define functions to serve various express routes. 
| **/routes**           | Contain all express routes, separated by module/area of application                       
| **/models**           | Models define schemas that will be used in storing and retrieving data from Application database  |
| **/utils**           | Contain all the utilities such as features email and appError  |
| **app.js**          | App... |
| **server.js**           | Server...  |



| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs server.js on development `npm start`                  |
| `start:prod`                   | Runs server.js on production  `npm run start:prod`      |
