import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function AdminSchedule() {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  async function loadSlots() {
    const { data } = await supabase.from("admin_slots").select("*");
    setSlots(data || []);
  }

  useEffect(() => {
    loadSlots();
  }, []);

  async function addSlot() {
    await supabase.from("admin_slots").insert([{ date, time }]);
    loadSlots();
  }

  async function deleteSlot(id) {
    await supabase.from("admin_slots").delete().eq("id", id);
    loadSlots();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Admin Schedule</h1>

      <div className="mt-4">
        <input type="date" onChange={(e) => setDate(e.target.value)} />
        <input type="time" onChange={(e) => setTime(e.target.value)} />

        <button onClick={addSlot} className="ml-2 bg-black text-white px-3 py-1">
          Add Slot
        </button>
      </div>

      <div className="mt-6">
        {slots.map((s) => (
          <div key={s.id} className="flex gap-4 p-2 border">
            <span>{s.date}</span>
            <span>{s.time}</span>

            <button onClick={() => deleteSlot(s.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
