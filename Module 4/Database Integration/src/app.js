const express = require('express');
const postController = require('./controllers/postController');

const app = express();
app.use(express.json());

app.get('/posts', postController.list);
app.get('/posts/:id', postController.get);
app.post('/posts', postController.create);
app.patch('/posts/:id', postController.update);
app.delete('/posts/:id', postController.remove);

app.use((error, req, res, next) => {
  console.error(error);

  if (error.code === 'P2002') {
    return res.status(409).json({ error: 'This record already exists.' });
  }

  if (error.code === 'P2003') {
    return res.status(400).json({ error: 'Invalid related record.' });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found.' });
  }

  if (error.code && error.code.startsWith('P10')) {
    return res.status(503).json({ error: 'Database is currently unavailable.' });
  }

  return res.status(error.statusCode || 500).json({
    error: error.statusCode ? error.message : 'Internal server error.',
  });
});
if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => console.log('API listening'));
}

module.exports = app;
