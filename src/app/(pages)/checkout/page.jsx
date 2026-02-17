"use client";

import { Wrapper } from "@/app/components/shared/Wrapper";
import { useCartStore } from "@/app/lib/store/useCartStore";
import { ChevronLeft, CreditCard, ShieldCheck, Truck, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { items, getTotalPrice, isCartOpen, setCartOpen } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  // Ensure cart drawer is closed when on checkout page
  useEffect(() => {
    if (isCartOpen) setCartOpen(false);
  }, [isCartOpen, setCartOpen]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push("/#shop");
    }
  }, [items, router, isProcessing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const payload = {
      items,
      customerData: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          line1: formData.address,
          city: formData.city,
          state: formData.state.toUpperCase(),
          postal_code: formData.zip,
          country: formData.country.toUpperCase(),
        },
      },
    };

    console.log("--- CLIENT-SIDE CHECKOUT DATA ---");
    console.log("Payload:", JSON.stringify(payload, null, 2));
    console.log("---------------------------------");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId) {
        // Fallback if we still use sessionId
        const { loadStripe } = await import("@stripe/stripe-js");
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        throw new Error(data.error || "Failed to initialize checkout");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout initialization failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background-dark">
      <Wrapper>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-widest text-xs font-bold">Back to Shop</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <User size={18} />
                  </div>
                  <h2 className="text-xl font-bold uppercase tracking-wider">Identity Verification</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="agent@sporefall.net"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 outline-none transition-colors font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 outline-none transition-colors font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 outline-none transition-colors font-mono text-sm"
                    />
                  </div>

                  <div className="pt-4 flex items-center gap-3 mb-6 border-t border-white/5 pt-8">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Truck size={18} />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-wider">Drop Location</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Street Address</label>
                      <input
                        required
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Sector 7, Neon District"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 outline-none transition-colors font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">City</label>
                        <input
                          required
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Neo City"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 outline-none transition-colors font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">
                          State/Prov (2-Letter)
                        </label>
                        <input
                          required
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="NY"
                          maxLength={2}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 outline-none transition-colors font-mono text-sm uppercase"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">ZIP/Postal</label>
                        <input
                          required
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          placeholder="10001"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 outline-none transition-colors font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">
                        Country Code (2-Letter)
                      </label>
                      <input
                        required
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="US"
                        maxLength={2}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 outline-none transition-colors font-mono text-sm uppercase"
                      />
                      <p className="text-[9px] text-white/20 mt-1 uppercase tracking-tighter">
                        Use 2-letter codes (e.g., US, CA, GB, BD)
                      </p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      disabled={isProcessing}
                      type="submit"
                      className="w-full bg-primary hover:bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 shadow-[0_0_30px_rgba(212,255,0,0.2)] hover:shadow-[0_0_40px_rgba(212,255,0,0.4)]"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black animate-spin rounded-full" />
                      ) : (
                        <>
                          <CreditCard size={20} />
                          <span className="uppercase tracking-widest">Authorize Payment</span>
                        </>
                      )}
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-white/20 uppercase tracking-widest">
                      <ShieldCheck size={14} />
                      <span>Encrypted Neural-Link Transmission</span>
                    </div>
                  </div>
                </form>
              </section>
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-28">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-6 pb-4 border-b border-white/10">
                  Allocation Summary
                </h3>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-black/40 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover grayscale"
                          />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-bold uppercase truncate">{item.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[10px] text-white/40">QTY: {item.quantity}</p>
                          <p className="text-xs font-mono text-primary">{item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs uppercase tracking-widest">
                    <span className="text-white/40">Subtotal</span>
                    <span className="text-white">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs uppercase tracking-widest">
                    <span className="text-white/40">Shipping</span>
                    <span className="text-white font-mono">Calculated at next step</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
                    <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-bold text-primary">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
