import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    regularPrice: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    features: {
      type: Array,
      required: true,
    },
    communityFeatures: {
      type: Array,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    floorPlan: {
      type: Array,
      required: false,
    },

    bathrooms: {
      type: Number,
      required: true,
    },

    bedrooms: {
      type: Number,
      required: true,
    },

    furnished: {
      type: Boolean,
      required: true,
    },

    parking: {
      type: Boolean,
      required: true,
    },

    area: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    offer: {
      type: Boolean,
      required: true,
    },
    favproperties: {
      type: Boolean,
      required: false,
    },
    contactemail: {
      type: String,
      required: false,
    },
    contactnumber: {
      type: String,
      required: false,
    },
    futurebuy: {
      type: Boolean,
      required: false,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    mapUrl: {
      type: String,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
