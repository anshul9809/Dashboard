const expressAsyncHandler = require("express-async-handler");
const Software = require("../models/Software");
const cloudinary = require("cloudinary").v2;
const {validateMongoDbId} = require("../utils/validateMongoDbId");

const createSoftware = expressAsyncHandler(async (req,res)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        throw new Error("Please provide an svg");
    }
    const {svg} = req.files;
    const {name, proficiency} = req.body;
    if(!name || !proficiency){
        throw new Error("Please fill all the required fields");
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        { folder: "PORTFOLIO SOFTWARE APPLICATION IMAGES" }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary error"
    );
        throw new Error("Failed to upload avatar to Cloudinary");
    }
    const software = await Software.create({
        name, proficiency,svg:{
            public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
            url: cloudinaryResponse.secure_url,
        }
    });
    res.status(200).json({
        success:true,
        message: "Created Successsfully",
        software
    });
});

const updateSoftware = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const software = await Software.findById(id);
        if (!software) {
            throw new Error("Software not found");
        }
        const {name, proficiency} = req.body;
        if(req.files){
            const softwareSvg = software.svg.public_id;
            await cloudinary.uploader.destroy(softwareSvg);
            const {svg} = req.files;
            const cloudinaryResponse = await cloudinary.uploader.upload(
                svg.tempFilePath,
                { folder: "PORTFOLIO SOFTWARE APPLICATION IMAGES" }
            );
            if (!cloudinaryResponse || cloudinaryResponse.error) {
                console.error(
                    "Cloudinary Error:",
                    cloudinaryResponse.error || "Unknown Cloudinary error"
                );
                throw new Error("Failed to upload avatar to Cloudinary");
            }
            software.svg = {
                public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
                url: cloudinaryResponse.secure_url,
            };
        }
        software.name = name;
        software.proficiency = proficiency;
        await software.save();
        res.status(200).json({
            success:true,
            message: "Updated Successfully",
            software
        });
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }

});

const deleteSoftware = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const software = await Software.findByIdAndDelete(id);
        if (!software) {
            throw new Error("Software not found");
        }
        res.status(200).json({
            success:true,
            message:"Software deleted successfully"
        })

    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});

const getAllSoftware = expressAsyncHandler(async (req,res)=>{
    try{
        const softwares = await Software.find({});
        res.status(200).json({
            success:true,
            softwares
        });
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});

const getSoftware = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const software = await Software.findById(id);
        res.status(200).json({
            success:true,
            software
        });
    }catch(err){
        throw new Error("Internal server error, Unable to fetch the data");
    }
});


module.exports = {
    createSoftware,
    deleteSoftware,
    updateSoftware,
    getAllSoftware,
    getSoftware
};