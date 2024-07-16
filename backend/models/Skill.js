const mongoose = require("mongoose");

const SkillSchema = mongoose.Schema({
    title: {
        type: String,
    },
    proficiency: {
        type: Number,
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
},{
  timestamps:true
});

module.exports = mongoose.model("Skill", SkillSchema);