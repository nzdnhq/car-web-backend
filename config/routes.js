const express = require('express')
const controllers = require('../app/controllers')

const apiRouter = express.Router()

// Cars
apiRouter.get(
  '/api/v1/cars/',
  controllers.api.v1.authController.authorize,
  controllers.api.v1.carController.findcar,
)

/* AUTHENTICATION & AUTHORIZATION */

// login users
apiRouter.post('/api/v1/login', controllers.api.v1.authController.login)

// register user
apiRouter.post('/api/v1/register', controllers.api.v1.authController.register)

// logout user
apiRouter.post('/api/v1/logout', controllers.api.v1.authController.logoutLocal)

//Checking sessionStorage
//apiRouter.get('/api/v1/sesi', controllers.api.v1.authController.getSesi)

// check current user
apiRouter.get(
  '/api/v1/auth/me',
  controllers.api.v1.authController.authorize,
  controllers.api.v1.authController.whoAmI,
)

// google login/register

apiRouter.post(
  '/api/v1/auth/google',
  controllers.api.v1.authController.handleGoogleLoginOrRegister,
)

/*
// open Api
apiRouter.get("/api/v1/docs/swagger.json", (req, res) => {
  res.status(200).json(swaggerDocument);
});
apiRouter.use(
  "/api/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

*/
apiRouter.use(controllers.api.main.onLost)
apiRouter.use(controllers.api.main.onError)

module.exports = apiRouter
