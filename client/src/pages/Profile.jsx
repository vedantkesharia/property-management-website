import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  updateUserFailure,
  updateUserStart,
  updateuserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [userNews, setUserNews] = useState([]);
  const [showNewsError, setShowNewsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setFilePerc(progress);
      },
      () => {
        setFileUploadError(true);
        setSuccessMessage("");
        setTimeout(() => {
          setFileUploadError(false);
        }, 5000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          setFileUploadError(false);
          setSuccessMessage("Image successfully uploaded!");
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateuserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
      setSuccessMessage("User has been deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      setSuccessMessage("Listing deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowNews = async () => {
    try {
      setShowNewsError(false); // Reset error state
      const res = await fetch(`/api/user/news/${currentUser._id}`);
      const data = await res.json();
      console.log(data); // Debug the API response here
  
      if (data.success === false) {
        console.error("API returned an error:", data.message);
        setShowNewsError(true);
        return;
      }
  
      // Since `data` is directly an array, set it without accessing `data.news`
      setUserNews(data); // Directly assign the fetched data
    } catch (error) {
      console.error("Fetch error:", error.message);
      setShowNewsError(true);
    }
  };
  

  // const handleShowNews = async () => {
  //   try {
  //     setShowNewsError(false); // Reset error state
  //     const res = await fetch(`/api/user/news/${currentUser._id}`);
  //     const data = await res.json();
  //     console.log(data); // Debug the API response here
  
  //     if (data.success === false) {
  //       console.error("API returned an error:", data.message);
  //       setShowNewsError(true);
  //       return;
  //     }
  
  //     setUserNews(data.news || []); // Ensure the key `news` is correct
  //   } catch (error) {
  //     console.error("Fetch error:", error.message);
  //     setShowNewsError(true);
  //   }
  // };
  

  // const handleShowNews = async () => {
  //   try {
  //     setShowNewsError(false);
  //     const res = await fetch(`/api/user/news/${currentUser._id}`);
  //     const data = await res.json();
  //     if (data.success === false) {
  //       setShowNewsError(true);
  //       return;
  //     }

  //     setUserNews(data);
  //   } catch (error) {
  //     setShowNewsError(true);
  //   }
  // };

  const handleDeleteNews = async (newsId) => {
    try {
      const res = await fetch(`/api/news/delete/${newsId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserNews((prev) => prev.filter((news) => news._id !== newsId));
      setSuccessMessage("News deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.log(error.message);
    }
  };

  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Image Upload Error (Must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">{successMessage}</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          defaultValue={currentUser.password}
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>

        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-news"}
        >
          Create News
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "User is successfully updated!" : ""}
      </p>
      <p className="text-green-700">{successMessage}</p>

      <button className="text-green-700 w-full" onClick={handleShowListings}>
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="Listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}


       <button className="text-green-700 w-full" onClick={handleShowNews}>
        Show News
      </button>
      <p className="text-red-700 mt-5">
        {showNewsError ? "Error showing news" : ""}
      </p>
      {userNews.length > 0 ? (
  <div className="flex flex-col gap-4">
    <h1 className="text-center mt-7 text-2xl font-semibold">
      Your News
    </h1>
    {userNews.map((news) => (
      <div
        key={news._id}
        className="border rounded-lg p-3 flex justify-between items-center gap-4"
      >
        {news.images && news.images.length > 0 && (
          <img
            src={news.images[0]}
            alt="News cover"
            className="h-16 w-16 object-contain"
          />
        )}
        <Link to={`/news/${news._id}`}>
          <p>{news.title}</p>
        </Link>
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleDeleteNews(news._id)}
            className="text-red-700 uppercase"
          >
            Delete
          </button>
          <Link to={`/update-news/${news._id}`}>
            <button className="text-green-700 uppercase">Edit</button>
          </Link>
        </div>
      </div>
    ))}
  </div>
) : (
  <p></p>
)}

      
    </div>
  );
}


//only listing
// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { app } from "../firebase";
// import {
//   deleteUserFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   signOutUserStart,
//   updateUserFailure,
//   updateUserStart,
//   updateuserSuccess,
// } from "../redux/user/userSlice";
// import { Link } from "react-router-dom";

// export default function Profile() {
//   const fileRef = useRef(null);
//   const dispatch = useDispatch();
//   const { currentUser, loading, error } = useSelector((state) => state.user);
//   const [file, setFile] = useState(undefined);
//   const [filePerc, setFilePerc] = useState(0);
//   const [fileUploadError, setFileUploadError] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [updateSuccess, setUpdateSuccess] = useState(false);
//   const [showListingsError, setShowListingsError] = useState(false);
//   const [userListings, setUserListings] = useState([]);

//   // console.log('ican', formData);

//   const [successMessage, setSuccessMessage] = useState("");

//   const handleFileUpload = (file) => {
//     const storage = getStorage(app);
//     const fileName = new Date().getTime() + file.name;
//     const storageRef = ref(storage, fileName);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress = Math.round(
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//         );
//         setFilePerc(progress);
//       },
//       () => {
//         setFileUploadError(true);
//         setSuccessMessage("");
//         setTimeout(() => {
//           setFileUploadError(false);
//         }, 5000);
//       },
//       () => {
//         // Upload completed successfully, handle any additional logic here
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           setFormData({ ...formData, avatar: downloadURL });
//           setFileUploadError(false);
//           setSuccessMessage("Image successfully uploaded!");
//           setTimeout(() => {
//             setSuccessMessage("");
//           }, 5000);
//         });
//       }
//     );
//   };

//   useEffect(() => {
//     if (file) {
//       handleFileUpload(file);
//     }
//   }, [file]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(updateUserStart());
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(updateUserFailure(data.message));
//         return;
//       }

//       dispatch(updateuserSuccess(data));
//       setUpdateSuccess(true);
//     } catch (error) {
//       dispatch(updateUserFailure(error.message));
//     }
//   };

//   // Handle Delete User
//   // const handleDeleteUser = async () => {
//   //   try {
//   //     dispatch(deleteUserStart());
//   //     const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//   //       method: "DELETE",
//   //     });

//   //     const data = await res.json();
//   //     if (data.success === false) {
//   //       dispatch(deleteUserFailure(data.message));
//   //       return;
//   //     }

//   //     dispatch(deleteUserSuccess(data));
//   //   } catch (error) {
//   //     dispatch(deleteUserFailure(error.message));
//   //   }
//   // };

//   const handleDeleteUser = async () => {
//     try {
//       dispatch(deleteUserStart());
//       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//         method: "DELETE",
//       });
  
//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(deleteUserFailure(data.message));
//         return;
//       }
  
//       dispatch(deleteUserSuccess(data));
//       setSuccessMessage("User has been deleted successfully!");
//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 5000);
//     } catch (error) {
//       dispatch(deleteUserFailure(error.message));
//     }
//   };
  

//   const handleSignOut = async () => {
//     try {
//       dispatch(signOutUserStart());
//       const res = await fetch("/api/auth/signout");
//       const data = await res.json();
//       // Handle success or error response as needed
//       if (data.success === false) {
//         dispatch(deleteUserFailure(data.message));
//         return;
//       }
//       dispatch(deleteUserSuccess(data));
//     } catch (error) {
//       // Handle fetch error
//       dispatch(deleteUserFailure(error.message));
//     }
//   };

//   // HANDLE SHOW LISTINGS

//   const handleShowListings = async () => {
//     try {
//       setShowListingsError(false);
//       const res = await fetch(`/api/user/listings/${currentUser._id}`);
//       const data = await res.json();
//       if (data.success === false) {
//         setShowListingsError(true);
//         return;
//       }

//       setUserListings(data);
//     } catch (error) {
//       setShowListingsError(true);
//     }
//   };

//   // HANDLE DELETE LISTING

//   // const handleListingDelete = async (listingId) => {
//   //   try {
//   //     const res = await fetch(`/api/listing/delete/${listingId}`, {
//   //       method: "DELETE",
//   //     });
//   //     const data = await res.json();
//   //     if (data.success === false) {
//   //       console.log(data.message);
//   //       return;
//   //     }

//   //     setUserListings((prev) =>
//   //       prev.filter((listing) => listing._id !== listingId)
//   //     );
//   //   } catch (error) {
//   //     console.log(error.message);
//   //   }
//   // };

//   const handleListingDelete = async (listingId) => {
//     try {
//       const res = await fetch(`/api/listing/delete/${listingId}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         console.log(data.message);
//         return;
//       }
  
//       setUserListings((prev) =>
//         prev.filter((listing) => listing._id !== listingId)
//       );
//       setSuccessMessage("Listing deleted successfully!");
//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 5000);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
  

//   return (
//     <div className="p-3 max-w-lg mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           onChange={(e) => setFile(e.target.files[0])}
//           type="file"
//           ref={fileRef}
//           hidden
//           accept="image/*"
//         />

//         <img
//           onClick={() => fileRef.current.click()}
//           src={formData.avatar || currentUser.avatar}
//           alt="profile"
//           className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
//         />

//         <p className="text-sm self-center">
//           {fileUploadError ? (
//             <span className="text-red-700">
//               {" "}
//               Image Upload Error (Must be less than 2MB)
//             </span>
//           ) : filePerc > 0 && filePerc < 100 ? (
//             <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
//           ) : filePerc === 100 ? (
//             <span className="text-green-700">{successMessage}</span>
//           ) : (
//             ""
//           )}
//         </p>

//         <input
//           type="text"
//           placeholder="username"
//           className="border p-3 rounded-lg"
//           id="username"
//           defaultValue={currentUser.username}
//           onChange={handleChange}
//         />
//         <input
//           type="email"
//           placeholder="email"
//           className="border p-3 rounded-lg"
//           id="email"
//           defaultValue={currentUser.email}
//           onChange={handleChange}
//         />
//         <input
//           type="password"
//           placeholder="password"
//           className="border p-3 rounded-lg"
//           id="password"
//           defaultValue={currentUser.password}
//           onChange={handleChange}
//         />

//         <button
//           disabled={loading}
//           className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
//         >
//           {loading ? "Loading..." : "Update"}
//         </button>

//         <Link
//           className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
//           to={"/create-listing"}
//         >
//           Create Listing
//         </Link>
//       </form>

//       <div className="flex justify-between mt-5">
//         <span
//           onClick={handleDeleteUser}
//           className="text-red-700 cursor-pointer"
//         >
//           Delete Account
//         </span>
//         <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
//           Sign Out
//         </span>

//       </div>

//       <p className="text-red-700 mt-5">{error ? error : ""}</p>
//       <p className="text-green-700">
//         {updateSuccess ? "User is successfully updated!" : ""}
//       </p>
//       <p className="text-green-700">{successMessage}</p>

//       <button className="text-green-700 w-full" onClick={handleShowListings}>
//         Show Listings
//       </button>
//       <p className="text-red-700 mt-5">
//         {showListingsError ? "Error showing listings" : ""}
//       </p>

//       {userListings && (
//         <div className="flex flex-col gap-4">
//           <h1 className="text-center mt-7 text-2xl font-semibold">
//             Your Listings
//           </h1>
//           {userListings.length > 0 &&
//             userListings.map((listing) => (
//               <div
//                 key={listing._id}
//                 className="border rounded-lg p-3 flex justify-between items-center gap-4"
//               >
//                 <Link to={`/listing/${listing._id}`}>
//                   <img
//                     src={listing.imageUrls[0]}
//                     alt="Listing cover"
//                     className="h-16 w-16 object-contain"
//                   />
//                 </Link>
//                 <Link to={`/listing/${listing._id}`}>
//                   <p className="">{listing.name}</p>
//                 </Link>

//                 <div className="flex flex-col items-center">
//                   <button
//                     onClick={() => handleListingDelete(listing._id)}
//                     className="text-red-700 uppercase"
//                   >
//                     Delete
//                   </button>
//                   <Link to={`/update-listing/${listing._id}`}>
//                     <button className="text-green-700 uppercase">Edit</button>
//                   </Link>
//                 </div>
//               </div>
//             ))}
//             <p className="text-green-700">{successMessage}</p>
//         </div>
//       )}
//     </div>
//   );
// }
