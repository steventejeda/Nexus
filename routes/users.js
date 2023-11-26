const router = require("express").Router();
const User = require("../models/User");

router.get("/", (req, res) => {
    res.send("This is the user route")
});

router.put("/:id", async(req, res, next) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) { 
            try{ 
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(err) { 
                return res.status(500).json(err)
            }
        } try { 
            const user = await User.findByIdAndUpdate(req.params.id, {
               $set: req.body, 
               
            });

            FindUser(user);
            return res.status(200).json("Account has been updated");
        } catch(err) {
            console.error("Error updating user:", err);
            return res.status(500).json(err)
        }
    } else { 
        return res.status(403).json("You cannot modify another user's profile")
    }
});

router.put("/:id/follow", async (req, res, next) => { 
    if (req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.following.includes(req.body.userId)) {
              await user.updateOne({$push: { following: req.body.userId } });
              await currentUser.updateOne({ $push: { followers: req.params.id } });
              return res.status(200).json("User has been followed");
            } else { 
                res.status(403).json("You already follow this user");
            }
        } catch(err) { 
            res.status(500).json(err);

        }

    } else { 
        res.status(403).json("You cannot follow yourself")
    }
});

router.put("/:id/unfollow", async (req, res, next) => { 
    if (req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.following.includes(req.body.userId)) {
              await user.updateOne({$pull: { following: req.body.userId } });
              await currentUser.updateOne({ $pull: { followers: req.params.id } });
              return res.status(200).json("User has been unfollowed");
            } else { 

                res.status(403).json("You already unfollowed this user");
            }
        } catch(err) { 
            res.status(500).json(err);

        }

    } else { 
        res.status(403).json("You cannot unfollow yourself")
    }
});

router.delete("/:id", async(req, res, next) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
         try { 
            const user = await User.findByIdAndDelete(req.params.id);
            FindUser(user);

            return res.status(204).json();
        } catch(err) {
            return res.status(500).json(err);
        }
    } else { 
        return res.status(403).json("You cannot delete another user's profile")
    }
});

router.get("/:id", async (req, res, next) => { 
    try{
        const user = await User.findById(req.params.id);
        FindUser(user);
        const {password, updatedAt, ...other} = user._doc
        return res.status(200).json(other);
    } catch(err){
        return res.status(500).json(err);
    }
});

function FindUser(user) {
    if (!user) {
        return res.status(404).json("User not found");
    } else { 
        return user;
    };
}

module.exports = router;
