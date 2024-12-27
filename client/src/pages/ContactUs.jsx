import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwr5KGLVXIbMyoYfBYOjnXxFR1jw3FYN_x5mTD4emgfZoBgBiLSvwfip8e8W88QbMry/exec";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors", // Add this line
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result);
      setResponseMessage("Form submitted successfully!");
        setFormData({ name: "", email: "", message: "" });
     
    } catch (error) {
        setResponseMessage("Form submitted successfully!");
        setIsSubmitting(false);    } 
  };

  return (
    <>    

    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-slate-800 mb-4">
        CONTACT US
      </h1>
      
      <p className="text-center text-gray-600 mb-12">
        USE THE INFORMATION PROVIDED BELOW TO REACH US OR LEAVE US A MESSAGE USING CONTACT FORM.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Form Section */}
        <div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-2">
                YOUR NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"

            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">EMAIL</label>
                <input
                 
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                //   className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              
            </div>

            <div>
              <label className="block text-gray-700 mb-2">MESSAGE</label>
              
              <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded h-32"
          ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 text-white font-bold rounded-md ${
                isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
              {isSubmitting ? "Submitting..." : "Submit"}
              
            </button>
            
          </form>
          {responseMessage && (
        <p
          className={`mt-4 text-center ${
            responseMessage.startsWith("Error")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {responseMessage}
        </p>
      )}
        </div>

        {/* Contact Information Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-800">DUBAI</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-700 font-medium">Address:</h3>
              <p className="text-gray-600">
                OFFICE # 208, Pinnacle Tower Main Sheikh Zayad Road, AL-Barsha- 1,DUBAI - U.A.E
              </p>
            </div>

            <div>
              <h3 className="text-gray-700 font-medium">Telephone:</h3>
              <p className="text-gray-600">+97143990090</p>
            </div>

            <div>
              <h3 className="text-gray-700 font-medium">Email:</h3>
              <p className="text-[#C4A777]">info@alpharealestate.ae</p>
            </div>

            <div>
              <h3 className="text-gray-700 font-medium mb-2">Our social profiles:</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-[#C4A777] hover:text-[#B39666]">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-[#C4A777] hover:text-[#B39666]">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a href="#" className="text-[#C4A777] hover:text-[#B39666]">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    </>

    
  );
};

export default ContactUs;
