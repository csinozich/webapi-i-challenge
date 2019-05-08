// implement your API here
const express = require('express');

const server = express();
const db = require('./data/db.js');

server.use(express.json());

server.get('/api/users', (req, res) => {
  db.find()
    .then(allUsers => {
      res.json(allUsers)
    })
    .catch(({ code, message }) => {
      res.status(code).json({ error: message })
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      if (user.length === 0) {
        sendUserError(404, "User with that id not found", res);
        return;
      }
      res.json(user);
    })
    .catch(({ code, message}) => {
      res.status(code).json({ error: message })
    });
});

server.post('/api/users', (req, res) => {
  const { name, bio, created_at, updated_at } = req.body;
  if(!name || !bio) {
    res.status(400).json({ error: "Please provide name and bio for user.""})
  }
  else {
    db.insert({ name, bio, created_at, updated_at })
      .then(addedUser => {
          res.status(201).json(addedUser)
      })
      .catch(({ code, message }) => {
        res.status(500).json({ error: "There was an error while saving the user to the database." })
      })
  }
})

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(removedUser => {
      if (removedUser === 0) {
        res.status(404).json({error: "The user with that ID does not exist"})
      } else {
        res.json(removedUser);
      }
    })
    .catch(({ code, message }) => {
      res.status(500).json({ error: "The user could not be removed" })
    })
})

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;

  if (!name || !bio ) {
    res.status(400).json({ error: "Must provide name and bio."})
  }
  else {
    db.update(id, changes)
      .then(updatedUser => {
        if(updatedUser) {
          res.status(200).json(updatedUser)
        }
        else {
          res.status(404).json({ error: "The user with the specified ID does not exist."})
        }
      })
      .catch(({ code, message }) => {
        res.status(500).json({ error: "The user information could not be modified."})
      })
  }
})

server.listen(3000, () => {
  console.log('Listening on Port 3000')
})
