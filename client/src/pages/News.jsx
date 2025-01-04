import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { FaClock, FaTag, FaLink } from "react-icons/fa";
import { motion } from "framer-motion";

export default function News() {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setNews(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchNews();
  }, [params.id]);

  if (loading) return <div className="text-center my-7 text-2xl">Loading...</div>;
  if (error) return <div className="text-center my-7 text-2xl">Something went wrong!</div>;
  if (!news) return <div className="text-center my-7 text-2xl">News not found!</div>;

  return (
    <main className="max-w-6xl mx-auto p-3 font-serif">
      <div>
        {/* Image Gallery */}
        <ImageGallery
          items={news.images.map((url) => ({ original: url, thumbnail: url }))}
          showNav={true}
          thumbnailPosition="bottom"
          slideDuration={450}
          slideInterval={3000}
          thumbnailHeight={80}
          useBrowserFullscreen={false}
          additionalClass="custom-image-gallery"
        />

        {/* News Details */}
        <div className="flex flex-col gap-6 my-7">
          <h1 className="text-4xl font-bold">{news.title}</h1>
          <div className="flex items-center gap-4 text-slate-600">
            <FaClock />
            <p>{new Date(news.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <FaLink />
            <p>{news.source}</p>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <FaTag />
            <p>{news.keywords}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Summary</h2>
            <p className="text-slate-700 leading-relaxed">{news.summary}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Body</h2>
            <div
              className="text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: news.body }}
            ></div>
          </div>
        </div>
      </div>
    </main>
  );
}