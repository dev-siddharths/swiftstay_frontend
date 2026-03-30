import RoomDetailsPageClient from "@/components/room-details/RoomDetailsPageClient";

type RoomDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoomDetailsPage({
  params,
}: RoomDetailsPageProps) {
  const { id } = await params;

  return <RoomDetailsPageClient roomId={id} />;
}
