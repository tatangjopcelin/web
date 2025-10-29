import express from 'express';
import {supabase} from './supabaseClient.js';


const router = express.Router();
router.get('/comment', async (req, res) => {
const { data, error } = await supabase
  .from('comments')
  .select('*');
if (error) {
    return res.status(500).json({ error: error.message });
  }
    res.json(data);
});
router.post('/comment', async (req, res) =>
     {
    const body =
     { 
        post: req.body.post,
        content: req.body.content,
     };  

        if(!body.post){
        res.status(400).json({error: "Post ID is required"});
        return;
        }
        if(!body.content){
        res.status(400).json({error: "Content is required"});
        return;
        }
    const { data, error } = await supabase
      .from('comments')
      .insert([body])
      .select();
    if (error) {
      return res.status(500).json({ error: error.message });
    }   
    res.status(201).json(data[0]);
    });

    router.put('/comment/:id', async (req, res) => {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('comments')
        .update({ content: req.body.content })
        .eq('id', id)
        .select();
        if (error) {
        return res.status(500).json({ error: error.message });
        }
        res.status(200).json(data);
    });

    router.delete('/comment/:id', async (req, res) => {
      const { id } = req.params;
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);
        if (error) {
        return res.status(500).json({ error: error.message });
        }
        res.status(204).send();
    });

    router.get('/posts/:id/comments', async (req, res) => {
      const { id } = req.params;
      const { data, error } = await supabase    
        .from('comments')
        .select('*')
        .eq('post', id);
        if (error) {
        return res.status(500).json({ error: error.message });
        }
        res.status(200).json(data);
    });

export default router;

