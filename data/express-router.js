const express = require('express');
const Posts = require('../data/db.js');

const router = express.Router();

//get all posts
router.get('/', (req,res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(() => {
            res.status(500).json({
                error: "The posts information could not be retrieved."
        })
    })
})

//get post by id
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post.length !== 0) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: 'The message with the specified ID does not exist.'})
        }
    })
    .catch(() => {
        res.status(500).json({ errorMessage: 'The post information could not be retrieved.'})
    })
})

// create a new post
router.post('/', (req, res) => {
    const { title, contents } = req.body;

    if (!title && !contents) {
        res
        .status(400)
        .json({ errorMessage: 'Please provide title and contents for the user.'})
    } else {
        const newPost = {
            title: req.body.title, 
            contents: req.body.contents
        }
        Posts.insert(newPost)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(() => {
            res.status(500).json({
                errorMessage:
                'There was an error while saving the post to the database.'
            })
        })
    }
})

//delete a post
router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
    .then(post => {
        if(!post){
            res.status(404).json({ message: 'The post with the specified ID does not exist.'})
        }
        else {
            res.json(post)
            }
        })
    .catch(error => {
        res.status(500).json({error: "The post could not be removed"})
    })
})

//update a post
router.put('/:id', (req,res) => {
    const { title, contents } = req.body;

    if(!title && !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        const newPost = {
            title: req.body.title, 
            contents: req.body.contents
        }
        Posts.update(req.params.id, newPost)
        .then(post => {
            if(!post){
                res.status(404).json({ message: 'The post with the specified ID does not exist.'})
            } else {
                res.status(200).json(post)
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'The post information could not be modified'})
        })
    }
})

//post a comment 
    router.post('/:id/comments', (req,res) => {
        let { id } = req.params;
        let comment = req.body;

        comment.post_id = id;

        if(!comment || !comment.text) {
            res.status(400).json({ errorMessage: "Please provide text for the comment." })
        }

        Posts.insertComment(comment)
        .then(data => {
            Posts.findCommentById(data.id)
            .then(data => {
                res.status(201).json(data)
            })
            .catch(error => {
                res.status(500).json({ error: "Error in sending back newly created comment,but it was created." })
            })
        })
        .catch(error => {
            res.status(500).json({error: "There was an error while saving the comment to the database"})
        })
    })

// get comment by id
router.get('/:id/comments', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post.length === 0) {
            res.status(404).json(error)
        } else {
           Posts.findPostComments(req.params.id)
            .then(comments => {
                res.status(200).json(comments);
            })
            .catch((error) => {
                res.status(500).json(error);
            });
        }
    })
    .catch((error) => {
        res.status(500).json(error);
    });
});

module.exports = router;