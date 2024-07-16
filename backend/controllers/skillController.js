const expressAsyncHandler = require("express-async-handler");
const Skill = require("../models/Skill");
const {validateMongoDbId} = require("../utils/validateMongoDbId");
const cloudinary = require("cloudinary").v2;

const createSkill = expressAsyncHandler(async (req,res)=>{
    if (!req.files || Object.keys(req.files).length === 0) {
        throw new Error("Image For Skill Required!");
    }
    const { svg } = req.files;
    const { title, proficiency } = req.body;
    if (!title || !proficiency) {
        throw new Error("Please Fill Full Form!");
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        { folder: "PORTFOLIO SKILL IMAGES" }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
          "Cloudinary Error:",
          cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        throw new Error("Failed to upload avatar to Cloudinary");
    }
    const skill = await Skill.create({
        title,
        proficiency,
        svg: {
          public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
          url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
        },
    });
    res.status(201).json({
        success: true,
        message: "New Skill Added",
        skill,
    });
});

const updateSkill = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const {name, proficiency} = req.body;
        if(req.files){
            const { svg } = req.files;
            const cloudinaryResponse = await cloudinary.uploader.upload(
                svg.tempFilePath,
                { folder: "PORTFOLIO SKILL IMAGES" }
            );
            if (!cloudinaryResponse || cloudinaryResponse.error) {
                console.error(
                    "Cloudinary Error:",
                    cloudinaryResponse.error || "Unknown Cloudinary error"
                );
                throw new Error("Failed to upload avatar to Cloudinary");
            }
            const updatedSkill = await Skill.findByIdAndUpdate(id,{
                $set:{
                    svg:{
                        public_id: cloudinaryResponse.public_id,
                        url: cloudinaryResponse.secure_url,
                        },
                    },
                    name:name,
                    proficiency:proficiency
                },
                {new:true}
            );
            res.status(200).json({
                success: true,
                message: "Skill Updated Successfully",
                updatedSkill,
            });

        }
    }catch(err){
        throw new Error("Internal server error, unable to update skill");
    }
});

const deleteSkill = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const { id } = req.params;
        let skill = await Skill.findById(id);
        if (!skill) {
            throw new Error("Already Deleted!");
        }
        const skillSvgId = skill.svg.public_id;
        await cloudinary.uploader.destroy(skillSvgId);
        await skill.deleteOne();
        res.status(200).json({
            success: true,
            message: "Skill Deleted!",
        });
    }catch(err){
        throw new Error("Internal server Error, unable to update skill")
    }
});

const getAllSkill = expressAsyncHandler(async (req,res)=>{
    try{
        const skills = await Skill.find({});
        res.status(200).json({
            success:true,
            skills
        })
    }catch(err){
        throw new Error("Unable to find the skills");
    }
});

const getSkill =expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const skill = await Skill.findById(id)
        if(!skill){
            throw new Error("Skill not found");
        }
        res.status(200).json({
            success:true,
            skill
        });
    }catch(err){
        throw new Error("Something went wrong");
    }
});


module.exports = {
    createSkill,
    updateSkill,
    deleteSkill,
    getAllSkill,
    getSkill
}