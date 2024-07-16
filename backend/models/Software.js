const mongoose = require("mongoose");
const SoftwareSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true, "Name required"],
    },
    svg: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    proficiency:{
        type: Number,
        required:true
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Software", SoftwareSchema);