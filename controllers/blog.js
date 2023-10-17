const blogModel = require("../models/blog")
const moment = require("moment")
const userModel = require("../models/user")


async function getAllBlogs(req, res, next) {
    const title = req.query.title
    const author = req.query.author
    const tags = req.query.tags
    //add pagination
    //const pageSize = req.query.pageSize
    const pageSize = 20;
    const page = req.query.page
 let blogList = await blogModel.find({state: "published"}).select("title author tags").limit(pageSize).skip((page - 1) * pageSize)
//  if(!blogList) {res.status(404).send("Error Retrieving blogs")};
 if(title) {
    blogList = blogList.map((blog)=>{
        if(blog.title === title) {
          return blog
        } 
      })
 } else if(author) {
    blogList = blogList.map((blog)=>{
        if(blog.author === author) {
            return blog
        } 
    })
 }  else if(tags) {
    blogList = blogList.map((blog)=>{
        if(blog.tags === tags) {
            return blog
        } 
    })
 }
 

 return res.json({status: true, blogList})

}


//get blog list, order by read_count

async function getAllBlogRead_count(req, res, next) {
     //add pagination
    //const pageSize = req.query.pageSize
    const pageSize = 20;
    const page = req.query.page
    let blogList = await blogModel.find({state: "published"}).select("title author tags read_count").limit(pageSize).skip((page - 1) * pageSize);
    blogList = blogList.sort((a, b)=> a.read_count - b.read_count)
    if(!blogList){
        return res.status(404).send("Error Occured!")
       }
      return res.json({status: true, blogList})

}


//get blog list, order by timestamp

async function getAllBlogTimestamp(req, res, next) {
     //add pagination
    //const pageSize = req.query.pageSize
    const pageSize = 20;
    const page = req.query.page
    let blogList = await blogModel.find({state: "published"}).select("title author tags timestamp").limit(pageSize).skip((page - 1) * pageSize);
    blogList = blogList.sort((a, b)=> a.timestamp - b.timestamp)
    if(!blogList){
        return res.status(404).send("Error Occured!")
       }
     return res.json({status: true, blogList})
}


//get blog list, order by readingTime

async function getAllBlogReadingTime(req, res, next) {
     //add pagination
    //const pageSize = req.query.pageSize
    const pageSize = 20;
    const page = req.query.page
    let blogList = await blogModel.find({state: "published"}).select("title author tags reading_time").limit(pageSize).skip((page - 1) * pageSize);
    blogList = blogList.sort((a, b)=> a.reading_time - b.reading_time)
    if(!blogList){
         return res.status(404).send("Error Occured!")
       }
       return res.json({status: true, blogList})
}


//get a single blog by title
async function getSingleBlog(req, res, next) {
    const title = req.query.title;
    const article = await blogModel.findOne({title:title})
    if(!article){res.status(404).send("Article not found!")}
    const count = await blogModel.findOneAndUpdate({title: title}, {read_count: article.read_count+1})
    return res.json({status:true, count})
}



//post a new blog
async function createNewBlog(req, res, next) {
//title, description, author, state(d/p), read_count, reading_time, tags, body, timestamp
const body = req.body;
//calculate the reading_time
let words = [];
words.push(body.title, body.description, body.body);
let wordCount = words.join(' ').split(' ').length;
//using an average of 200 words per minute reading
const reading_time = `${wordCount/200} minutes`;
const create = await blogModel.create({
    title: body.title,
    description: body.description,
    author: body.author,
    state: "draft",
    read_count: 0,
    reading_time: reading_time,
    tags: body.tags,
    body: body.body,
    timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
    user: req.user
})
let user = await userModel.findById(req.user._id)
user.blogs = user.blogs.concat(create._id);
await user.save();
return res.json({message: "Article Created Succesfuly", status: true})

}


//edit a blog(state and any other properties) by the owner

async function patchBlogByOwner(req, res, next) {
    const id = req.params.id;
    const user = req.user
    

    const blog = await blogModel.find({id, user})
    if(!blog) {
        return res.status(404).json({status: false, message: "Blog Not Found"});
    }
    
    const article = await blogModel.findOneAndUpdate({id, user}, {$set:{
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            state: req.body.state,
            body: req.body.body
    }})
   return  res.json({status:true, article});
   
}


//delete a blog by the owner
async function deleteBlog(req, res, next) {
    const id = req.params.id;
    const user = req.user
    const deleteArticle = await blogModel.findOneAndDelete({id, user})
    if(!deleteArticle) { return res.status(404).json({status: false, message: "Article not found"})};

       return res.json({status:true, message: "Article Deleted Succesfyly!"})
}

//get all my(owner) blogs, requires author name. Can filter by state
async function getMyBlogs(req, res, next) {
    const state = req.query.state;
    let blogList = await blogModel.find({user: req.user})
    if(!blogList){return res.status(404).json({status:false, message: "No Article found"})}

    if(state) {
        blogList = await blogModel.find({user: req.user, state})
    }
     return res.json({status:true, blogList});
}



module.exports = {
    getAllBlogs,
    getAllBlogRead_count,
    getAllBlogTimestamp,
    getAllBlogReadingTime,
    getSingleBlog,
    createNewBlog,
    patchBlogByOwner,
    deleteBlog,
    getMyBlogs
}