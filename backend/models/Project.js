const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
    title: {
        type:String,
        unique:true
    },
    description: String,
    gitRepoLink:String,
    projectLink:String,
    technologies:String,
    stack:String,
    deployed:String,
    projectBanner:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    projectSnapshots: [
        {
            public_id: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
},{
    timestamps:true
});

module.exports = mongoose.model("Project", ProjectSchema);