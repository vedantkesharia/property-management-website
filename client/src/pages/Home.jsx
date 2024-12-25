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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    { url: image1,  title: "FIND THE PERFECT HOME FOR YOU",description: "Alpha Real Estate is a prestigious real estate brokerage and advisory service firm, having extensive experience of more than 10 years in the real estate market in Dubai. The company specializes in connecting buyers, sellers, and renters globally." },
    { url: image2, title: "FIND YOUR DREAM PROPERTY",description:"Our dedicated team offers unparalleled expertise, ensuring you discover the ideal property for your lifestyle and investment goals."},
    { url: image3, title: "TRUSTED REAL ESTATE PARTNERS", description:"Join countless satisfied clients who have trusted us with their real estate journey in the UAE and beyond."}
  ]; // Replace with your actual image paths
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <div className="font-serif">
      {/* Updated Hero Section */}
      <div className="relative flex items-start justify-start" style={{ height: "100vh", width: "100%" }}>
  {/* Static Textbox */}
  <div className="absolute right-32 top-12 z-10">
    <div className="bg-white bg-opacity-30 p-6 rounded-lg shadow-lg border border-yellow-300 max-w-xs">
      <h4 className="text-gray-800 text-base font-semibold">ENTER CITY OR STATE</h4>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="City or State"
          className="w-full p-2 rounded border border-gray-400 focus:outline-none"
        />
        <h4 className="text-gray-800 text-base font-semibold">CHOOSE TYPE</h4>
        <select className="w-full p-2 rounded border border-gray-400 focus:outline-none">
          <option>Contract Type</option>
          <option>Rent</option>
          <option>Sale</option>
        </select>
        <h4 className="text-gray-800 text-base font-semibold">PROPERTY TYPE</h4>
        <select className="w-full p-2 rounded border border-gray-400 focus:outline-none">
          <option>Property Type</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Office</option>
        </select>
        <h4 className="text-gray-800 text-base font-semibold">BEDROOM</h4>
        <select className="w-full p-2 rounded border border-gray-400 focus:outline-none">
          <option>Bedroom</option>
          <option>1</option>
          <option>2</option>
          <option>3+</option>
        </select>
        <h4 className="text-gray-800 text-base font-semibold">MAX PRICE</h4>
        <input
          type="number"
          placeholder="Max Price"
          className="w-full p-2 rounded border border-gray-400 focus:outline-none"
        />
        <button className="w-full bg-yellow-400 text-gray-800 p-2 rounded hover:bg-yellow-500 transition-colors">
          SEARCH
        </button>
      </div>
    </div>
  </div>

  {/* Slider */}
  <Slider {...settings} className="w-full h-full">
    {images.map((image, index) => (
      <div key={index} className="relative h-full w-full">
        <div
          className="flex items-center justify-start h-full w-full"
          style={{
            backgroundImage: `url(${image.url})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          {/* Sliding Text */}
          <div className="text-left p-2 rounded align-center ml-2 max-w-lg">
            <h1 className="text-3xl lg:text-5xl font-bold tracking-wider text-white mb-4">
              {image.title}
            </h1>
            <p className="text-white text-xl lg:text-xl">{image.description}</p>
          </div>
        </div>
      </div>
    ))}
  </Slider>
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
