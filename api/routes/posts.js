const router = require("express").Router();
const { restart } = require("nodemon");
const Post = require("../models/Post");
const User = require("../models/User");

router.get("/", (req, res, next) => {
    console.log("posts page");
});

router.post("/", async (req, res, next) => { 
    const newPost = new Post(req.body)
    try { 
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch(err) { 
        return res.status(500).json(err);
    }
});

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post){ 
        return res.status(400).json("Post does not exist");
      }

    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post has been updated");
    } else {
      res.status(403).json("You only can update your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post){ 
        return res.status(400).json("Post does not exist");
      }

      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("Post has been deleted");
      } else {
        res.status(403).json("You only can delete content you posted");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.put("/:id/like", async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post does not exist");
        }
        if (!post.likes.includes(req.body.userId)){
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post has been liked");
        } else { 
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked");
        }
    } catch(err){
        res.status(500).json(err);
    }

  });

  router.get("/:id", async (req, res, next) => { 
    try { 
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json("Post does not exist")
        }
        res.status(200).json(post);
    } catch(err){ 
        console.log(err);
        res.status(500).json(err);
    }
  });

  router.get("/timeline/all", async(req, res, next) => { 
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => { 
                return Post.find({ userId: friendId });
            })
        )
        res.json(userPosts.concat(...friendPosts));
    } catch(err){ 
        console.log(err);
        res.status(500).json(err);
    };
  });

module.exports = router;