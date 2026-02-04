"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp } from "../../utils/animations";
import NotificationPopup from "../popups/NotificationPopup";
import { AnimatedWrapper } from "../shared/AnimatedWrapper";

const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function NewsletterSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // "success" or "error"
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
  });

  const validateField = (name, value) => {
    if (!touched[name]) return "";

    if (name === "name") {
      if (!value.trim()) return "Name is required";
    } else if (name === "email") {
      if (!value.trim()) return "Email is required";
      if (!STRICT_EMAIL_REGEX.test(value.trim())) return "Please provide a valid email address";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      if (!STRICT_EMAIL_REGEX.test(formData.email.trim())) {
        newErrors.email = "Please provide a valid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched when submitting
    setTouched({
      name: true,
      email: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({ name: "", email: "" });

    try {
      const response = await fetch("/api/secret-drops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message || null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPopupMessage(result.message);
        setPopupType("success");
        setShowPopup(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setPopupMessage(result.error || "Failed to submit. Please try again.");
        setPopupType("error");
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage("Network error. Please try again.");
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear popup when user starts typing
    if (showPopup) {
      setShowPopup(false);
    }

    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  return (
    <AnimatedWrapper variant={fadeUp} className="">
      <div className="mx-auto ">
        <div className="mx-auto">
          <div className="relative bg-black/50 rounded-2xl border border-[#C2FF02]/20 px-6 py-6 sm:px-8 md:px-12 md:pt-24 md:pb-30 overflow-hidden cyber-glow-pulse cyber-holographic cyber-data-stream">
            {/* Glow Effect */}
            <div className="absolute inset-0 blur-3xl" />

            {/* Content */}
            <div className="relative z-10 space-y-6 sm:space-y-8">
              <div className="space-y-2 sm:space-y-3 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-subheading font-bold text-primary uppercase tracking-widest cyber-text-glitch">
                  STAY VIGILANT
                </h2>
                <p className="text-primary text-sm font-subheading sm:text-base md:text-lg px-2 uppercase tracking-widest">
                  Get exclusive updates, behind-the-scenes content, and secret drops
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mx-auto w-full">
                <div className="flex-1">
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="John Doe"
                    whileFocus={{ scale: 1.02, borderColor: errors.name && touched.name ? "#ef4444" : "#C2FF02" }}
                    className={`w-full px-3 sm:px-4 py-6 sm:py-0 bg-black/20 border text-white placeholder:text-gray-500 focus:ring-2 rounded-lg h-auto sm:h-11 md:h-18 text-sm md:text-xl outline-none ${
                      errors.name && touched.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                        : "border-[#C2FF02]/20 focus:border-[#C2FF02] focus:ring-primary"
                    }`}
                  />
                  {errors.name && touched.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                </div>
                <div className="flex-1">
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="john.doe@example.com"
                    whileFocus={{ scale: 1.02, borderColor: errors.email && touched.email ? "#ef4444" : "#C2FF02" }}
                    className={`w-full px-3 sm:px-4 py-6 sm:py-0 bg-black/20 border text-white placeholder:text-gray-500 focus:ring-2 rounded-lg h-auto sm:h-11 md:h-18 text-sm md:text-xl outline-none ${
                      errors.email && touched.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                        : "border-[#C2FF02]/20 focus:border-[#C2FF02] focus:ring-primary"
                    }`}
                  />
                  {errors.email && touched.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                </div>
                {/* <motion.input
                  type="text"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Optional message"
                  whileFocus={{ scale: 1.02, borderColor: "#C2FF02" }}
                  className="flex-1 w-full px-3 sm:px-4 py-6 sm:py-0 bg-black/20 border border-[#C2FF02]/20 text-white placeholder:text-gray-500 focus:border-[#C2FF02] focus:ring-2 focus:ring-primary rounded-lg h-auto sm:h-11 md:h-18 text-sm md:text-xl outline-none"
                /> */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(194, 255, 2, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#C2FF02] font-subheading uppercase h-11 sm:h-12 md:h-18 tracking-widest hover:bg-[#a8db02] text-black font-semibold px-6 sm:px-8 rounded-lg whitespace-nowrap text-sm md:text-xl w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Secret Drops!"}
                </motion.button>
              </form>

              {/* Submit Popup */}
              <NotificationPopup
                isOpen={showPopup}
                message={popupMessage}
                title={popupType === "success" ? "Success" : "Error"}
                onClose={() => setShowPopup(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
}
