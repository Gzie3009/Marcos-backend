const express = require("express");
const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const jwt = require("jsonwebtoken");
const JWT_KEY = "abcdefghijklmnopqrstuvwxyz";
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://marcos123.netlify.app",
];
app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
  .connect(process.env.DB)
  .then(function () {
    console.log("db connected");
  })
  .catch((e) => {
    console.log(e);
  });

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
});

userSchema.pre("save", async function () {
  let salt = await bcrypt.genSalt();
  const hash = bcrypt.hashSync(this.password, salt);
  this.password = hash;
});

const postSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  }
});

const researchSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

const internshipSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

const projectSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

const contactModel = mongoose.model("contactModel", contactSchema);
const researchModel = mongoose.model("ResearchModel", researchSchema);
const projectModel = mongoose.model("projectModel", projectSchema);
const internModel = mongoose.model("internshipModel", internshipSchema);
const postModel = mongoose.model("postModel", postSchema);
const userModel = mongoose.model("userModel", userSchema);

const userRouter = express.Router();
app.use("/users", userRouter);

userRouter.route("/register").post(signup);

async function signup(req, res) {
  try {
    const user = await userModel.create(req.body);

    if (user) {
      res.status(200).json({
        message: "success",
        status: 200,
      });
    }
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
}
userRouter.route("/allusers").get(getAll);

async function getAll(req, res) {
  try {
    const data = await userModel.find();
    if (data) {
      res.json({
        users: data,
        status: 200,
      });
    } else {
      res.json({
        message: "unsucessfull",
        status: 404,
      });
    }
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
}

userRouter.route("/delete/:email").delete(deleteUser);

async function deleteUser(req, res) {
  try {
    const email = req.params.email;
    const user = await userModel.findOne({ email: email });
    if (user) {
      await userModel.deleteOne({ email: email });
      res.status(200).json({
        message: "user deleted successfully",
        status: 200,
      });
    } else {
      res.status(404).json({
        message: "user not found",
        status: 404,
      });
    }
  } catch (e) {
    res.status(500).json({
      message: e.message,
      status: 500,
    });
  }
}

userRouter.route("/delete/project/:email").delete(deleteProject);

async function deleteProject(req, res) {
  try {
    const email = req.params.email;
    const user = await projectModel.findOne({ email: email });
    if (user) {
      await projectModel.deleteOne({ email: email });
      res.status(200).json({
        message: "user deleted successfully",
        status: 200,
      });
    } else {
      res.status(404).json({
        message: "user not found",
        status: 404,
      });
    }
  } catch (e) {
    res.status(500).json({
      message: e.message,
      status: 500,
    });
  }
}

userRouter.route("/delete/research/:email").delete(deleteResearch);

async function deleteResearch(req, res) {
  try {
    const email = req.params.email;
    const user = await researchModel.findOne({ email: email });
    if (user) {
      await researchModel.deleteOne({ email: email });
      res.status(200).json({
        message: "user deleted successfully",
        status: 200,
      });
    } else {
      res.status(404).json({
        message: "user not found",
        status: 404,
      });
    }
  } catch (e) {
    res.status(500).json({
      message: e.message,
      status: 500,
    });
  }
}

userRouter.route("/delete/intern/:email").delete(deleteIntern);

async function deleteIntern(req, res) {
  try {
    const email = req.params.email;
    const user = await internModel.findOne({ email: email });
    if (user) {
      await internModel.deleteOne({ email: email });
      res.status(200).json({
        message: "user deleted successfully",
        status: 200,
      });
    } else {
      res.status(404).json({
        message: "user not found",
        status: 404,
      });
    }
  } catch (e) {
    res.status(500).json({
      message: e.message,
      status: 500,
    });
  }
}

userRouter.route("/signin").post(login);

async function login(req, res) {
  try {
    if (req.body.email) {
      let user = await userModel.findOne({ email: req.body.email });
      if (user) {
        bcrypt.compare(
          req.body.password,
          user.password,
          function (err, result) {
            if (result) {
              const uid = user._id;
              const token = jwt.sign({ payload: uid }, JWT_KEY);
              res.status(200).json({
                message: "user logged in successfully",
                status: 200,
                token: token,
                name: user.name,
                email: user.email,
              });
            }
            if (err) {
              res.status(400).json({
                message: "invalid credentials",
              });
            }
          }
        );
      } else {
        res.status(401).json({
          message: "user not found",
        });
      }
    } else {
      res.status(300).json({
        message: "please fill the empty fields",
      });
    }
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
}
userRouter.route("/contact").post(contactus);

async function contactus(req, res) {
  try {
    if (req.body.email) {
      const message = await contactModel.create(req.body);
      if (message) {
        res.json({
          message: "message sent successfully",
          status: 200,
        });
      }
    }
  } catch (e) {
    res.json({
      message: e.message,
      status: e.status,
    });
  }
}

app.get("/", function (req, res) {
  res.send("hello from backend");
});

userRouter.route("/post").get(posts).post(regpost);

async function regpost(req, res) {
  try {
    if (req.body) {
      const data = await postModel.create(req.body);
      if (data) {
        res.json({
          message: "Successfull",
          status: 200,
        });
      } else {
        res.json({
          message: "unsucessfull",
          status: 404,
        });
      }
    } else {
      res.json({
        message: "Invalid Credentials",
      });
    }
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
}

async function posts(req, res) {
  try {
    const data = await postModel.find();
    if (data) {
      res.json({
        post: data,
        status: 200,
      });
    } else {
      res.json({
        message: "unsucessfull",
        status: 404,
      });
    }
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
}

userRouter.route("/researchpost").post(addResearch).get(getResearch);

userRouter.route("/projectpost").post(addProject).get(getProject);

userRouter.route("/internpost").post(addIntern).get(getIntern);

async function addIntern(req, res) {
  try {
    if (req.body) {
      const data = await internModel.create(req.body);
      if (data) {
        res.json({
          message: "Successfull",
          status: 200,
        });
      } else {
        res.json({
          message: "unsucessfull",
          status: 404,
        });
      }
    } else {
      res.json({
        message: "Invalid Credentials",
      });
    }
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
}
async function getIntern(req, res) {
  try {
    const data = await internModel.find();
    if (data) {
      res.json({
        post: data,
        status: 200,
      });
    } else {
      res.json({
        message: "unsucessfull",
        status: 404,
      });
    }
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
}

async function addProject(req, res) {
  try {
    if (req.body) {
      const data = await projectModel.create(req.body);
      if (data) {
        res.json({
          message: "Successfull",
          status: 200,
        });
      } else {
        res.json({
          message: "unsucessfull",
          status: 404,
        });
      }
    } else {
      res.json({
        message: "Invalid Credentials",
      });
    }
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
}
async function getProject(req, res) {
  try {
    const data = await projectModel.find();
    if (data) {
      res.json({
        post: data,
        status: 200,
      });
    } else {
      res.json({
        message: "unsucessfull",
        status: 404,
      });
    }
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
}

async function addResearch(req, res) {
  try {
    if (req.body) {
      const data = await researchModel.create(req.body);
      if (data) {
        res.json({
          message: "Successfull",
          status: 200,
        });
      } else {
        res.json({
          message: "unsucessfull",
          status: 404,
        });
      }
    } else {
      res.json({
        message: "Invalid Credentials",
      });
    }
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
}
async function getResearch(req, res) {
  try {
    const data = await researchModel.find();
    if (data) {
      res.json({
        post: data,
        status: 200,
      });
    } else {
      res.json({
        message: "unsucessfull",
        status: 404,
      });
    }
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
}

app.listen(process.env.PORT || 3010, () => {
  console.log(`listening on port localhost:${3010}`);
});
