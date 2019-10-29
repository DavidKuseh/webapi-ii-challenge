const express = require('express');

const Posts = require('./data/db.js')

const server = express();

server.use(express.json()) 

//get all posts
server.get('/api/posts', (req,res) => {
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
server.get('/api/posts/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post) {
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
server.post('/api/posts', (req, res) => {
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
server.delete('/api/posts/:id', (req, res) => {
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
server.put('/api/posts/:id', (req,res) => {
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
server.post('/api/posts/:id/comments', (req,res) => {

    const { text } = req.body;

    if (!text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        const newComment = {
            comment: req.body.post.comment
        }
        Posts.insert(req.params.id, newComment)
        .then(com => {
            if(!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else
                res.status(201).json(com)
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
    }
})

// get comment by id
server.get('/api/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    Posts
      .findById(id)
      .then(data => {
        if (data.length === 0) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        } else {
          return posts
            .findPostComments(id)
        }
      })
      .then(data => {
        res.status(200).json(data);
      })
      .catch(error => {
        res.status(500).json({ error: "The comments information could not be retrieved." })
      });
}) 


server.listen((process.env.PORT || 3000), () => {
    console.log('listening on ' + (process.env.PORT || 3000));
})



