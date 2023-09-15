const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const employeeSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        
    },
    phone:{
        type:Number,
        required:true,
        
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
},
tokens:[{
    token:{
        type:String,
        required:true
    }
}]
})

//generating token
employeeSchema.methods.generateAuthToken = async function () {
    try {
        // Use a regular function to ensure `this` refers to the document
        const token = await jwt.sign({ _id: this._id }, "mynameisaayushdhamanifrombandikui");
        console.log(token);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log("the error part " + error);
    }
};


//creating hashing
employeeSchema.pre("save",async function(next){
if(this.isModified("password")){
    // console.log(`before hashing ${this.password}`);
    this.password=await bcrypt.hash(this.password,10);
    this.confirmpassword=await bcrypt.hash(this.confirmpassword,10);
    // console.log(`after hashing is ${this.password}`);
}
next();
})

//create collection
const Register =new mongoose.model("Register",employeeSchema);


module.exports=Register;
