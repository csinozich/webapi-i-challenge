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
        sendUserError(404, 'User with that id not found', res);
        return;
      }
      res.json(user);
    })
    .catch(({ code, message}) => {
      res.status(code).json({ error: message })
    });
});

server.post('/api/users', (req, res) => {
  const newUser = req.body;
  db.insert(newUser)
    .then(addedUser => {
      res.status(201).json(addedUser)
    })
    .catch(({ code, message }) => {
      res.status(code).json({ error: message })
    })
})

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(removedUser => {
      res.json(removedUser);
    })
    .catch(({ code, message }) => {
      res.status(code).json({ error: message })
    })
})

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  db.update(id, changes)
    .then(updatedUser => {
      if(updatedUser) {
        res.json(updatedUser)
      }
      else {
        res.status(404).json({ error: 'incorrect id'})
      }
    })
    .catch(({ code, message }) => {
      res.status(code).json({ error: message})
    })
})

server.listen(3000, () => {
  console.log('Listening on Port 3000')
})
