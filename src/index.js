const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());

app.post('/user', async (req, res) => {
  const user = await prisma.user.create({
    data: { ...req.body }
  });
  res.json(user);
});

app.post('/post', async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const post = await prisma.post.create({
    data: { title, content,
      published: false,
      author: { connect: { email: authorEmail } }
    }
  });
  res.json(post);
});

app.put('/publish/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.update({
    where: { id: Number(id)},
    data: { published: true }
  });
  res.json(post);
});

app.delete('/post/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: { id: Number(id) }
  });
  res.json(post);
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findOne({
    where: { id: Number(id) }
  });
  res.json(post);
});

app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true }
  });
  res.json(posts);
});

app.get('/filterPosts', async (req, res) => {
  const { searchString } = req.query
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: searchString }},
        { content: { contains: searchString }}
      ]
    }
  });
  res.json(posts);
})

const server = app.listen(
  3000,
  () => console.log('Server ready at: http://localhost:3000')
);
