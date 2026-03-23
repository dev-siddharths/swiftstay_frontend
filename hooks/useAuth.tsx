"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const useAuth = () => {
  type AuthMeResponse = {
    email: string;
    naam: string;
    iat: number;
    exp: number;
  };
  const [userData, setUserData] = useState<AuthMeResponse | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const router = useRouter();

  const logout = useCallback((): void => {
    localStorage.removeItem("token");
    setUserData(null);
    setIsCheckingAuth(false);
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    let mounted = true;

    async function check(): Promise<void> {
      if (mounted) {
        setIsCheckingAuth(true);
      }

      const tokenfromLocal = localStorage.getItem("token");
      if (!tokenfromLocal) {
        logout();
      } else {
        try {
          const res = await axios.get<AuthMeResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${tokenfromLocal}`,
              },
            },
          );
          console.log(res.data);
          if (mounted) {
            setUserData(res.data);
          }
        } catch (error) {
          if (error) {
            logout();
          }
        } finally {
          if (mounted) {
            setIsCheckingAuth(false);
          }
        }
      }
    }
    check();

    return () => {
      mounted = false;
    };
  }, [logout]);

  return { userData, logout, isCheckingAuth };
};

export default useAuth;
