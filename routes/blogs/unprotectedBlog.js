const express = require("express")
const mongoose = require("mongoose")
const blogModel = require("../../models/blog")
const moment = require("moment")
const blogController = require("../../controllers/blog")
const blogRouter = express.Router()

//get all published blogs by logged in and not logged in users 
blogRouter.get("/list", blogController.getAllBlogs)

//get pubished list, order by read_count
blogRouter.get("/list/read_count", blogController.getAllBlogRead_count)

//get published list, order by timestamp
blogRouter.get("/list/timestamp", blogController.getAllBlogTimestamp)

//get published list, order by reading_time
blogRouter.get("/list/reading_time", blogController.getAllBlogReadingTime)

//get a blog by title== logged in and no logged in user
blogRouter.get("/article", blogController.getSingleBlog)



module.exports = blogRouter;