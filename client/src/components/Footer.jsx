import React from 'react';

const Footer = () => {
  const latestProperties = [
    {
      title: "Pay 90% in 5 Years After Moving-in | Rea...",
      date: "TUE, SEP-2020 11:59:46"
    },
    {
      title: "Dubai Private Beach Island Living by EMA...",
      date: "TUE, SEP-2020 11:24:20"
    },
    {
      title: "5 YEARS POST HANDOVER PAYMENT PLAN | CHE...",
      date: "TUE, SEP-2020 10:48:23"
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4 flex ">
      <div className="max-w-6xl mx-auto  grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Menu Section */}
        <div>
          <h3 className="text-amber-500 font-medium mb-4">MENU</h3>
          <ul className=" flex  space-x-3">
            <li>PROPERTIES /</li>
            <li>GALLERY / </li>
            <li>BLOG / </li>
            <li>CONTACT / </li>
          </ul>
          
          <div className="mt-8">
            <h3 className="text-amber-500 font-medium mb-4">ABOUT</h3>
            <p className="text-sm">
              Alpha Real Estate Brokers is an investment advisory and brokerage house 
              providing services for local and global clients to invest in the ever growing 
              Dubai real estate market. Alpha offers strategic real estate investment 
              planning and the creation of real estate investment programs for individual 
              and institutional investors worldwide with special emphasis on the 
              booming Dubai market.
            </p>
          </div>
          <div className="mt-8 text-sm text-center">
        <p>2020 © All Right Reserved By Alpha Real Estate</p>
      </div>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-amber-500 font-medium mb-4">CONTACT</h3>
          <div className="space-y-2">
            <h4 className="font-medium">Our office</h4>
            <p>
              OFFICE # 208, Pinnacle<br />
              Tower Main Sheikh Zayad<br />
              Road, AL-Barsha-1,DUBAI - U.A.E
            </p>
            <p>+97143990090</p>
            <p>info@alpharealestate.ae</p>
          </div>
          
          <div className="mt-8">
            <h3 className="text-amber-500 font-medium mb-4">SOCIAL</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-amber-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-amber-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="hover:text-amber-500">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Latest Property Section */}
        <div>
          <h3 className="text-amber-500 font-medium mb-4">LATEST PROPERTY</h3>
          <div className="space-y-4">
            {latestProperties.map((property, index) => (
              <div key={index} className="border-b border-gray-700 pb-4 last:border-0">
                <p className="hover:text-amber-500 cursor-pointer">{property.title}</p>
                <p className="text-sm text-gray-500">{property.date}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 border border-gray-600 px-4 py-2 hover:bg-gray-800 transition-colors">
            MORE PROPERTY
          </button>
        </div>
      </div>

      {/* Copyright Section */}
      
    </footer>
  );
};

export default Footer;