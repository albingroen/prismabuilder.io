import "../styles/globals.css";
import "react-cmdk/dist/cmdk.css";
import PricingModal from "../components/PricingModal";
import Seo from "../components/Seo";
import WelcomeModal from "../components/WelcomeModal";
import axios from "axios";
import splitbee from "@splitbee/web";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";
import { SchemaContext } from "../lib/context";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

splitbee.init();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [schemas, setSchemas] = useState<any[]>([]);

  useEffect(() => {
    if (window) {
      const lcValue = localStorage.getItem("schemas");
      if (lcValue) {
        setSchemas(JSON.parse(lcValue));
      }
    }
  }, []);

  useEffect(() => {
    if (window && schemas.length) {
      localStorage.setItem("schemas", JSON.stringify(schemas));
    }
  }, [schemas]);

  const [hasSeenWelcomeModal, setHasSeenWelcomeModal] = useState<boolean>(true);
  const [hasSeenPricingModal, setHasSeenPricingModal] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage) {
      setHasSeenWelcomeModal(
        Boolean(localStorage.getItem("hasSeenWelcomeModal"))
      );

      setHasSeenPricingModal(
        Boolean(localStorage.getItem("hasSeenPricingModal"))
      );
    }
  }, []);

  const onCloseWelcomeModal = () => {
    localStorage.setItem("hasSeenWelcomeModal", "true");
    setHasSeenWelcomeModal(true);
  };

  const onClosePricingModal = (price?: number) => {
    localStorage.setItem("hasSeenPricingModal", "true");
    setHasSeenPricingModal(true);

    if (price) {
      try {
        axios.post("/api/log", {
          channel: "pricing-survey",
          event: `Chose $${price}`,
          icon: "💸",
        });
      } catch {}
    }
  };

  const schema = schemas?.find((s) => s.name === router.query.schemaId);
  const isOldModelRoute = router.pathname.startsWith("/models");
  const isRoot = router.pathname === "/";

  if (!isRoot && !isOldModelRoute && !schema) {
    return null;
  }

  return (
    <>
      <Seo />

      {!hasSeenWelcomeModal && <WelcomeModal onClose={onCloseWelcomeModal} />}

      {!hasSeenPricingModal && <PricingModal onClose={onClosePricingModal} />}

      <SchemaContext.Provider
        value={{
          schema,
          schemas,
          setSchemas,
          setSchema: (newValues) => {
            setSchemas(
              schemas.map((s) =>
                s.name === schema.name
                  ? {
                      ...schema,
                      ...newValues,
                    }
                  : s
              )
            );
          },
        }}
      >
        <main className={`${inter.variable} font-sans h-screen flex`}>
          <Component {...pageProps} />
          <Toaster />
        </main>
      </SchemaContext.Provider>
    </>
  );
}

export default MyApp;
