import express from 'express';
import {supabase} from './supabaseClient.js';


const router = express.Router();

router.get('/posts', async (req, res) => {
const { data, error } = await supabase
  .from('posts')
  .select('*'); 

if (error) {
    return res.status(500).json({ error: error.message });
  }

    res.json(data);
});

router.get('/posts/published', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        is_published,
        published_at,
        comments (id)
      `)
      .eq('is_published', true) 
      .order('published_at', { ascending: true }); 

    if (error) throw error;

    const postsWithCommentCount = data.map(post => ({
      ...post,
      comment_count: post.comments ? post.comments.length : 0
    }));

    res.status(200).json(postsWithCommentCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.post('/posts', async (req, res) =>
     {
    const body =
     { 
        title: req.body.title,
        content: req.body.content,
        is_published: false,
     };
     if(!body.title){
      res.status(400).json({error: "Title is required"});
      return;
     }
     if(!body.content){
      res.status(400).json({error: "Content is required"});
      return;
     } 
    const { data, error } = await supabase
      .from('posts')
      .insert([body])
      .select();
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data[0]);


    });

    router.put('/posts/:id/publish', async (req, res) => {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('posts')
        .update({ is_published: true, published_at: new Date().toDateString() })
        .eq('id', id)
        .select();
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(204).json(data);
    });


   router.get('/posts/most-commented', async (req, res) => {
  try {
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        is_published,
        comments!inner(id)
      `, { count: 'exact' }); 

    if (error) throw error;

    const postsWithCount = data.map(post => ({
      ...post,
      Nombre_comments: post.comments.length
    }));

    const postMostCommented = postsWithCount.sort((a, b) => b.Nombre_comments - a.Nombre_comments)[0];

    res.status(200).json(postMostCommented);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




  router.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(204).send();
});




export default router;

