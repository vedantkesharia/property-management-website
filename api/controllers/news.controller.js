import News from "../models/news.model.js";
import { errorHandler } from "../utils/error.js";

export const createNews = async (req, res, next) => {
  try {
    const news = await News.create(req.body);
    return res.status(201).json(news);
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(errorHandler(404, 'News not found!'));
  }

  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(200).json('News has been deleted successfully!');
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(errorHandler(404, 'News Not Found!'));
  }

  try {
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedNews);
  } catch (error) {
    next(error);
  }
};

export const getNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return next(errorHandler(404, 'News not found'));
    }
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

export const getallNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const newsList = await News.find({
      title: { $regex: searchTerm, $options: 'i' },
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex)
      .select('images title summary body category keywords createdAt updatedAt'); // Explicitly include the fields

    return res.status(200).json(newsList);
  } catch (error) {
    next(error);
  }
};