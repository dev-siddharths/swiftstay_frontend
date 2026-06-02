"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import RoomsHeader from "@/components/rooms/RoomsHeader";
import useAuth from "@/hooks/useAuth";
import { buildApiUrl } from "@/lib/api";
import type { RoomDetailsInput } from "./roomDetails.types";
import RoomDetailsScreen from "./RoomDetailsScreen";
import RoomDetailsSkeleton from "./RoomDetailsSkeleton";

type RoomDetailsResponse = {
  success?: boolean;
  status?: boolean;
  data?: {
    image_url?: Array<
      string | { image_url?: string | null } | null | undefined
    >;
    room_name?: string;
    room_price?: number;
    room_description?: string;
    location?: string;
    room_location?: string;
    Room_Location?: string;
    amenities?: Array<
      | string
      | { name?: string | null; Icon_Url?: string | null }
      | null
      | undefined
    >;
  };
  message?: string;
};

function getRoomLocation(payload?: RoomDetailsResponse["data"]) {
  const locationCandidates = [
    payload?.location,
    payload?.room_location,
    payload?.Room_Location,
  ];

  return (
    locationCandidates.find(
      (value): value is string => typeof value === "string" && value.trim().length > 0,
    )?.trim() ?? ""
  );
}

function mapRoomPayload(
  roomId: string,
  payload?: RoomDetailsResponse["data"],
): RoomDetailsInput | null {
  if (!payload?.room_name) {
    return null;
  }

  const images =
    payload.image_url
      ?.map((image) => {
        if (typeof image === "string") {
          return image.trim();
        }

        return image?.image_url?.trim() ?? "";
      })
      .filter((image) => image.length > 0) ?? [];

  const amenities =
    payload.amenities
      ?.map((amenity) => {
        if (typeof amenity === "string") {
          const label = amenity.trim();

          return label.length > 0 ? { label } : null;
        }

        const label = amenity?.name?.trim() ?? "";
        const iconUrl = amenity?.Icon_Url?.trim() ?? "";

        return label.length > 0
          ? {
              label,
              iconUrl: iconUrl.length > 0 ? iconUrl : undefined,
            }
          : null;
      })
      .filter((amenity): amenity is NonNullable<typeof amenity> => !!amenity) ??
    [];

  const parsedId = Number(roomId);

  return {
    id: Number.isFinite(parsedId) ? parsedId : 0,
    title: payload.room_name,
    price: payload.room_price ?? 0,
    image_url: images[0] ?? "",
    image_urls: images,
    description: payload.room_description ?? "",
    amenities,
    location: getRoomLocation(payload),
  };
}

type RoomDetailsPageClientProps = {
  roomId: string;
};

export default function RoomDetailsPageClient({
  roomId,
}: RoomDetailsPageClientProps) {
  const { userData, logout, isCheckingAuth } = useAuth();
  const [room, setRoom] = useState<RoomDetailsInput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isCheckingAuth || !userData) {
      return;
    }

    let ignore = false;

    async function fetchRoomDetails() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          logout();
          return;
        }

        const response = await axios.get<RoomDetailsResponse>(
          buildApiUrl(`/rooms/${roomId}`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (ignore) {
          return;
        }

        if (response.data?.success === false || response.data?.status === false) {
          setRoom(null);
          setErrorMessage("Room not found");
          return;
        }

        const mappedRoom = mapRoomPayload(roomId, response.data?.data);

        if (!mappedRoom) {
          setRoom(null);
          setErrorMessage("Room not found");
          return;
        }

        setRoom(mappedRoom);
      } catch (error) {
        if (ignore) {
          return;
        }

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setRoom(null);
          setErrorMessage("Room not found");
          return;
        }

        setRoom(null);
        setErrorMessage("Failed to load room details");
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchRoomDetails();

    return () => {
      ignore = true;
    };
  }, [isCheckingAuth, logout, roomId, userData]);

  if (isCheckingAuth || isLoading) {
    return <RoomDetailsSkeleton />;
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <RoomsHeader userData={userData} logout={logout} />
      {errorMessage ? (
        <main className="pt-24 pb-20 max-w-screen-2xl mx-auto px-8">
          {errorMessage}
        </main>
      ) : null}
      {!errorMessage && room ? (
        <RoomDetailsScreen room={room} />
      ) : null}
    </div>
  );
}
