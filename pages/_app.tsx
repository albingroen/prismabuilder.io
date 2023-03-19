import "../styles/globals.css";
import "react-cmdk/dist/cmdk.css";
import PricingModal from "../components/PricingModal";
import Seo from "../components/Seo";
import Stack from "../components/Stack";
import WelcomeModal from "../components/WelcomeModal";
import axios from "axios";
import splitbee from "@splitbee/web";
import type { AppProps } from "next/app";
import { SchemaContext } from "../lib/context";
import { Toaster } from "react-hot-toast";
import { classNames } from "react-cmdk";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { inter } from "../lib/font";

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

      <style jsx global>
        {`
          :root {
            --font-inter: ${inter.style.fontFamily};
          }
        `}
      </style>

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
        <main className={classNames(inter.variable, "font-sans")}>
          {!hasSeenWelcomeModal && (
            <WelcomeModal onClose={onCloseWelcomeModal} />
          )}

          {!hasSeenPricingModal && (
            <PricingModal onClose={onClosePricingModal} />
          )}

          <div className="h-screen flex">
            <Component {...pageProps} />
            <Toaster
              toastOptions={{
                className: "dark:!bg-neutral-900 dark:!text-white",
              }}
            />
          </div>

          <footer className="bg-gray-100 dark:bg-neutral-800 p-10 border-t dark:border-neutral-700">
            <Stack align="center" justify="center">
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Maintained by{" "}
                <a
                  target="_blank"
                  href="https://abgn.me"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-blue-500 hover:underline"
                >
                  Albin Groen
                </a>
              </p>
            </Stack>
          </footer>
        </main>
      </SchemaContext.Provider>
    </>
  );
}

export default MyApp;
