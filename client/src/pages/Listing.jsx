import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaCheck,
} from "react-icons/fa";
import { useSelector } from "react-redux";


export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const formatImages = (imageUrls) => {
    return imageUrls.map(url => ({
      original: url,
      thumbnail: url,
      originalHeight: 600,
      thumbnailHeight: 80,
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Something went wrong!</div>;
  }

  return listing && (
    <div className="bg-white">
      {/* Main Image Gallery */}
      <div className="relative">
        <div className="max-w-7xl mx-auto">
          <ImageGallery
            items={formatImages(listing.imageUrls)}
            showPlayButton={false}
            showFullscreenButton={false}
            showNav={true}
            thumbnailPosition="bottom"
            slideDuration={450}
            slideInterval={3000}
            thumbnailHeight={80}
            useBrowserFullscreen={false}
            additionalClass="custom-image-gallery"
          />
        </div>

        {/* Save and Share Buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button 
            className="bg-white bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-md flex items-center gap-2 transition-all"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <FaShare /> {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>

      {/* Custom styles for the image gallery */}
      <style jsx global>{`
        .custom-image-gallery {
          max-width: 100%;
          margin: 0 auto;
        }
        .image-gallery-thumbnails-wrapper.bottom {
          background: white;
          padding: 20px 0;
        }
        .image-gallery-thumbnails {
          padding: 0 70px;
        }
        .image-gallery-thumbnail {
          width: 120px;
          margin-right: 10px;
        }
        .image-gallery-thumbnail.active,
        .image-gallery-thumbnail:hover {
          border: 2px solid #3b82f6;
        }
        .image-gallery-slide {
          background: black;
        }
        .image-gallery-slide img {
          height: 600px;
          object-fit: contain;
        }
        .image-gallery-icon:hover {
          color: #3b82f6;
        }
        .image-gallery-thumbnails-container {
          cursor: pointer;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
        }
      `}</style>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div>
              <h1 className="text-3xl font-semibold mb-4">{listing.name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {listing.address}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {listing.propertyType}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  For {listing.type}
                </span>
                {listing.furnished && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    Furnished
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                ${listing.offer ? listing.discountPrice.toLocaleString() : listing.regularPrice.toLocaleString()}
                {listing.type === "rent" && " /month"}
                {listing.offer && (
                  <span className="text-lg text-gray-500 line-through ml-2">
                    ${listing.regularPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Property Overview */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center p-4 bg-white rounded-lg">
                  <FaBed className="text-2xl text-gray-600 mb-2" />
                  <span className="text-sm text-gray-500">Bedrooms</span>
                  <span className="font-bold">{listing.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-lg">
                  <FaBath className="text-2xl text-gray-600 mb-2" />
                  <span className="text-sm text-gray-500">Bathrooms</span>
                  <span className="font-bold">{listing.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-lg">
                  <FaChair className="text-2xl text-gray-600 mb-2" />
                  <span className="text-sm text-gray-500">Area</span>
                  <span className="font-bold">{listing.area} sqft</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-lg">
                  <FaParking className="text-2xl text-gray-600 mb-2" />
                  <span className="text-sm text-gray-500">Parking</span>
                  <span className="font-bold">{listing.parking ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Features */}
            {listing.features && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

             {/* Community Features */}
             {listing.communityFeatures && listing.communityFeatures.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Community Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.communityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      <span>{feature}</span>
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
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Location</h2>
              {listing.mapUrl ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: listing.mapUrl }} 
                  className="w-full h-[400px] rounded-lg overflow-hidden"
                />
              ) : (
                <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Map not available</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-6">Contact Agent</h3>
              {/* Contact Buttons */}
              <div className="space-y-4 mb-6">
                <button className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600">
                  <FaWhatsapp className="text-xl" />
                  WhatsApp
                </button>
                <button className="w-full bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600">
                  <FaPhone className="text-xl" />
                  Call Now
                </button>
                <button className="w-full bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900">
                  <FaEnvelope className="text-xl" />
                  Email
                </button>
              </div>
              {/* Contact Form */}
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="w-full p-3 border rounded-lg"
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full p-3 border rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import {
//   FaBath,
//   FaBed,
//   FaChair,
//   FaMapMarkerAlt,
//   FaParking,
//   FaShare,
//   FaCheck,
//   FaTimes,
//   FaWhatsapp,
//   FaPhone,
//   FaEnvelope,
//   FaCalendar,
//   FaHeart,
//   FaDownload,
//   FaPrint
// } from "react-icons/fa";
// import "swiper/css/bundle";
// import { useSelector } from "react-redux";

// export default function Listing() {
//   const params = useParams();
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [copied, setCopied] = useState(false);
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

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">Something went wrong!</div>;
//   }

//   return listing && (
//     <div className="bg-gray-100">
//       {/* Hero Section with Image Slider */}
//       <div className="relative h-[70vh] bg-black">
//         <Swiper
//           modules={[Navigation, Pagination, Autoplay]}
//           navigation
//           pagination={{ clickable: true }}
//           autoplay={{ delay: 3000 }}
//           className="h-full"
//         >
//           {listing.imageUrls?.map((url, index) => (
//             <SwiperSlide key={index}>
//               <div
//                 className="h-full w-full bg-cover bg-center"
//                 style={{
//                   backgroundImage: `url(${url})`,
//                   opacity: '0.8'
//                 }}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
        
//         {/* Overlay Info */}
//         <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-8">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex justify-between items-end">
//               <div>
//                 <h1 className="text-4xl font-bold mb-4">{listing.name}</h1>
//                 <div className="flex items-center gap-4 text-lg">
//                   <span>{listing.address}</span>
//                   <span>•</span>
//                   <span className="font-bold">
//                     ${listing.offer ? listing.discountPrice.toLocaleString() : listing.regularPrice.toLocaleString()}
//                     {listing.type === "rent" && "/month"}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex gap-4">
//                 <button className="bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2">
//                   <FaHeart />
//                   Save
//                 </button>
//                 <button className="bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2">
//                   <FaShare />
//                   Share
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto py-12 px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Quick Info Bar */}
//             <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
//               <div className="flex gap-6">
//                 <span className="flex items-center gap-2">
//                   <FaCalendar className="text-gray-500" />
//                   Listed: {new Date().toLocaleDateString()}
//                 </span>
//                 <span className="flex items-center gap-2">
//                   <FaMapMarkerAlt className="text-gray-500" />
//                   Ref: {listing.reference || "REF123"}
//                 </span>
//               </div>
//               <div className="flex gap-4">
//                 <button className="text-gray-500 hover:text-gray-700">
//                   <FaDownload /> Download
//                 </button>
//                 <button className="text-gray-500 hover:text-gray-700">
//                   <FaPrint /> Print
//                 </button>
//               </div>
//             </div>

//             {/* Property Overview */}
//             <div className="bg-white rounded-lg p-6 shadow-sm">
//               <h2 className="text-2xl font-bold mb-6">Property Overview</h2>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
//                   <FaBed className="text-2xl text-gray-600 mb-2" />
//                   <span className="text-sm text-gray-500">Bedrooms</span>
//                   <span className="font-bold">{listing.bedrooms}</span>
//                 </div>
//                 <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
//                   <FaBath className="text-2xl text-gray-600 mb-2" />
//                   <span className="text-sm text-gray-500">Bathrooms</span>
//                   <span className="font-bold">{listing.bathrooms}</span>
//                 </div>
//                 <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
//                   <FaChair className="text-2xl text-gray-600 mb-2" />
//                   <span className="text-sm text-gray-500">Area</span>
//                   <span className="font-bold">{listing.area} sqft</span>
//                 </div>
//                 <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
//                   <FaParking className="text-2xl text-gray-600 mb-2" />
//                   <span className="text-sm text-gray-500">Parking</span>
//                   <span className="font-bold">{listing.parking ? "Yes" : "No"}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="bg-white rounded-lg p-6 shadow-sm">
//               <h2 className="text-2xl font-bold mb-4">Description</h2>
//               <p className="text-gray-600 leading-relaxed whitespace-pre-line">
//                 {listing.description}
//               </p>
//             </div>

//             {/* Property Features */}
//             {listing.features && (
//               <div className="bg-white rounded-lg p-6 shadow-sm">
//                 <h2 className="text-2xl font-bold mb-6">Property Features</h2>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   {listing.features.map((feature, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <FaCheck className="text-green-500" />
//                       <span>{feature}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Floor Plan */}
//             {listing.floorPlan && (
//               <div className="bg-white rounded-lg p-6 shadow-sm">
//                 <h2 className="text-2xl font-bold mb-6">Floor Plan</h2>
//                 <img
//                   src={listing.floorPlan}
//                   alt="Floor Plan"
//                   className="w-full rounded-lg"
//                 />
//               </div>
//             )}

//             {/* Map */}
//             <div className="bg-white rounded-lg p-6 shadow-sm">
//               <h2 className="text-2xl font-bold mb-6">Location</h2>
//               {listing.mapUrl ? (
//                 <div 
//                   dangerouslySetInnerHTML={{ __html: listing.mapUrl }} 
//                   className="w-full h-[400px] rounded-lg overflow-hidden"
//                 />
//               ) : (
//                 <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
//                   <span className="text-gray-500">Map not available</span>
//                 </div>
//               )}
//             </div>

//             {/* Community Features */}
//             {listing.communityFeatures && listing.communityFeatures.length > 0 && (
//               <div className="bg-white rounded-lg p-6 shadow-sm">
//                 <h2 className="text-2xl font-bold mb-6">Community Features</h2>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   {listing.communityFeatures.map((feature, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <FaCheck className="text-green-500" />
//                       <span>{feature}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Payment Plan */}
//             <div className="bg-white rounded-lg p-6 shadow-sm">
//               <h2 className="text-2xl font-bold mb-6">Payment Plan</h2>
//               <div className="space-y-4">
//                 <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
//                   <span>Booking Amount</span>
//                   <span className="font-bold">15%</span>
//                 </div>
//                 <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
//                   <span>During Construction</span>
//                   <span className="font-bold">85%</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Contact Card */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
//               <h3 className="text-xl font-bold mb-6">Contact Agent</h3>
//               {/* Agent Info */}
//               <div className="flex items-center gap-4 mb-6">
//                 <img
//                   src="/api/placeholder/80/80"
//                   alt="Agent"
//                   className="w-16 h-16 rounded-full"
//                 />
//                 <div>
//                   <h4 className="font-bold">John Doe</h4>
//                   <p className="text-gray-500">Senior Property Consultant</p>
//                 </div>
//               </div>
//               {/* Contact Buttons */}
//               <div className="space-y-4">
//                 <button className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600">
//                   <FaWhatsapp className="text-xl" />
//                   WhatsApp
//                 </button>
//                 <button className="w-full bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600">
//                   <FaPhone className="text-xl" />
//                   Call Now
//                 </button>
//                 <button className="w-full bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900">
//                   <FaEnvelope className="text-xl" />
//                   Email
//                 </button>
//               </div>
//               {/* Contact Form */}
//               <form className="mt-6 space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Your Name"
//                   className="w-full p-3 border rounded-lg"
//                 />
//                 <input
//                   type="email"
//                   placeholder="Your Email"
//                   className="w-full p-3 border rounded-lg"
//                 />
//                 <input
//                   type="tel"
//                   placeholder="Your Phone"
//                   className="w-full p-3 border rounded-lg"
//                 />
//                 <textarea
//                   placeholder="Message"
//                   rows={4}
//                   className="w-full p-3 border rounded-lg"
//                 />
//                 <button
//                   type="submit"
//                   className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
//                 >
//                   Send Message
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





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
//   FaTimes,
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
//               <div className="flex items-center gap-2">
//                 <FaParking />{" "}
//                 {listing.parking ? (
//                   <FaCheck className="text-green-600" />
//                 ) : (
//                   <FaTimes className="text-red-600" />
//                 )}
//                 Parking
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaChair />{" "}
//                 {listing.furnished ? (
//                   <FaCheck className="text-green-600" />
//                 ) : (
//                   <FaTimes className="text-red-600" />
//                 )}
//                 Furnished
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

//             {/* Community Features */}
//             {listing.communityFeatures && listing.communityFeatures.length > 0 && (
//               <div className="bg-slate-50 p-4 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-2">
//                   Community Features
//                 </h2>
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

//             {/* Map */}
//             {listing.mapUrl && (
//               <div className="bg-slate-50 p-4 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-2">Location</h2>
//                 <div dangerouslySetInnerHTML={{ __html: listing.mapUrl }} />
//               </div>
//             )}
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
