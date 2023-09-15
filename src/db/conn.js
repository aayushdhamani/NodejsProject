const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://itsayush:itsayush@cluster0.5412s9y.mongodb.net/dynamicProject").then(()=>{
    console.log("connection successful");
}).catch((error)=>{
    console.log(error)
})