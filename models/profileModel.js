import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    gender:{
        type:String,
        enum:[
            "Male", "Female", "Other"
        ],
        required:true,
    },
    DOB:{
        type:Date,
        required:true,
    },
    relationship:{
        type:String,
        trim: true,
    },
    height:{
        type:Number,
        min:0,
        max:300,
        required:true,
    },
    weight:{
        type:Number,
        min:0,
        max:200,
        required:true,
    },
    country:{
        type:String,
        required:true,
        trim: true,
    },
    diet_type:{
        type:String,
        required:true,
        enum:["Vegan", "Vegetarian", "Non Vegetarian"],
    },
    sleep_quality:{
        type:String,
        required:true,
        enum:["Low","Normal","High"],
    },
    hydration_level:{
        type:String,
        required:true,
        num:["Low","Normal","High"],
    },
    stress_level:{
        type:String,
        required:true,
        enum:["Low","Normal","High"],
    },
    smoking:{
        type:String,
        required:true,
        enum:["Yes","No"],
    },
    alcohol_intake:{
        type:String,
        required:true,
        enum:["Occasionally","Regularly","Never"],
    },
    symptoms:{
        type:[String],
        required:true,
        enum: ["Headache", "Muscle pain", "Dizziness", "Fatigue"],
        default:[],
    },
    symptom_severity:{
        type:String,
        required:true,
        enum:["none","mild","moderate","severe"],
    },
    details:{
        type:String,
        trim: true,
    },
    steps_walked:{
        type:Number, 
        min:0,
    },
    sleep_hours:{
        type:Number,
        min:0,
        max:24,  
    },
    water_intake:{
        type:Number, 
        min:0, 
    },
    BMI:{
        type:Number,
        min:0,  
    },
    heart_rate:{
        type:Number, 
        min:0, 
    },
    calorie_intake:{
        type:Number,
        min:0,
    },
},{ timestamps: true });

export default mongoose.model("Symptom", symptomSchema);