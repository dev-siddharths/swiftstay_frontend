"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Welcome = () => {
  type AuthMeResponse = {
    email: string;
    naam: string;
    iat: number;
    exp: number;
  };

  const [token, setToken] = useState<string | null>("");
  const [name, setName] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    async function check(): Promise<void> {
      const tokenfromLocal = localStorage.getItem("token");
      setToken(tokenfromLocal);
      if (!tokenfromLocal) {
        router.replace("/login");
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
          console.log(res);
          setName(res.data.naam);
        } catch (error) {
          if (error) {
            router.replace("/login");
          }
        }
      }
    }
    check();
  }, [token]);
  return (
    <>
      <h1>Welcome {name}</h1>
    </>
  );
};

export default Welcome;
