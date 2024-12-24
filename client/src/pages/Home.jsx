import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import image1 from "../images/image2.jpeg"
import image2 from "../images/image3.jpeg"
import image3 from "../images/image4.jpeg"

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);


  const images = [
   image1,
   image2,image3
  ]; // Replace with your actual image paths
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, [images.length]);
  return (
    <div>
      {/* Updated Hero Section */}
      <div
      className="relative bg-gray-100 h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${images[currentImage]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-gray-900 bg-opacity-50 h-full flex flex-col lg:flex-row justify-between p-8 lg:p-28 px-3 max-w-6xl mx-auto">
        {/* Left Side - Text Content */}
        <div className="flex flex-col gap-6 lg:w-1/2 text-white">
          <h1 className="text-3xl lg:text-5xl font-light tracking-wider">
            INTRODUCTORY
            <br />
            TEXT
          </h1>
          <p className="text-gray-300 text-sm lg:text-base">
            lorem ipsum dolor sit amet, consectetur adipiscing elit. aliquam
            aliquam nisi nisi, eu imperdiet ex ullamcorper eu.
          </p>
          {/* <Link
            to={"/search"}
            className="text-xs sm:text-sm text-blue-300 font-bold hover:underline"
          >
            Let&apos;s get started now
          </Link> */}
        </div>

        {/* Right Side - Filter Tool */}
        <div className="mt-8 lg:mt-0 lg:w-1/3">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-xl mb-6">AI FILTER TOOL</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Location"
                className="w-full p-2 rounded border border-gray-500"
              />
              <input
                type="text"
                placeholder="Property Type"
                className="w-full p-2 rounded border border-gray-500"
              />
              <input
                type="text"
                placeholder="Price Range"
                className="w-full p-2 rounded border border-gray-500"
              />
              <input
                type="text"
                placeholder="Contract Type"
                className="w-full p-2 rounded border border-gray-500"
              />
              <button className="w-full bg-[#BEB19B] text-gray-900 p-2 rounded hover:bg-[#A89883] transition-colors">
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="w-full flex flex-col items-center justify-center my-16 px-4">
      <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-800 font-light tracking-wider text-center">
        FEATURED PROPERTIES
      </h2>
      <div className="w-48 md:w-64 h-[1px] bg-gray-300 mt-4"></div>
     </div>
      {/* Swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing, index) => (
            <SwiperSlide key={listing._id || index}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listings results for offer, sale and rent */}
      <div className="max-w-8xl p-3 items-center flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
    

        {saleListings && saleListings.length > 0 && (
          <div className="w-full lg:w-auto mx-auto lg:flex lg:flex-col">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* services */}
      <div className="w-full flex flex-col items-center px-4 py-16">
      {/* Heading with line decoration */}
      <div className="w-full flex flex-col items-center justify-center mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-800 font-light tracking-wider text-center">
          OUR SERVICES
        </h2>
        <div className="w-48 md:w-64 h-[1px] bg-[#BEB19B] mt-4"></div>
      </div>

      {/* Content Container */}
      <div className="w-full flex flex-col lg:flex-row">
      {/* Image Panel */}
      <div className="w-full lg:w-1/2 h-[600px]">
        <img 
          src="https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=800&auto=format&fit=crop&q=80"
          alt="Toronto city skyline at night"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Panel */}
      <div className="w-full lg:w-1/2 bg-[#1C2536] text-white p-8 lg:p-16 flex flex-col justify-center h-[600px]">
        <h3 className="text-4xl font-light mb-8">
          Service
        </h3>
        <p className="text-gray-300 mb-12 leading-relaxed">
          lorem ipsum dolor sit amet, consectetur adipiscing elit. aliquam aliquam 
          nisi nisi, eu imperdiet ex ullamcorper eu. lorem ipsum dolor sit amet, 
          consectetur adipiscing elit. aliquam aliquam nisi nisi, eu imperdiet ex 
          ullamcorper eu.
        </p>
        <button className="border border-white text-white px-8 py-2 w-fit hover:bg-white hover:text-[#1C2536] transition-colors duration-300">
          CONTACT US
        </button>
      </div>
    </div>

    
      </div>
    </div>




  );
}






// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import SwiperCore from "swiper";
// import "swiper/css/bundle";
// import ListingItem from "../components/ListingItem";

// export default function Home() {
//   const [offerListings, setOfferListings] = useState([]);
//   const [saleListings, setSaleListings] = useState([]);
//   const [rentListings, setRentListings] = useState([]);
//   SwiperCore.use([Navigation]);

//   useEffect(() => {
//     const fetchOfferListings = async () => {
//       try {
//         const res = await fetch("/api/listing/get?offer=true&limit=4");
//         const data = await res.json();
//         setOfferListings(data);
//         fetchRentListings();
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const fetchRentListings = async () => {
//       try {
//         const res = await fetch("/api/listing/get?type=rent&limit=4");
//         const data = await res.json();
//         setRentListings(data);
//         fetchSaleListings();
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const fetchSaleListings = async () => {
//       try {
//         const res = await fetch("/api/listing/get?type=sale&limit=4");
//         const data = await res.json();
//         setSaleListings(data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchOfferListings();
//   }, []);

//   return (
//     <div>
//       {/* top side */}
//       <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
//         <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
//           Find your next <span className="text-slate-500">perfect</span>
//           <br />
//           place with ease
//         </h1>

//         <div className="text-gray-400 text-xs sm:text-sm">
//           Evans Estate is the coolest and perfect place you can think off
//           <br />
//           We have wide and diversere range of properties you you to choose from.
//         </div>

//         <Link
//           to={"/search"}
//           className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
//         >
//           Let&apos;s get started now
//         </Link>
//       </div>

//       {/* swiper */}
//       <Swiper navigation>
//         {offerListings &&
//           offerListings.length > 0 &&
//           offerListings.map((listing, index) => (
//             <SwiperSlide key={listing._id || index}>
//               <div
//                 style={{
//                   background: `url(${listing.imageUrls[0]}) center no-repeat`,
//                   backgroundSize: "cover",
//                 }}
//                 className="h-[500px]"
//               ></div>
//             </SwiperSlide>
//           ))}
//       </Swiper>

//       {/* Listings results for offer, sale and re */}
//       <div className="max-w-8xl p-3 items-center flex flex-col gap-8 my-10">
//         {offerListings && offerListings.length > 0 && (
//           <div className="">
//             <div className="my-3">
//               <h2 className="text-2xl font-semibold text-slate-600">
//                 Recent offers
//               </h2>
//               <Link
//                 className="text-sm text-blue-800 hover:underline"
//                 to={"/search?offer=true"}
//               >
//                 Show more offers
//               </Link>
//             </div>
//             <div className="flex flex-wrap gap-4">
//               {offerListings.map((listing) => (
//                 <ListingItem listing={listing} key={listing._id} />
//               ))}
//             </div>
//           </div>
//         )}
//         {rentListings && rentListings.length > 0 && (
//           <div className="">
//             <div className="my-3">
//               <h2 className="text-2xl font-semibold text-slate-600">
//                 Recent places for rent
//               </h2>
//               <Link
//                 className="text-sm text-blue-800 hover:underline"
//                 to={"/search?type=rent"}
//               >
//                 Show more places for rent
//               </Link>
//             </div>
//             <div className="flex flex-wrap gap-4">
//               {rentListings.map((listing) => (
//                 <ListingItem listing={listing} key={listing._id} />
//               ))}
//             </div>
//           </div>
//         )}

//         {saleListings && saleListings.length > 0 && (
//           <div className="w-full lg:w-auto mx-auto lg:flex lg:flex-col">
//             <div className="my-3">
//               <h2 className="text-2xl font-semibold text-slate-600">
//                 Recent places for sale
//               </h2>
//               <Link
//                 className="text-sm text-blue-800 hover:underline"
//                 to={"/search?type=sale"}
//               >
//                 Show more places for sale
//               </Link>
//             </div>
//             <div className="flex flex-wrap gap-4 justify-center">
//               {saleListings.map((listing) => (
//                 <ListingItem listing={listing} key={listing._id} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
