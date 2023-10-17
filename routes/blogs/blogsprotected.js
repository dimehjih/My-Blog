const express = require("express")
const mongoose = require("mongoose")
const moment = require("moment")
const blogModel = require("../../models/blog")
const userModel = require("../../models/user")
require("../../authentication/auth")
const blogController = require("../../controllers/blog")


const pblogRouter = express.Router();


// pblogRouter.post("/", async (req, res)=>{
pblogRouter.post("/", blogController.createNewBlog)

//edit a blog(state and any other properties) by the owner
pblogRouter.patch("/:id", blogController.patchBlogByOwner)

//delete a blog by the owner
pblogRouter.delete("/:id", blogController.deleteBlog)

//get all my(owner) blogs, requires author name. Can filter by state
pblogRouter.get("/myblogs", blogController.getMyBlogs)


module.exports = pblogRouter;