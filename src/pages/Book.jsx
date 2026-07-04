import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { isLoggedIn, hasPackage, getUser } from "../lib/auth";

export default function Book() {
  const [, setLocation] = useLocation();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!isLoggedIn()) setLocation("/login");
    if (!hasPackage()) setLocation("/onboarding");

    loadSlots();
  }, []);

  async function loadSlots() {
    const { data } = await supabase
      .from("admin_slots")
      .select("*")
      .eq("available", true);

    setSlots(data || []);
  }

  async function bookSlot(slot) {
    const user = getUser();

    await supabase.from("bookings").insert([
      {
        user_email: user.email,
        slot_id: slot.id,
      },
    ]);

    await supabase
      .from("admin_slots")
      .update({ available: false })
      .eq("id", slot.id);

    alert("Booked successfully!");
    loadSlots();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Available Slots</h1>

      <div className="mt-4 space-y-2">
        {slots.map((s) => (
          <div key={s.id} className="border p-3 flex justify-between">
            <span>{s.date} - {s.time}</span>

            <button
              onClick={() => bookSlot(s)}
              className="bg-black text-white px-3 py-1"
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
