const Post = require('../models/post_model');

//get should be used to return a Post/s
const get = async (req, res) => {
    try{
        var posts
        if (req.params.id != null){
            posts = await Post.findById(req.params.id);
        }else{
                posts = await Post.find();
            }
        res.status(200).send(posts);
    }catch(err){
        res.status(500).send(err.message);
    }
};

//post should be used to create a new Post
const post = async (req, res) => {
    const post = req.body;
    try{
    const newPost = await Post.create(post);
    res.status(201).json(newPost);
    }catch(err){
        res.status(500).send(err.message);
    }
};

//put should be used to update a Post
const put = async (req, res) => {
    const post = req.body;
    try{
        const updatedPost = await Post.findByIdAndUpdate(
            post._id,
            post,
            {new: true}
        );
        res.status(200).json(updatedPost);
    }catch(err){
        res.status(500).send(err.message);
    }
};

//delete should be used to delete a Post

const deletePost = async (req, res) => {
    try{
        const post = req.body;
        await Post.findByIdAndDelete(post._id);
        res.status(200).json(`Post with id: ${post._id} deleted`);
    }catch(err){
        res.status(500).send(err.message);
    }
};

module.exports = {
    get,
    post,
    put,
    deletePost
};