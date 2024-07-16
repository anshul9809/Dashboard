const expressAsyncHandler = require("express-async-handler");
const Project = require("../models/Project");
const {validateMongoDbId} = require("../utils/validateMongoDbId");
const cloudinary = require("cloudinary").v2;

const createProject = expressAsyncHandler(async (req,res)=>{
    if (!req.files || Object.keys(req.files).length === 0) {
        throw new Error("Project Banner Image Required!");
    }
    const { projectBanner, projectSnapshots } = req.files;
    const {
        title,
        description,
        gitRepoLink,
        projectLink,
        stack,
        technologies,
        deployed,
    } = req.body;
    if(!title || !description || !gitRepoLink || !stack || !technologies || !deployed){
        throw new Error("Please fill all the required fields");
    }
    // Upload project banner
    const bannerUploadResponse = await cloudinary.uploader.upload(projectBanner.tempFilePath, {
        folder: "PORTFOLIO PROJECT IMAGES"
    });

    if (!bannerUploadResponse || bannerUploadResponse.error) {
        console.error("Cloudinary Error:", bannerUploadResponse.error || "Unknown Cloudinary error");
        throw new Error("Failed to upload project banner to Cloudinary");
    }

    // Upload project snapshots if any
    let snapshotUploadResponses = [];
    if (projectSnapshots) {
        const snapshotFiles = Array.isArray(projectSnapshots) ? projectSnapshots : [projectSnapshots];
        for (const snapshot of snapshotFiles) {
            const snapshotUploadResponse = await cloudinary.uploader.upload(snapshot.tempFilePath, {
                folder: "PORTFOLIO PROJECT SNAPSHOTS"
            });

            if (!snapshotUploadResponse || snapshotUploadResponse.error) {
                console.error("Cloudinary Snapshot Upload Error:", snapshotUploadResponse.error || "Unknown Cloudinary error");
                throw new Error("Failed to upload project snapshot to Cloudinary");
            }

            snapshotUploadResponses.push({
                public_id: snapshotUploadResponse.public_id,
                url: snapshotUploadResponse.secure_url,
            });
        }
    }
    const project = await Project.create({
        title,
        description,
        gitRepoLink,
        projectLink,
        stack,
        technologies,
        deployed,
        projectBanner: {
            public_id: bannerUploadResponse.public_id,
            url: bannerUploadResponse.secure_url,
        },
        projectSnapshots: snapshotUploadResponses,
    });
    res.status(200).json({
        success:true,
        message: "Project created successfully",
        project
    });
});

const updateProject = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const newProjectData = {
            title: req.body.title,
            description: req.body.description,
            stack: req.body.stack,
            technologies: req.body.technologies,
            deployed: req.body.deployed,
            projectLink: req.body.projectLink,
            gitRepoLink: req.body.gitRepoLink,
        };
        if (req.files && req.files.projectBanner) {
            const projectBanner = req.files.projectBanner;
            const project = await Project.findById(req.params.id);
            const projectImageId = project.projectBanner.public_id;
            await cloudinary.uploader.destroy(projectImageId);
            const newProjectImage = await cloudinary.uploader.upload(
              projectBanner.tempFilePath,
              {
                folder: "PORTFOLIO PROJECT IMAGES",
              }
            );
            newProjectData.projectBanner = {
              public_id: newProjectImage.public_id,
              url: newProjectImage.secure_url,
            };
        }
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            newProjectData,
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
        );
        res.status(200).json({
            success: true,
            message: "Project Updated!",
            project,
        });
    }catch(err){
        throw new Error("Error while updating project");
    }
});

const deleteProject = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const project = await Project.findById(id);
        if(!project){
            throw new Error("Project not found or already deleted");
        }
        // delete the project snapshots from the clidinary and project banner
        if(project.projectBanner){
            const projectImageId = project.projectBanner.public_id;
            await cloudinary.uploader.destroy(projectImageId);
        }
        // delete the project snapshots
        if(project.projectSnapshots){
            project.projectSnapshots.forEach(async (snapshot)=>{
                const snapshotId = snapshot.public_id;
                await cloudinary.uploader.destroy(snapshotId);
            });
        }
        //delete the project from the db
        await project.deleteOne();
        res.status(200).json({
            success: true,
            message: "Project Deleted!",
        });
    }catch(err){
        throw new Error("Errow while deleting the project");
    }
});

const getProject = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const project = await Project.findById(id);
        if(!project){
            throw new Error("Project not found");
        }
        res.status(200).json({
            success:true,
            project
        });
    }catch(err){
        throw new Error("Unable to fetch the project");
    }
});

const getAllProjects = expressAsyncHandler(async (req,res)=>{
    try{
        const projects = await Project.find({});
        res.status(200).json({
            success:true,
            projects,
        });
    }catch(err){
        throw new Error("Unable to fetch the projects");
    }
});


module.exports = {
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getAllProjects
}