import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

export default function UpdateNews() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams(); // To get the news ID from the URL
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    summary: "",
    keywords: "",
    source: "",
    images: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch existing news details
  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const res = await fetch(`/api/news/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          setError("Failed to fetch news details.");
          return;
        }
        setFormData(data); // Populate formData with existing news details
      } catch (err) {
        setError("An error occurred while fetching news details.");
      }
    };
    fetchNewsDetails();
  }, [params.id]);

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.images.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            images: formData.images.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2 MB max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload up to 6 images per news article");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done!`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
            resolve(getDownloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleBodyChange = (value) => {
    setFormData({
      ...formData,
      body: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.images.length < 1) {
        return setError("You must upload at least one image.");
      }

      setLoading(true);
      setError(false);
      const token = currentUser.token; // Assuming the token is stored in currentUser

      const res = await fetch(`/api/news/update/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/news/${params.id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Update News</h1>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          className="border p-3 rounded-lg"
          id="title"
          required
          onChange={handleChange}
          value={formData.title}
        />
        <ReactQuill
          theme="snow"
          value={formData.body}
          onChange={handleBodyChange}
          placeholder="Write the news body here..."
        />
        <input
          type="text"
          placeholder="Summary"
          className="border p-3 rounded-lg"
          id="summary"
          required
          onChange={handleChange}
          value={formData.summary}
        />
        <input
          type="text"
          placeholder="Keywords (comma separated)"
          className="border p-3 rounded-lg"
          id="keywords"
          required
          onChange={handleChange}
          value={formData.keywords}
        />
        <input
          type="text"
          placeholder="Source"
          className="border p-3 rounded-lg"
          id="source"
          required
          onChange={handleChange}
          value={formData.source}
        />

        <div className="flex flex-col gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              You can upload up to 6 images
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded-lg w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-yellow-300 rounded-lg uppercase hover:bg-green-200 hover:shadow-lg disabled:opacity-80"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-sm text-red-700">
            {imageUploadError && imageUploadError}
          </p>
          {formData.images.length > 0 &&
            formData.images.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="News Image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update News"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
