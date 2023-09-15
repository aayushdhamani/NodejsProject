const express = require("express");
const path = require("path");
require("./db/conn");
const app = express();
const hbs = require("hbs");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const auth=require("./middleware/auth");
const cookieParser = require('cookie-parser')
const UserData = require("./models/user");
const Register = require("./models/register");
const port = process.env.PORT || 8000;

// path setiing
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../template/views");
const partials_path = path.join(__dirname, "../template/partials");
// console.log(path.join(__dirname,"../template/partials"))
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

//routing
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login",async (req, res)=>{
    res.render("login");
})

app.get("/secret",auth,(req, res, next)=>{
    res.render("secret");
})

app.post("/contact", async (req, res) => {
  try {
    const user = new UserData(req.body);
    await user.save();
    res.status(201).render("index");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/register", async (req, res) => {
    try {
      const password = req.body.password;
      const confirmpassword = req.body.confirmpassword;
  
      if (password === confirmpassword) {
        const registerUser = new Register({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone,
          age: req.body.age,
          gender: req.body.gender,
          password: password,
          confirmpassword: confirmpassword,
        });

        //token
        const token= await registerUser.generateAuthToken();
        console.log("token part is"+token);

        res.cookie("jwt", token,{
          expires:new Date(Date.now()+500000),
          httpOnly:true
        }); // Setting the "jwt" cookie
          console.log(token); // Logging the JWT token

        console.log("hello wold");
        const registered = await registerUser.save();
        res.status(201).render("login");
      } else {
        res.status(400).send("Invalid password");
      }
    } catch (error) {
      res.status(404).send(error);
    }
  });

  app.post("/login",async(req,res)=>{
      try {
        const email=req.body.email;
        const password=req.body.password;

        const useremail=await Register.findOne({email:email});
        // console.log(useremail);
        const isMatch=await bcrypt.compare(password,useremail.password);

        const token= await useremail.generateAuthToken();
        // console.log("token part is "+token);
        res.cookie("jwt", token,{
          expires:new Date(Date.now()+500000),
          httpOnly:true
        }); // Setting the "jwt" cookie
          console.log(token); // Logging the JWT token

          // console.log(`hello cookie is ${req.cookies.jwt}`);
        if(isMatch){
          res.status(201).render("index");
      }
      else{
          res.send("Envalid Email1");
      }
      } catch (error) {
        res.status(404).send("Envalids email");
      }
  })
  app.get("/logout", auth, async (req, res) => {
    try {
        // Clear the JWT cookie first
        console.log(req.user);
        // req.user.tokens=req.users.tokens.filter((currElement)=>{
        //   return currElement.token!=req.token
        // })
        res.clearCookie("jwt");
        // Save the user after clearing the cookie
        // await req.user.save();

        console.log("logout successfully");
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
