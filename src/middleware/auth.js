const jwt=require("jsonwebtoken");
const Register=require("../models/register");

const auth=async(req, res, next)=>{
    try {
        const token=req.cookies.jwt;
        // console.log(token);
        const verifyUser=jwt.verify(token, "mynameisaayushdhamanifrombandikui");
        console.log(verifyUser);
        const user=Register.findOne({_id:verifyUser._id});
        console.log(user);
        req.token=token;
        req.user=user;
        next();

    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports=auth;