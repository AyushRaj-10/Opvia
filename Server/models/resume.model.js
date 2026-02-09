import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    ownerId:{
        type:String,
        required:true
    },
    personal:{
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            
        },
        phone:{
            type:String,
            
        },
        linkedIn:{
            type:String,
           
        },
        portfolio:{
            type:String,
            
        },
    },
    summary:{
        type:String,
        
    },
    skills: {
        type: [String],
        default: []
      },
    experience:[
        {
            role:{
                type:String,
                
            },
            company:{
                type:String,
                
            },
            duration:{
                type:String,
                
            },
            description:{
                type:String,
                
            }
        }
    ],
    projects:[
        {
            title:{
                type:String,
                
            },
            link:{
                type:String,
                
            },
            description:{
                type:String,
                
            }
        }
    ],
    education:[
        {
            institution:{
                type:String,
                
            },
            degree:{
                type:String,
                
            },
            duration:{
                type:String,
                
            }
        }
    ],
},{timestamps:true});

export const Resume = mongoose.model("Resume",ResumeSchema);