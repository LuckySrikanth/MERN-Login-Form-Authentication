const express = require("express")
const mongoose = require("mongoose")
const RegisterDetails = require("./model")
const middleware = require("./middleware")
const jwt = require("jsonwebtoken");
const cors = require("cors")

const app = express()
app.use(express.json());
app.use(cors({origin : "*"}))

mongoose.connect("mongodb+srv://srikanth:srikanth@cluster0.jsmfma8.mongodb.net/?retryWrites=true&w=majority").then(
    () => console.log("DB Connnceted"))

app.get("/", (req, res) => {
    res.send("Welcome to Server Side FrameWork")
})

app.post("/register", async (req, res) => {

    try {
        const { username, email, password, confirmpassword } = req.body
        const exist = await RegisterDetails.findOne({ email })
        if (exist) {
            return res.status(400).send("User Already Exits")
        }
        if (password !== confirmpassword) {
            res.status(400).send("Password not Matched")
        }
        const newUser = new RegisterDetails({
            username,
            email,
            password,
            confirmpassword
        })
        await newUser.save(),
        res.status(200).send("user Register Sucessfully")


    } catch (error) {
        console.log(error)
    }
})


app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body
        const exist = await RegisterDetails.findOne({email})
        if(!exist) {
            res.status(400).send("User Not Found")
        }
        if(password !== password) {
            res.status(400).send("Password Not Match")
        }

        const payload = {
            user : {
                id : exist.id
            }
        }

        jwt.sign(payload, "jwtSecurity",{expiresIn : 3600000},
            (error, token) => {
                if(error) 
                    if(error) throw error;
                    return res.json({token})
                
            }
            
            )

    } catch (error) {
        console.log(error)
    }
})


app.get("/myprofile", middleware,async(req,res) => {
    try {
        let exist = await RegisterDetails.findById(req.user.id);
        if(!exist) {
            res.status(400).send("User not found");
        }
        res.json(exist)

    } catch (error) {
        console.log(error)
    }
})

app.listen(5000, () => console.log("express 5000 port is running"));