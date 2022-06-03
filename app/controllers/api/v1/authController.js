const bcrypt = require("bcryptjs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const userService = require("../../../services/authService");
var sessionStorage = require("sessionstorage");
const Salt = 10;

function encryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, Salt, (err, encryptedPassword) => {
      if (!!err) {
        reject(err);
        return;
      }

      resolve(encryptedPassword);
    });
  });
}

function checkPassword(encryptedPassword, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword, (err, isPasswordCorrect) => {
      if (!!err) {
        reject(err);
        return;
      }

      resolve(isPasswordCorrect);
    });
  });
}

// Function check email
function checkEmailExist(emailBody, emailTable) {
  console.log("\nEMAIL: " + emailBody);
  console.log("\nEMAIL TABLE = " + emailTable + "\n");
  console.log("CHECK EMAIL RUNS");
  if (emailBody === emailTable) {
    return true;
  } else {
    return false;
  }
}

// function create token
function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "secret", {
    expiresIn: 10 * 60,
  });
}

/* Verify token function */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || "secret");
}

module.exports = {
  // function Register
  async register(req, res) {
    const name = req.body.name;
    const registeredVia = "webPage";

    if (req.body.email === null) {
      res.status(404).json({
        message: "Email Kosong",
      });
    }
    const email = req.body.email;
    let emailTable = JSON.parse(JSON.stringify(await userService.findSer(email)));
    console.log("EMAIL TABLE " + emailTable);
    if (emailTable === null) {
      emailTable = "email@email.com";
    }
    const ifEmailExist = checkEmailExist(email, emailTable.email);
    if (ifEmailExist === true) {
      res.status(409).json({
        message: "Email Already Existed",
      });
      return;
    }

    if (req.body.password === "") {
      res.status(404).json({
        status: "FAIL",
        message: "Password Kosong!",
      });
      return;
    }
    const password = await encryptPassword(req.body.password);

    userService
      .createSer({ name, email, password, registeredVia })
      .then((post) => {
        const dataRegis = JSON.stringify(post);
        console.log("DATA REGISTER: " + dataRegis);

        delete dataRegis.password;

        const dataPost = JSON.parse(dataRegis);

        const token = createToken({
          id: dataPost.id,
          nama: dataPost.name,
          email: dataPost.email,
          createdAt: dataPost.createdAt,
          updatedAt: dataPost.updatedAt,
        });

        console.log("TOKEN STLH REGISTER: " + token);

        // delete post.password;
        res.status(201).json({
          status: "OK",
          message: "Register Successful",
          token: token,
        });
      })
      .catch((err) => {
        res.status(422).json({
          status: "FAIL",
          message: err.message,
        });
      });
  },

  // function checking sessionStorage
  // async getSesi(req, res) {
  //   const sesi = sessionStorage.getItem("token");
  //   if (sesi !== null) {
  //     res.status(201).json({ dataSesi: sesi });
  //   } else {
  //     res.status(401).json({ message: "Session empty" });
  //   }
  // },

  // function login
  async login(req, res) {
    const email = req.body.email.toLowerCase(); // Biar case insensitive
    const password = req.body.password;

    // const user = await users.findOne({
    //   where: { email },
    // });
    console.log(sessionStorage.getItem("token"));
    const user = await userService.findSer(email);

    if (!user) {
      res.status(404).json({ message: "Email tidak ditemukan" });
      return;
    }

    const isPasswordCorrect = await checkPassword(user.password, password);

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Password salah!" });
      return;
    }

    // Create token
    const token = createToken({
      id: user.id,
      nama: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    // Return token and some information
    res.status(201).json({
      // id: user.id,
      // nama: user.name,
      // email: user.email,
      token: token,
      message: "Login Successfull",
      createdAt: user.createdAt,
      //updatedAt: user.updatedAt,
    });

    // Insert token into sessionStorage
    //sessionStorage.setItem("token", token);

    // console.log('User: ' + sessionStorage.getItem('token'))
  },

  // authorize user
  async authorize(req, res, next) {
    try {
      // Take bearer token from request header
      const bearerToken = req.headers.authorization;

      console.log("Bearer " + bearerToken);

      // Split bearer token from Bearer string
      const token = bearerToken.split("Bearer ")[1];

      /* GET TOKEN FROM LOCALSTORAGE */
      //req.headers.authorization = sessionStorage.getItem("token");

      // Set token from sessionStorage
      //const token = sessionStorage.getItem("token");

      console.log("TOKEN: " + token);

      // Verify token and get payload
      const tokenPayload = verifyToken(token);

      console.log("Payload" + tokenPayload.id);

      // Get Users from database by id of payload
      req.Users = JSON.parse(JSON.stringify(await userService.findPkSer(tokenPayload.id)));

      console.log("REQUEST" + req.Users);

      // Delete encrypted password from Users object
      delete req.Users.password;

      console.log("ISI USERS: " + req.Users);

      next();
    } catch (error) {
      // If token expired
      if (error.message.includes("jwt expired")) {
        res.status(401).json({ message: "Token expired" });
        return;
      }

      // If error, return error
      res.status(401).json({
        // message: 'Akses Ditolak! (Unauthorized Access !)',
        message: error.message,
      });
    }
  },

  // check current user
  async whoAmI(req, res) {
    console.log("ISI USERS: " + req.Users);
    res.status(201).json({
      accountData: req.Users,
    });
  },

  async logoutLocal(req, res) {
    sessionStorage.removeItem("token");
    sessionStorage.clear();

    res.status(201).json({
      message: "Logout Successfull",
    });
  },

  // ------------------------google login or register
  async handleGoogleLoginOrRegister(req, res) {
    const { access_token } = req.body;
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
      const { sub, email, name } = response.data;
      let user = await userService.findUserGoogle(sub);
      if (!user) {
        user = await userService.createSer({
          name: name,
          email: email,
          password: "",
          googleId: sub,
          registeredVia: "google",
        });
      }
      user = JSON.parse(JSON.stringify(user));
      delete user.password;
      console.log(user);
      const token = createToken(user);
      const userData = name;
      res.status(201).json({ token, userData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
