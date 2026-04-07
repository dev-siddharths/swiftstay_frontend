import SignupCard from "@/components/SignupCard";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(169,50,0,0.12),_transparent_32%),linear-gradient(180deg,_#fcfaf8_0%,_#f7f2ef_48%,_#f0e5de_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative z-10 w-full max-w-md">
        <SignupCard />
      </div>
    </main>
  );
}
