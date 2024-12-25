
import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [], //done
    name: "", //done
    description: "", //done
    propertyType:"apartment", //done
    features:[],  //done
    communityFeatures:[], //done
    floorPlan:"", //done
    address: "", //done
    type: "rent", //done
    bedrooms: 1, //done
    bathrooms: 1, //done
    regularPrice: 50, //done
    discountPrice: 0, //done
    offer: false, //done
    // sale: false, 
    parking: false,
    furnished: false,
    mapUrl: "", // Add map field done
    area:"" //done
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, [params.listingId]);

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
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
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload up to 6 images per listing");
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
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (e.target.id === "propertyType") {
      setFormData({
        ...formData,
        propertyType: e.target.value,
      });
    }

    if (e.target.id === "type") {
      setFormData({
        ...formData,
        type: e.target.value,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleFeaturesChange = (e) => {
    const { value } = e.target;
    const featuresArray = value.split(',').map(feature => feature.trim());
    setFormData({ ...formData, features: featuresArray });
  };
  const handleCommunityFeaturesChange = (e) => {
    const { value } = e.target;
    const communityFeaturesArray = value.split(',').map(feature => feature.trim());
    setFormData({ ...formData, communityFeatures: communityFeaturesArray });
  };



  const handleFormSumbit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must at least upload one image");
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount price must be lower than regular price!");
      }

      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Updating Listing</h1>

      <form
        onSubmit={handleFormSumbit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.address}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Map URL"
            className="border p-3 rounded-lg"
            id="mapUrl"
            required
            onChange={handleChange}
            value={formData.mapUrl}
          />
{/* Property Type */}
<select
      id="propertyType"
      required
      className="border p-3 rounded-lg"
      onChange={handleChange}
      value={formData.propertyType}
    >
      <option value="">Select Property Type</option>
      <option value="apartment">Apartment</option>
      <option value="house">House</option>
      <option value="condo">Condo</option>
    </select>

{/* Type */}
<select
      id="type"
      required
      className="border p-3 rounded-lg"
      onChange={handleChange}
      value={formData.type}
    >
      <option value="">Select Type</option>
      <option value="sale">Sale</option>
      <option value="rent">Rent</option>
   
    </select>

    {/* Features */}
    <input
            type="text"
            id="features"
            className="border p-3 rounded-lg"
            required
            value={formData.features.join(', ')}
            onChange={handleFeaturesChange}
            placeholder="Enter features separated by commas"
          />

    {/* Community Features */}
    <input
            type="text"
            id="communityFeatures"
            className="border p-3 rounded-lg"
            required
            value={formData.communityFeatures.join(', ')}
            onChange={handleCommunityFeaturesChange}
            placeholder="Enter features separated by commas"
          />

    {/* Floor Plan */}
    <input
      type="text"
      placeholder="Floor Plan URL"
      className="border p-3 rounded-lg"
      id="floorPlan"
      onChange={handleChange}
      value={formData.floorPlan}
    />
    <input
            type="number"
            placeholder="Enter number of Square Footage"
            className="border p-3 rounded-lg"
            id="area"
            required
            onChange={handleChange}
            value={formData.area}
          />

    {/* Checkbox Fields */}
    <div className="flex gap-6 flex-wrap">
      {[
        { id: "furnished", label: "Furnished" },
        { id: "parking", label: "Parking" },
        { id: "offer", label: "Offer" },
      ].map(({ id, label }) => (
        <div className="flex gap-2" key={id}>
          <input
            type="checkbox"
            id={id}
            className="w-5"
            onChange={handleChange}
            checked={formData[id]}
          />
          <span>{label}</span>
        </div>
      ))}
    </div>

    {/* Numeric Fields */}
    <div className="flex flex-wrap gap-6">
      {[
        { id: "bedrooms", label: "Beds", min: 1, max: 10 },
        { id: "bathrooms", label: "Baths", min: 1, max: 10 },
        { id: "regularPrice", label: "Regular Price ($)", min: 50, max: 10000000 },
        { id: "discountPrice", label: "Discount Price ($)", min: 0, max: 10000000, condition: formData.offer },
      ].map(
        ({ id, label, min, max, condition = true }) =>
          condition && (
            <div className="flex items-center gap-2" key={id}>
              <input
                type="number"
                id={id}
                min={min}
                max={max}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData[id]}
              />
              <p>{label}</p>
            </div>
          )
      )}
    </div>

          {/* <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div> */}

          
        </div>

        <div className="flex flex-col flex-1  gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
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
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="Listing Image"
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
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}







// import { useState, useEffect } from "react";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { app } from "../firebase.js";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";

// export default function UpdateListing() {
//   const { currentUser } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const params = useParams();
//   const [files, setFiles] = useState([]);
//   const [formData, setFormData] = useState({
//     imageUrls: [],
//     name: "",
//     description: "",
//     propertyType: "apartment",
//     features: [],
//     communityFeatures: [],
//     floorPlan: "",
//     address: "",
//     type: "rent",
//     bedrooms: 1,
//     bathrooms: 1,
//     regularPrice: 50,
//     discountPrice: 0,
//     offer: false,
//     sale: false,
//     parking: false,
//     furnished: false,
//     mapUrl: "", // Add map field
//     area: "", // Add area field
//   });
//   const [imageUploadError, setImageUploadError] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchListing = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`/api/listing/get/${params.id}`);
//         const data = await res.json();
//         setFormData(data);
//         setLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchListing();
//   }, [params.id]);

//   const handleImageSubmit = (e) => {
//     e.preventDefault();
//     if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
//       setUploading(true);
//       setImageUploadError(false);
//       const promises = [];

//       for (let i = 0; i < files.length; i++) {
//         promises.push(storeImage(files[i]));
//       }
//       Promise.all(promises)
//         .then((urls) => {
//           setFormData({
//             ...formData,
//             imageUrls: formData.imageUrls.concat(urls),
//           });
//           setImageUploadError(false);
//           setUploading(false);
//         })
//         .catch(() => {
//           setImageUploadError("Image upload failed (2 mb max per image)");
//           setUploading(false);
//         });
//     } else {
//       setImageUploadError("You can upload up to 6 images per listing");
//       setUploading(false);
//     }
//   };

//   const storeImage = async (file) => {
//     return new Promise((resolve, reject) => {
//       const storage = getStorage(app);
//       const fileName = new Date().getTime() + file.name;
//       const storageRef = ref(storage, fileName);
//       const uploadTask = uploadBytesResumable(storageRef, file);
//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           console.log(`Upload is ${progress}% done!`);
//         },
//         (error) => {
//           reject(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
//             resolve(getDownloadURL);
//           });
//         }
//       );
//     });
//   };

//   const handleRemoveImage = (index) => {
//     setFormData({
//       ...formData,
//       imageUrls: formData.imageUrls.filter((_, i) => i !== index),
//     });
//   };

//   const handleChange = (e) => {
//     if (e.target.id === "sale" || e.target.id === "rent") {
//       setFormData({
//         ...formData,
//         type: e.target.id,
//       });
//     }

//     if (
//       e.target.id === "parking" ||
//       e.target.id === "furnished" ||
//       e.target.id === "offer"
//     ) {
//       setFormData({
//         ...formData,
//         [e.target.id]: e.target.checked,
//       });
//     }

//     if (
//       e.target.type === "number" ||
//       e.target.type === "text" ||
//       e.target.type === "textarea"
//     ) {
//       setFormData({
//         ...formData,
//         [e.target.id]: e.target.value,
//       });
//     }
//   };

//   const handleFormSumbit = async (e) => {
//     e.preventDefault();

//     try {
//       if (formData.imageUrls.length < 1) {
//         return setError("You must at least upload one image");
//       }

//       if (+formData.regularPrice < +formData.discountPrice) {
//         return setError("Discount price must be lower than regular price!");
//       }

//       setLoading(true);
//       setError(false);
//       const token = currentUser.token; // Assuming the token is stored in currentUser

//       const res = await fetch(`/api/listing/update/${params.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Include the token in the headers
//         },
//         body: JSON.stringify({
//           ...formData,
//           userRef: currentUser._id,
//         }),
//       });

//       const data = await res.json();
//       setLoading(false);
//       if (data.success === false) {
//         setError(data.message);
//       }
//       navigate(`/listing/${data._id}`);
//     } catch (error) {
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="p-3 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7">Updating Listing</h1>

//       <form
//         onSubmit={handleFormSumbit}
//         className="flex flex-col sm:flex-row gap-4"
//       >
//         <div className="flex flex-col gap-4 flex-1">
//           <input
//             type="text"
//             placeholder="Name"
//             className="border p-3 rounded-lg"
//             id="name"
//             maxLength={62}
//             minLength={10}
//             required
//             onChange={handleChange}
//             value={formData.name}
//           />
//           <input
//             type="text"
//             placeholder="Address"
//             className="border p-3 rounded-lg"
//             id="address"
//             maxLength={62}
//             minLength={10}
//             required
//             onChange={handleChange}
//             value={formData.address}
//           />
//           <textarea
//             type="text"
//             placeholder="Description"
//             className="border p-3 rounded-lg"
//             id="description"
//             required
//             onChange={handleChange}
//             value={formData.description}
//           />
//           <input
//             type="text"
//             placeholder="Map URL"
//             className="border p-3 rounded-lg"
//             id="mapUrl"
//             required
//             onChange={handleChange}
//             value={formData.mapUrl}
//           />
//           <input
//             type="number"
//             placeholder="Enter number of square feet"
//             className="border p-3 rounded-lg"
//             id="area"
//             required
//             onChange={handleChange}
//             value={formData.area}
//           />
//           <input
//             type="text"
//             placeholder="Property Type"
//             className="border p-3 rounded-lg"
//             id="propertyType"
//             required
//             onChange={handleChange}
//             value={formData.propertyType}
//           />
//           <input
//             type="text"
//             placeholder="Floor Plan"
//             className="border p-3 rounded-lg"
//             id="floorPlan"
//             required
//             onChange={handleChange}
//             value={formData.floorPlan}
//           />
//           <textarea
//             type="text"
//             placeholder="Features (comma separated)"
//             className="border p-3 rounded-lg"
//             id="features"
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 features: e.target.value.split(","),
//               })
//             }
//             value={formData.features.join(",")}
//           />
//           <textarea
//             type="text"
//             placeholder="Community Features (comma separated)"
//             className="border p-3 rounded-lg"
//             id="communityFeatures"
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 communityFeatures: e.target.value.split(","),
//               })
//             }
//             value={formData.communityFeatures.join(",")}
//           />

//           <div className="flex gap-6 flex-wrap">
//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="sale"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.type === "sale"}
//               />
//               <span>Sell</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="rent"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.type === "rent"}
//               />
//               <span>Rent</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="parking"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.parking}
//               />
//               <span>Parking Spot</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="furnished"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.furnished}
//               />
//               <span>Furnished</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="offer"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.offer}
//               />
//               <span>Offer</span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-6">
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="bedrooms"
//                 min="1"
//                 max="10"
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//                 onChange={handleChange}
//                 value={formData.bedrooms}
//               />
//               <p>Beds</p>
//             </div>

//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="bathrooms"
//                 min="1"
//                 max="10"
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//                 onChange={handleChange}
//                 value={formData.bathrooms}
//               />
//               <p>Baths</p>
//             </div>

//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="regularPrice"
//                 min={50}
//                 max={10000000}
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//                 onChange={handleChange}
//                 value={formData.regularPrice}
//               />
//               <div className="flex flex-col items-center">
//                 <p>Regular Price</p>
//                 <span className="text-sm">($ / month)</span>
//               </div>
//             </div>

//             {/* SHOW DISCOUNTED PRICE ONLY WHEN THERE'S AN OFFER */}
//             {formData.offer && (
//               <div className="flex items-center gap-2">
//                 <input
//                   type="number"
//                   id="discountPrice"
//                   min={0}
//                   max={10000000}
//                   required
//                   className="p-3 border border-gray-300 rounded-lg"
//                   onChange={handleChange}
//                   value={formData.discountPrice}
//                 />
//                 <div className="flex flex-col items-center">
//                   <p>Discount Price</p>
//                   <span className="text-sm">($ / month)</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col flex-1  gap-4">
//           <p className="font-semibold">
//             Images:
//             <span className="font-normal text-gray-600 ml-2">
//               The first image will be the cover (max 6)
//             </span>
//           </p>

//           <div className="flex gap-4">
//             <input
//               onChange={(e) => setFiles(e.target.files)}
//               className="p-3 border border-gray-300 rounded-lg w-full"
//               type="file"
//               id="images"
//               accept="image/*"
//               multiple
//             />
//             <button
//               type="button"
//               onClick={handleImageSubmit}
//               className="p-3 text-green-700 border border-yellow-300 rounded-lg uppercase hover:bg-green-200 hover:shadow-lg disabled:opacity-80"
//               disabled={uploading}
//             >
//               {uploading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//           <p className="text-sm text-red-700">
//             {imageUploadError && imageUploadError}
//           </p>
//           {formData.imageUrls.length > 0 &&
//             formData.imageUrls.map((url, index) => (
//               <div
//                 key={url}
//                 className="flex justify-between p-3 border items-center"
//               >
//                 <img
//                   src={url}
//                   alt="Listing Image"
//                   className="w-20 h-20 object-contain rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveImage(index)}
//                   className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}

//           <button
//             disabled={loading || uploading}
//             className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
//           >
//             {loading ? "Updating..." : "Update Listing"}
//           </button>
//           {error && <p className="text-red-700 text-sm">{error}</p>}
//         </div>
//       </form>
//     </main>
//   );
// }







// import { useEffect, useState } from "react";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { app } from "../firebase.js";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";

// export default function UpdateListing() {
//   const { currentUser } = useSelector((state) => state.user);
//   const navigate = useNavigate()
//   const params = useParams();
//   const [files, setFiles] = useState([]);
//   const [formData, setFormData] = useState({
//     imageUrls: [],
//     name: "",
//     description: "",
//     address: "",
//     type: "rent",
//     bedrooms: 1,
//     bathrooms: 1,
//     regularPrice: 50,
//     discountPrice: 0,
//     offer: false,
//     sale: false,
//     parking: false,
//     furnished: false,
//   });
//   const [imageUploadError, setImageUploadError] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(false);


//   useEffect(() => {
//     const fetchListing = async () => {
//       const listingId  = params.listingId;
//       const res = await fetch(`/api/listing/get/${listingId}`);
//       const data = await res.json();
//       if(data.success === false){
//         console.log(data.message);
//         return;
//       }
//       setFormData(data)
//     }

//     fetchListing();
//   }, [])

//   // console.log('f-data',formData);

//   const handleImageSubmit = (e) => {
//     e.preventDefault();
//     if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
//       setUploading(true);
//       setImageUploadError(false);
//       const promises = [];

//       for (let i = 0; i < files.length; i++) {
//         promises.push(storeImage(files[i]));
//       }
//       Promise.all(promises)
//         .then((urls) => {
//           setFormData({
//             ...formData,
//             imageUrls: formData.imageUrls.concat(urls),
//           });
//           setImageUploadError(false);
//           setUploading(false);
//         })
//         .catch(() => {
//           setImageUploadError("Image upload failed (2 mb max per image)");
//           setUploading(false);
//         });
//     } else {
//       setImageUploadError("You can upload up to 6 images per listing");
//       setUploading(false);
//     }
//   };

//   const storeImage = async (file) => {
//     return new Promise((resolve, reject) => {
//       const storage = getStorage(app);
//       const fileName = new Date().getTime() + file.name;
//       const storageRef = ref(storage, fileName);
//       const uploadTask = uploadBytesResumable(storageRef, file);
//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           console.log(`Upload is ${progress}% done!`);
//         },

//         (error) => {
//           reject(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
//             resolve(getDownloadURL);
//           });
//         }
//       );
//     });
//   };

//   const handleRemoveImage = (index) => {
//     setFormData({
//       ...formData,
//       imageUrls: formData.imageUrls.filter((_, i) => i !== index),
//     });
//   };

//   const handleChange = (e) => {
//     if (e.target.id === "sale" || e.target.id === "rent") {
//       setFormData({
//         ...formData,
//         type: e.target.id,
//       });
//     }

//     if (
//       e.target.id === "parking" ||
//       e.target.id === "furnished" ||
//       e.target.id === "offer"
//     ) {
//       setFormData({
//         ...formData,
//         [e.target.id]: e.target.checked,
//       });
//     }

//     if (
//       e.target.type === "number" ||
//       e.target.type === "text" ||
//       e.target.type === "textarea"
//     ) {
//       setFormData({
//         ...formData,
//         [e.target.id]: e.target.value,
//       });
//     }
//   };

//   // console.log("fdata", formData);

//   const handleFormSumbit = async (e) => {
//     e.preventDefault();

//     try {
//       if (formData.imageUrls.length < 1) {
//         return setError("You must at least upload one image");
//       }

//       if (+formData.regularPrice < +formData.discountPrice) {
//         return setError("Discount price must be lower thand regular price!");
//       }

//       setLoading(true);
//       setError(false);
//       const res = await fetch(`/api/listing/update/${params.listingId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...formData,
//           userRef: currentUser._id,
//         }),
//       });

//       const data = await res.json();
//       setLoading(false);
//       if (data.success === false) {
//         setError(data.message);
//       }
//       navigate(`/listing/${data._id}`)
//     } catch (error) {
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="p-3 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7">Updating Listing</h1>

//       <form
//         onSubmit={handleFormSumbit}
//         className="flex flex-col sm:flex-row gap-4"
//       >
//         <div className="flex flex-col gap-4 flex-1">
//           <input
//             type="text"
//             placeholder="Name"
//             className="border p-3 rounded-lg"
//             id="name"
//             maxLength={62}
//             minLength={10}
//             required
//             onChange={handleChange}
//             value={formData.name}
//           />
//           <input
//             type="text"
//             placeholder="Address"
//             className="border p-3 rounded-lg"
//             id="address"
//             maxLength={62}
//             minLength={10}
//             required
//             onChange={handleChange}
//             value={formData.address}
//           />
//           <textarea
//             type="text"
//             placeholder="Description"
//             className="border p-3 rounded-lg"
//             id="description"
//             required
//             onChange={handleChange}
//             value={formData.description}
//           />

//           <div className="flex gap-6 flex-wrap">
//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="sale"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.type === "sale"}
//               />
//               <span>Sell</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="rent"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.type === "rent"}
//               />
//               <span>Rent</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="parking"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.parking}
//               />
//               <span>Parking Spot</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="furnished"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.furnished}
//               />
//               <span>Furnished</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="offer"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.offer}
//               />
//               <span>Offer</span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-6">
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="bedrooms"
//                 min="1"
//                 max="10"
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//                 onChange={handleChange}
//                 value={formData.bedrooms}
//               />
//               <p>Beds</p>
//             </div>

//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="bathrooms"
//                 min="1"
//                 max="10"
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//                 onChange={handleChange}
//                 value={formData.bathrooms}
//               />
//               <p>Baths</p>
//             </div>

//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="regularPrice"
//                 min={50}
//                 max={10000000}
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//                 onChange={handleChange}
//                 value={formData.regularPrice}
//               />
//               <div className="flex flex-col items-center">
//                 <p>Regular Price</p>
//                 <span className="text-sm">($ / month)</span>
//               </div>
//             </div>

//             {/* SHOW DISCOUNTED PRICE ONLY WHEN THERE'S AN OFFER */}
//             {formData.offer && (
//               <div className="flex items-center gap-2">
//                 <input
//                   type="number"
//                   id="discountPrice"
//                   min={0}
//                   max={10000000}
//                   required
//                   className="p-3 border border-gray-300 rounded-lg"
//                   onChange={handleChange}
//                   value={formData.discountPrice}
//                 />
//                 <div className="flex flex-col items-center">
//                   <p>Discount Price</p>
//                   <span className="text-sm">($ / month)</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col flex-1  gap-4">
//           <p className="font-semibold">
//             Images:
//             <span className="font-normal text-gray-600 ml-2">
//               The first image will be the cover (max 6)
//             </span>
//           </p>

//           <div className="flex gap-4">
//             <input
//               onChange={(e) => setFiles(e.target.files)}
//               className="p-3 border border-gray-300 rounded-lg w-full"
//               type="file"
//               id="images"
//               accept="image/*"
//               multiple
//             />
//             <button
//               type="button"
//               onClick={handleImageSubmit}
//               className="p-3 text-green-700 border border-yellow-300 rounded-lg uppercase hover:bg-green-200 hover:shadow-lg disabled:opacity-80"
//               disabled={uploading}
//             >
//               {uploading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//           <p className="text-sm text-red-700">
//             {imageUploadError && imageUploadError}
//           </p>
//           {formData.imageUrls.length > 0 &&
//             formData.imageUrls.map((url, index) => (
//               // <img key={url} src={url} alt="listing image" className="w-40 h-40 object-cover rounded-lg" />
//               <div
//                 key={url}
//                 className="flex justify-between p-3 border items-center"
//               >
//                 <img
//                   src={url}
//                   alt="Listing Image"
//                   className="w-20 h-20 object-contain rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveImage(index)}
//                   className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}

//           <button
//             disabled={loading || uploading}
//             className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
//           >
//             {loading ? "Updating..." : "Update Listing"}
//           </button>
//           {error && <p className="text-red-700 text-sm">{error}</p>}
//         </div>
//       </form>
//     </main>
//   );
// }
