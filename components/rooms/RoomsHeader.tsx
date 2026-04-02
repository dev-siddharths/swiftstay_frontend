import Link from "next/link";

type AuthMeResponse = {
  email: string;
  naam: string;
  iat: number;
  exp: number;
};
type Props = {
  userData: AuthMeResponse | null;
  logout: () => void;
};
export default function RoomsHeader({ userData, logout }: Props) {
  const name: string | undefined = userData?.naam;
  const namearr: string[] | undefined = name?.split(" ");
  const fn: string | undefined = namearr?.[0];
  const ln: string | undefined = namearr?.[1];
  const fnArr: string[] | undefined = fn?.split("");
  const firstNameIni: string | undefined = fnArr?.[0];
  const lnArr: string[] | undefined = ln?.split("");
  const lastNameIni: string | undefined = lnArr?.[0];
  const initials: string = (firstNameIni ?? "") + (lastNameIni ?? "");

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-6 py-3 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link
            href="/rooms"
            className="text-primary font-headline font-extrabold tracking-tighter text-2xl"
          >
            SwiftStay
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link className="text-primary font-semibold text-sm" href="/rooms">
            Home
          </Link>
          <Link
            className="text-on-surface font-semibold text-sm hover:opacity-80 transition-opacity"
            href="/bookings"
          >
            Bookings
          </Link>
          <Link
            className="text-on-surface font-semibold text-sm hover:opacity-80 transition-opacity"
            href="/rooms"
          >
            Favorites
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {/* <button
            type="button"
            className="material-symbols-outlined text-on-surface-variant hover:opacity-80 transition-opacity"
            aria-label="Search"
          >
            search
          </button> */}
          <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden border-2 border-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              {initials ?? ""}
            </span>
          </div>
          <button
            className="bg-red-300 p-3 rounded-3xl cursor-pointer"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
