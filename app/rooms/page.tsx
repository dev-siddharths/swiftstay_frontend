"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import RoomsBottomNav from "@/components/rooms/RoomsBottomNav";
import RoomsGrid from "@/components/rooms/RoomsGrid";
import RoomsHeader from "@/components/rooms/RoomsHeader";
import type { Room } from "@/components/rooms/types";
import useAuth from "@/hooks/useAuth";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { userData, logout, isCheckingAuth } = useAuth();

  useEffect(() => {
    if (isCheckingAuth || !userData) {
      return;
    }

    async function fetchRooms() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/room/getRooms`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        // console.log(res.data.data);

        setRooms(res.data.data); // assuming { success, data }
      } catch (err) {
        console.error(err);
      }
    }

    fetchRooms();
  }, [isCheckingAuth, userData]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        Checking authentication...
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <RoomsHeader userData={userData} logout={logout} />
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <RoomsGrid rooms={rooms} />
      </main>
      <RoomsBottomNav />
    </div>
  );
}
