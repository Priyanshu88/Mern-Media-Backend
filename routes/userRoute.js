const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const protectedResource = require('../middleware/protectedResource');
const PostModel = mongoose.model("PostModel");
const UserModel = mongoose.model("UserModel");

//endpoint to get user details of another user(not the logged in user) along with their posts
router.get('/user/:userId', protectedResource, (req, res) => {
    // to find the specific user
    UserModel.findOne({ _id: req.params.userId })
        .select("-password") //fetch everything except password
        .then((userFound) => {
            //fetch all posts of this found user
            PostModel.find({ author: req.params.userId })
                .populate("author", "_id fullName")
                .exec((error, allPosts) => {
                    if (error) {
                        return res.status(400).json({ error: error });
                    }
                    res.json({ user: userFound, posts: allPosts })
                })
        })
        .catch((err) => {
            return res.status(400).json({ error: "User was not found!" })
        })
});

router.put('/follow', protectedResource, (req, res) => {
    // Scenario:LoggedIn user wants to follow another user
    // req.body.followId is the id of the user that loggedIn user wants to follow
    //Scenario: LoggedIn user is trying to follow a non-LoggedIn user
    //req.body.followId = userId of not LoggedIn user
    UserModel.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.dbUser._id } //push then userId of LoggedIn user
    }, {
        new: true
    }, (error, result) => {
        if (error) {
            return res.status(400).json({ error: error });
        }
        //req.dbUser._id = userId of loggedin user
        UserModel.findByIdAndUpdate(req.dbUser._id, {
            $push: { following: req.body.followId } // push the userId of not LoggedIn user

        },
            { new: true })
            .select("-password")
            .then(result => res.json(result))
            .catch(error => {
                return res.status(400).json({ error: error })
            })
        }
    )
});


router.put('/unfollow', protectedResource, (req, res) => {
    // Scenario:LoggedIn user wants to follow another user
    // req.body.followId is the id of the user that loggedIn user wants to follow
    //Scenario: LoggedIn user is trying to follow a non-LoggedIn user
    //req.body.followId = userId of not LoggedIn user
    UserModel.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.dbUser._id } //push then userId of LoggedIn user
    }, {
        new: true
    }, (error, result) => {
        if (error)
        {
            return res.status(400).json({ error: error });
        }
        //req.dbUser._id = userId of loggedin user
        UserModel.findByIdAndUpdate(req.dbUser._id, {
            $pull: { following: req.body.unfollowId } // push the userId of not LoggedIn user

        },
            { new: true })
            .select("-password")
            .then(result => res.json(result))
            .catch(error => {
                return res.status(400).json({ error: error })
            })
        }
    )
});

module.exports = router;