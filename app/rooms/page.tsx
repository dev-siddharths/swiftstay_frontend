"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import RoomsBottomNav from "@/components/rooms/RoomsBottomNav";
import RoomsGrid from "@/components/rooms/RoomsGrid";
import RoomsHeader from "@/components/rooms/RoomsHeader";
import type { Room } from "@/components/rooms/types";
import useAuth from "@/hooks/useAuth";

const ROOMS_PER_PAGE = 6;

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [requestedPage, setRequestedPage] = useState(1);
  const { userData, logout, isCheckingAuth } = useAuth();
  const firstName = userData?.naam?.trim().split(/\s+/)[0] ?? "Guest";

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

  const totalPages = Math.max(1, Math.ceil(rooms.length / ROOMS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * ROOMS_PER_PAGE;

    return rooms.slice(startIndex, startIndex + ROOMS_PER_PAGE);
  }, [currentPage, rooms]);

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
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-21 sm:px-6">
        <section className="mb-4 rounded-[20px] border border-outline-variant/15 bg-surface-container-lowest px-4 py-3 shadow-[0_12px_28px_rgba(27,28,28,0.04)]">
          <h1 className="font-headline text-[1.5rem] font-extrabold tracking-tight text-on-surface md:text-[1.65rem]">
            Welcome, {firstName}
          </h1>
          <p className="mt-1.5 text-[14px] leading-5 text-on-surface-variant">
            Explore the latest rooms and pick your next stay.
          </p>
        </section>
        <RoomsGrid
          rooms={paginatedRooms}
          currentPage={currentPage}
          onPageChange={setRequestedPage}
          totalPages={totalPages}
          totalRooms={rooms.length}
        />
      </main>
      <RoomsBottomNav />
    </div>
  );
}
