import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    // User who donated the food
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic food information
    foodName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    category: {
      type: String,
      enum: [
        "Cooked Food",
        "Bakery",
        "Fruits",
        "Vegetables",
        "Packaged Food",
        "Other",
      ],
      required: true,
    },

    // Quantity
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      enum: ["kg", "liters", "packets", "boxes", "items"],
      required: true,
    },

    // Approximate number of people this donation can serve
    servings: {
      type: Number,
      required: true,
      min: 1,
    },

    dietaryType: {
      type: String,
      enum: [
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan",
        "Mixed",
      ],
      required: true,
    },

    // Food timing
    preparedAt: {
      type: Date,
      required: true,
    },

    pickupDeadline: {
      type: Date,
      required: true,
    },

    // Pickup location for now
    addressLabel: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: { type: String, default: "" },

    location: {
      type: { type: String, enum: ["Point"], default: undefined },
      coordinates: { type: [Number], default: undefined },
    },

    // Donation status
    status: {
      type: String,
      enum: [
        "Available",
        "Claimed",
        "Pickup Assigned",
        "Picked Up",
        "Delivered",
        "Completed",
        "Cancelled",
        "Expired",
      ],
      default: "Available",
    },

    // Receiver who claims the donation
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    claimedAt: {
      type: Date,
      default: null,
    },

    // Volunteer assigned for pickup
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Useful for finding a provider's donations quickly
donationSchema.index({ providerId: 1, createdAt: -1 });

// Useful for finding available donations
donationSchema.index({ status: 1, pickupDeadline: 1 });
donationSchema.index({ location: "2dsphere" });

const Donation =
  mongoose.models.Donation ||
  mongoose.model("Donation", donationSchema);

export default Donation;
