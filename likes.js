import express from 'express';
import {supabase} from './supabaseClient.js';
const router = express.Router();
router.post('/likes', async (req, res) => {
    const body =
     { 
        post: req.body.post,
     }; 

        if(!body.post){
        res.status(400).json({error: "Post ID is required"});
        return;
        }   
       
    const { data, error } = await supabase
      .from('likes')
      .insert([body])
      .select();    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data[0]);
    });

    router.delete('/likes', async (req, res) => {   

        const { post } = req.body;    
        if(!post){
        res.status(400).json({error: "Post ID is required"});
        return;
        }
        const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post', post);  
        if (error) {
        return res.status(500).json({ error: error.message });
        }
        res.status(204).send();
    });

    router.get('/likes', async (req, res) => {
    const { data, error } = await supabase
      .from('likes')
      .select('*');     
    if (error) {
        return res.status(500).json({ error: error.message });
      }
        res.json(data);
    });

    router.get('/likes/count', async (req, res) => {
      const { post } = req.query;   
        if(!post){
        res.status(400).json({error: "Post ID is required"});
        return;
        }   
        const { data, error } = await supabase
        .from('likes')
        .select('id', { count: 'exact' })
        .eq('post', post);
        if (error) {
        return res.status(500).json({ error: error.message });
        }
        res.json({ count: data.length });
    });

export default router;