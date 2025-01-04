import express from "express";
import { createNews, deleteNews, updateNews, getNews, getallNews} from "../controllers/news.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken, createNews)
router.delete('/delete/:id', verifyToken, deleteNews)
router.put('/update/:id', verifyToken, updateNews)
router.get('/get/:id',  getNews)
router.get('/get', getallNews)

export default router;