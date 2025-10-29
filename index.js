import express from 'express';
import postRouter from './api/post.js';
import commentsRouter from './api/comments.js';
import likesRouter from './api/likes.js';
const app = express();


app.use(express.json());

app.use('/api', postRouter);
app.use('/api', commentsRouter);
app.use('/api', likesRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export default app;
