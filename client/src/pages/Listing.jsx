import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import "swiper/css/bundle";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">{<Spinner />}</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something Went Wrong...!</p>
      )}
      {listing && !loading && !error && (
        <>
          {/* Swiper for Image Gallery */}
          <Swiper navigation>
            {listing.imageUrls &&
              listing.imageUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="h-[500px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
          </Swiper>

          {/* Share Button */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          <div className="flex flex-col max-w-6xl mx-auto p-3 my-7 gap-6 font-serif">
            {/* Property Title and Type */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{listing.name}</h1>
              <p className="text-lg text-slate-600">{listing.propertyType}</p>
            </div>

            {/* Main Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <FaBed /> {listing.bedrooms} beds
              </div>
              <div className="flex items-center gap-2">
                <FaBath /> {listing.bathrooms} baths
              </div>
              <div className="flex items-center gap-2">
                <FaChair /> {listing.area} sqft
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt /> {listing.address}
              </div>
              <div className="flex items-center gap-2">
                <FaParking />{" "}
                {listing.parking ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <FaTimes className="text-red-600" />
                )}
                Parking
              </div>
              <div className="flex items-center gap-2">
                <FaChair />{" "}
                {listing.furnished ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <FaTimes className="text-red-600" />
                )}
                Furnished
              </div>
            </div>

            {/* Price and Type */}
            <div className="flex flex-wrap gap-4 items-center">
              <span className="bg-red-700 text-white px-4 py-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>
              <span className="text-2xl font-semibold">
                ${listing.offer ? listing.discountPrice : listing.regularPrice}
                {listing.type === "rent" && " /month"}
              </span>
              {listing.offer && (
                <span className="bg-green-700 text-white px-4 py-1 rounded-md">
                  ${listing.regularPrice - listing.discountPrice} discount
                </span>
              )}
            </div>

            {/* Description */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-slate-700">{listing.description}</p>
            </div>

            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {listing.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FaCheck className="text-green-600" /> {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Features */}
            {listing.communityFeatures && listing.communityFeatures.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                  Community Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {listing.communityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FaCheck className="text-green-600" /> {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Floor Plan */}
            {listing.floorPlan && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Floor Plan</h2>
                <img
                  src={listing.floorPlan}
                  alt="Floor Plan"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Map */}
            {listing.mapUrl && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Location</h2>
                <div dangerouslySetInnerHTML={{ __html: listing.mapUrl }} />
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}




// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Spinner from "../components/Spinner";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import {
//   FaBath,
//   FaBed,
//   FaChair,
//   FaMapMarkerAlt,
//   FaParking,
//   FaShare,
//   FaCheck,
// } from "react-icons/fa";

// import "swiper/css/bundle";
// import { useSelector } from "react-redux";
// import Contact from "../components/Contact";

// export default function Listing() {
//   const params = useParams();
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [contact, setContact] = useState(false);
//   const { currentUser } = useSelector((state) => state.user);

//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/listing/get/${params.listingId}`);
//         const data = await res.json();
//         if (data.success === false) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         setListing(data);
//         setLoading(false);
//       } catch (err) {
//         setError(true);
//         setLoading(false);
//       }
//     };

//     fetchListing();
//   }, [params.listingId]);

//   return (
//     <main>
//       {loading && <p className="text-center my-7 text-2xl">{<Spinner />}</p>}
//       {error && (
//         <p className="text-center my-7 text-2xl">Something Went Wrong...!</p>
//       )}
//       {listing && !loading && !error && (
//         <>
//           {/* Swiper for Image Gallery */}
//           <Swiper navigation>
//             {listing.imageUrls &&
//               listing.imageUrls.map((url, index) => (
//                 <SwiperSlide key={index}>
//                   <div
//                     className="h-[500px]"
//                     style={{
//                       background: `url(${url}) center no-repeat`,
//                       backgroundSize: "cover",
//                     }}
//                   ></div>
//                 </SwiperSlide>
//               ))}
//           </Swiper>

//           {/* Share Button */}
//           <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
//             <FaShare
//               className="text-slate-500"
//               onClick={() => {
//                 navigator.clipboard.writeText(window.location.href);
//                 setCopied(true);
//                 setTimeout(() => {
//                   setCopied(false);
//                 }, 2000);
//               }}
//             />
//           </div>
//           {copied && (
//             <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
//               Link copied!
//             </p>
//           )}

//           <div className="flex flex-col max-w-6xl mx-auto p-3 my-7 gap-6 font-serif">
//             {/* Property Title and Type */}
//             <div className="flex flex-col gap-2">
//               <h1 className="text-3xl font-bold">{listing.name}</h1>
//               <p className="text-lg text-slate-600">{listing.propertyType}</p>
//             </div>

//             {/* Main Property Details */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <FaBed /> {listing.bedrooms} beds
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaBath /> {listing.bathrooms} baths
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaChair /> {listing.area} sqft
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaMapMarkerAlt /> {listing.address}
//               </div>
//             </div>

//             {/* Price and Type */}
//             <div className="flex flex-wrap gap-4 items-center">
//               <span className="bg-red-700 text-white px-4 py-1 rounded-md">
//                 {listing.type === "rent" ? "For Rent" : "For Sale"}
//               </span>
//               <span className="text-2xl font-semibold">
//                 ${listing.offer ? listing.discountPrice : listing.regularPrice}
//                 {listing.type === "rent" && " /month"}
//               </span>
//               {listing.offer && (
//                 <span className="bg-green-700 text-white px-4 py-1 rounded-md">
//                   ${listing.regularPrice - listing.discountPrice} discount
//                 </span>
//               )}
//             </div>

//             {/* Description */}
//             <div className="bg-slate-50 p-4 rounded-lg">
//               <h2 className="text-xl font-semibold mb-2">Description</h2>
//               <p className="text-slate-700">{listing.description}</p>
//             </div>

//             {/* Features */}
//             {listing.features && listing.features.length > 0 && (
//               <div className="bg-slate-50 p-4 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-2">Features</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//                   {listing.features.map((feature, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <FaCheck className="text-green-600" /> {feature}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

// {/* Community Features */}
// {listing.communityFeatures && listing.communityFeatures.length > 0 && (
//               <div className="bg-slate-50 p-4 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-2">Community Features</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//                   {listing.communityFeatures.map((feature, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <FaCheck className="text-green-600" /> {feature}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Floor Plan */}
//             {listing.floorPlan && (
//               <div className="bg-slate-50 p-4 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-2">Floor Plan</h2>
//                 <img
//                   src={listing.floorPlan}
//                   alt="Floor Plan"
//                   className="w-full rounded-lg"
//                 />
//               </div>
//             )}

//     {/* Map */}
// {listing.mapUrl && (
//            <div className="bg-slate-50 p-4 rounded-lg">
//              <h2 className="text-xl font-semibold mb-2">Location</h2>
//               <div dangerouslySetInnerHTML={{ __html: listing.mapUrl }} />
//             </div>
//           )}

//           </div>
//         </>
//       )}
//     </main>
//   );
// }








// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Spinner from "../components/Spinner";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore from "swiper";
// import { Navigation } from "swiper/modules";
// import {
//   FaBath,
//   FaBed,
//   FaChair,
//   FaMapMarkerAlt,
//   FaParking,
//   FaShare,
// } from "react-icons/fa";

// import "swiper/css/bundle";
// import { useSelector } from "react-redux";
// import Contact from "../components/Contact";

// SwiperCore.use([Navigation]);

// export default function Listing() {
//   const params = useParams();
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false); 
//   const [copied, setCopied] = useState(false);
//   const [contact, setContact] = useState(false)
//   const { currentUser } = useSelector((state) => state.user);

//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/listing/get/${params.listingId}`);
//         const data = await res.json();
//         if (data.success === false) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         setListing(data);
//         setLoading(false);
//         setError(false);
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//       }
//     };
  

//       fetchListing();
  
//   }, [params.listingId]);

//   return (
//     <main>
//       {loading && <p className="text-center my-7 text-2xl">{<Spinner />}</p>}
//       {error && (
//         <p className="text-center my-7 text-2xl">Something Went Wrong...!</p>
//       )}
//       {listing && !loading && !error && (
//         <>
//           <Swiper navigation>
//             {listing.imageUrls.map((url) => (
//               <SwiperSlide key={url}>
//                 <div
//                   className="h-[500px]"
//                   style={{
//                     background: `url(${url}) center no-repeat`,
//                     backgroundSize: "cover",
//                   }}
//                 ></div>
//               </SwiperSlide>
//             ))}
//           </Swiper>

//           <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
//             <FaShare
//               className="text-slate-500"
//               onClick={() => {
//                 navigator.clipboard.writeText(window.location.href); 
//                 setCopied(true); 
//                 setTimeout(() => {
//                   setCopied(false); 
//                 }, 2000);
//               }}
//             />
//           </div>
//           {copied && (
//             <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
//               Link copied!
//             </p>
//           )}

//           <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
//             <p className="text-2xl font-semibold">
//               {listing.name} - ${" "}
//               {listing.offer
//                 ? listing.discountPrice.toLocaleString("en-US")
//                 : listing.regularPrice.toLocaleString("en-US")}
//               {listing.type === "rent" && ' / month'}
//             </p>
//             <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
//               <FaMapMarkerAlt className="text-green-700" />
//               {listing.address}
//             </p>
//             <div className="flex gap-4">
//               <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
//                 {listing.type === "rent" ? "For Rent" : "For Sale"}
//               </p>
//               {listing.offer && (
//                 <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
//                   ${+listing.regularPrice - +listing.discountPrice} OFF
//                 </p>
//               )}
//             </div>
//             <p className="text-slate-800">
//               {" "}
//               <span className="font-semibold text-black">Description - </span>
//               {listing.description}
//             </p>

//             <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
//               <li className="flex items-center gap-1 whitespace-nowrap ">
//                 <FaBed className="text-lg" />
//                 {listing.bedrooms > 1
//                   ? `${listing.bedrooms} beds `
//                   : `${listing.bedrooms} bed `}
//               </li>
//               <li className="flex items-center gap-1 whitespace-nowrap ">
//                 <FaBath className="text-lg" />
//                 {listing.bathrooms > 1
//                   ? `${listing.bathrooms} baths `
//                   : `${listing.bathrooms} bath `}
//               </li>
//               <li className="flex items-center gap-1 whitespace-nowrap ">
//                 <FaParking className="text-lg" />
//                 {listing.parking ? "Parking spot" : "No Parking"}
//               </li>
//               <li className="flex items-center gap-1 whitespace-nowrap ">
//                 <FaChair className="text-lg" />
//                 {listing.furnished ? "Furnished" : "Unfurnished"}
//               </li>
//             </ul>
//             {currentUser && listing.userRef !== currentUser._id && !contact && (
//               <button
//                 onClick={() => setContact(true)}
//                 className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
//               >
//                 Contact landlord
//               </button>
//             )}
//             {contact && (
//               <Contact listing={listing} />
//             )}
//           </div>
//           {listing.mapUrl && (
//             <div className="m-4">
//               <h2 className="text-2xl font-semibold mt-5">Location</h2>
//               <div dangerouslySetInnerHTML={{ __html: listing.mapUrl }} />
//             </div>
//           )}
//         </>
//       )}
//     </main>
//   );
// }





// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Spinner from "../components/Spinner";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore from "swiper";
// import { Navigation } from "swiper/modules";
// import {
//   FaBath,
//   FaBed,
//   FaChair,
//   FaMapMarkerAlt,
//   FaParking,
//   FaShare,
// } from "react-icons/fa";

// import "swiper/css/bundle";
// import { useSelector } from "react-redux";
// import Contact from "../components/Contact";

// export default function Listing() {
//   const params = useParams();
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false); 
//   const [copied, setCopied] = useState(false);
//   const [contact, setContact] = useState(false)
//   const { currentUser } = useSelector((state) => state.user);

//   SwiperCore.use([Navigation]);

//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/listing/get/${params.listingId}`);
//         const data = await res.json();
//         if (data.success === false) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         setListing(data);
//         setLoading(false);
//         setError(false);
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//       }
//     };

//     fetchListing();
//   }, [params.listingId]);


//   return (
//     <main>
//       {loading && <p className="text-center my-7 text-2xl">{<Spinner />}</p>},
//       {error && (
//         <p className="text-center my-7 text-2xl">Something Went Wrong...!</p>
//       )}
//       {listing && !loading && !error && (
//         <>
//           <Swiper navigation>
//             {listing.imageUrls.map((url) => (
//               <SwiperSlide key={url}>
//                 <div
//                   className="h-[500px]"
//                   style={{
//                     background: `url(${url}) center no-repeat`,
//                     backgroundSize: "cover",
//                   }}
//                 ></div>
//               </SwiperSlide>
//             ))}
//           </Swiper>

//           <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
//             <FaShare
//               className="text-slate-500"
//               onClick={() => {
//                 navigator.clipboard.writeText(window.location.href); 
//                 setCopied(true); 
//                 setTimeout(() => {
//                   setCopied(false); 
//                 }, 2000);
//               }}
//             />
//           </div>
//           {copied && (
//             <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
//               Link copied!
//             </p>
//           )}

//           <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
//             <p className="text-2xl font-semibold">
//               {listing.name} - ${" "}
//               {listing.offer
//                 ? listing.discountPrice.toLocaleString("en-US")
//                 : listing.regularPrice.toLocaleString("en-US")}
//               {listing.type === "rent" && ' / month'}
//             </p>
//             <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
//               <FaMapMarkerAlt className="text-green-700" />
//               {listing.address}
//             </p>
//             <div className="flex gap-4">
//               <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
//                 {listing.type === "rent" ? "For Rent" : "For Sale"}
//               </p>
//               {listing.offer && (
//                 <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
//                   ${+listing.regularPrice - +listing.discountPrice} OFF
//                 </p>
//               )}
//             </div>
//             <p className="text-slate-800">
//               {" "}
//               <span className="font-semibold text-black">Description - </span>
//               {listing.description}
//             </p>

//             <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
//               <li className="flex items-center gap-1 whitespace-nowrap ">
//                 <FaBed className="text-lg" />
//                 {listing.bedrooms > 1
//                   ? `${listing.bedrooms} beds `
//                   : `${listing.bedrooms} bed `}
//               </li>
//               <li className="flex items-center gap-1 whitespace-nowrap ">
//                 <FaBath className="text-lg" />
//                 {listing.bathrooms > 1
//                   ? `${listing.bathrooms} baths `
//                   : `${listing.bathrooms} bath `}
//               </li>
//               <li className="flex items-center gap-1 whitespace-nowrap ">
//                 <FaParking className="text-lg" />
//                 {listing.parking ? "Parking spot" : "No Parking"}
//               </li>
//               <li className="flex items-center gap-1 whitespace-nowrap ">
//                 <FaChair className="text-lg" />
//                 {listing.furnished ? "Furnished" : "Unfurnished"}
//               </li>
//             </ul>
//             {currentUser && listing.userRef !== currentUser._id && !contact && (
//               <button
//                 onClick={() => setContact(true)}
//                 className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
//               >
//                 Contact landlord
//               </button>
//             )}
//             {contact && (
//               <Contact listing={listing} />
//             )}
//           </div>
//         </>
//       )}
//     </main>
//   );
// }
