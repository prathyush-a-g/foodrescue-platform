"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDonationPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    foodName: "",
    description: "",
    category: "Cooked Food",
    quantity: "",
    unit: "kg",
    servings: "",
    dietaryType: "Vegetarian",
    preparedAt: "",
    pickupDeadline: "",
    addressLabel: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

async function handleSubmit(event) {
  event.preventDefault();

  setMessage("");
  setLoading(true);

  try {
    const response = await fetch("/api/donations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Failed to post donation.");
      return;
    }

    setMessage("Food donation posted successfully! 🎉");

    // Clear the form
    setFormData({
      foodName: "",
      description: "",
      category: "Cooked Food",
      quantity: "",
      unit: "kg",
      servings: "",
      dietaryType: "Vegetarian",
      preparedAt: "",
      pickupDeadline: "",
      addressLabel: "",
    });
  } catch (error) {
    console.error("Donation submission error:", error);
    setMessage("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="text-sm font-semibold text-green-600">
              Provider
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Donate Food
            </h1>

            <p className="mt-2 text-slate-600">
              Tell us about the surplus food you want to donate.
            </p>
          </div>

          <div className="surface-card p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Food Name */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Food Name
                </label>

                <input
                  type="text"
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleChange}
                  placeholder="Example: Vegetable Rice"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black outline-none focus:border-green-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the food..."
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black outline-none focus:border-green-600"
                />
              </div>

              {/* Category + Dietary Type */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black"
                  >
                    <option>Cooked Food</option>
                    <option>Bakery</option>
                    <option>Fruits</option>
                    <option>Vegetables</option>
                    <option>Packaged Food</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Dietary Type
                  </label>

                  <select
                    name="dietaryType"
                    value={formData.dietaryType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black"
                  >
                    <option>Vegetarian</option>
                    <option>Non-Vegetarian</option>
                    <option>Vegan</option>
                    <option>Mixed</option>
                  </select>
                </div>
              </div>

              {/* Quantity + Unit */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Example: 10"
                    min="1"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Unit
                  </label>

                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black"
                  >
                    <option value="kg">Kilograms</option>
                    <option value="liters">Liters</option>
                    <option value="packets">Packets</option>
                    <option value="boxes">Boxes</option>
                    <option value="items">Items</option>
                  </select>
                </div>
              </div>

              {/* Servings */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Number of Servings
                </label>

                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  placeholder="Example: 25"
                  min="1"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black"
                />
              </div>

              {/* Prepared At + Pickup Deadline */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Prepared At
                  </label>

                  <input
                    type="datetime-local"
                    name="preparedAt"
                    value={formData.preparedAt}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Pickup Deadline
                  </label>

                  <input
                    type="datetime-local"
                    name="pickupDeadline"
                    value={formData.pickupDeadline}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Pickup Address
                </label>

                <textarea
                  name="addressLabel"
                  value={formData.addressLabel}
                  onChange={handleChange}
                  placeholder="Enter the address where the food can be collected"
                  rows={3}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black"
                />
              </div>

              {/* Message */}
              {message && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Post Food Donation"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
