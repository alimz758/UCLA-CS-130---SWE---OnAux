# OnAux Back-end

App to create sessions for playing music and requesting songs.


# Setup

1. [Local Environment Setup](#local-environment-setup)
2. [.env Setup](#env-setup)
3. [Local Development Setup](#local-development-setup)
4. [Postman Setup](#postman-setup)

---

## Local Environment Setup

1. Install nodeJS by following installation guides from https://nodejs.org/en/download/
2. Clone the repository to your local environment using `git clone https://github.com/alimz758/UCLA-CS-130---SWE---OnAux.git`
3. Navigate to `Back-end` directory
4. Install all used packages and dependencies using:
   > npm install

5. Install mongoDB by following installation guides from:
   Mac: https://treehouse.github.io/installation-guides/mac/mongo-mac.html
   Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

   This is different from the npm package listed in package.json: which is the driver that connects the DB to the nodeJS app.
   For choosing the inital db location, just use the default --dbpath=/data/db to prevent future confusion

6. Follow the steps below to connect MongoDB to Robo 3T GUI
   https://dzone.com/articles/how-to-connect-your-mongodb-deployments-to-robo-3t



---
## .env Setup

In `Back-end` directory run `npm run-script build`. This command generate the `.env` file and copies(overwrites) the desired environment variables from

`env_variable` to `.env`.

Note: If you created new envirnoment varibles, don't forget to add it to `env_variable` so your teamates can use them as well.


---

## Local Development Setup

1. Open a terminal in `Back-end`, and run the command `mongod` to start the mongodb daemon - may have to run `sudo mongod` for permission purposes
2. Open another terminal and run `npm run dev` in the home directory
3. The local backend development port is set to 8000. You can use Postman for testing APIs
s
---

## Postman Setup

**Setting Up the Environment**

Follow the steps bellow to set up an environment for Postman to call the APIs

1. Create a new Collection, name it as you desire
2. Click on `More options` for the newly creted collection. Then click `Edit`
3. Then go to `Authorization` tab. From the `Type` drop down menu, choose `Bearer Token` and then in `Token` field write `{{token}}`. Press `Update` afterwards.
4. Now set up the environment.
5. On the top right corner of the screen, click on the setting icon and a `Manage Environments` Tab will open. Click on `Add`
6. Name the enironment as you wish. Then add two variables as follows:
   a. Define a variable `url` and set its Initial Value to `localhost:8000`
   b. Define a variable `token` and leave its Initial Value empty for now as when we call the Sign-up API the token will be set automatically

**Creating a Postman Request**

We first create the Sign-up API request. Follow the steps below:

1. Create a new API request, name it as you wish, under the newly created collection and set it as `Post` request, and type `{{url}}/user/signup` for the request field
2. Under `Body` copy something like the below format as `raw`, `JSON`. change their values as you wish

```
{
    "username" : "newuser1234",
    "email": "newuser@g.ucla.edu",
    "password" : "mypassword"
}
```

3. Under `Tests`, copy the below code to set up the token after sending the request

```
if (pm.response.code === 201) {
   console.log(pm.response.json())
   pm.environment.set('token',pm.response.json().token)
}
```

4. For all other requests that you wish to make, make sure under `Authorization` tab to set `Type` as `inherit auth from parent`

---
