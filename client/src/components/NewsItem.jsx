import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function NewsItem({ news }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={news.images[0]}
        alt={news.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">
          <Link to={`/news/${news._id}`}>{news.title}</Link>
        </h2>
        <p className="text-gray-600 mb-4">{news.summary}</p>
        <div className="flex items-center justify-between text-gray-600">
          <span>{new Date(news.createdAt).toLocaleDateString()}</span>
          <span>{news.source}</span>
        </div>
      </div>
    </div>
  );
}

NewsItem.propTypes = {
  news: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
  }).isRequired,
};

export default NewsItem;