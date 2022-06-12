import "../styles/globals.css";
import "react-cmdk/dist/cmdk.css";
import Seo from "../components/Seo";
import WelcomeModal from "../components/WelcomeModal";
import splitbee from "@splitbee/web";
import type { AppProps } from "next/app";
import { LensProvider } from "@prisma/lens";
import { SchemaContext } from "../lib/context";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";

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
    if (window) {
      localStorage.setItem("schemas", JSON.stringify(schemas));
    }
  }, [schemas]);

  const [hasSeenWelcomeModal, setHasSeenWelcomeModal] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage) {
      setHasSeenWelcomeModal(
        Boolean(localStorage.getItem("hasSeenWelcomeModal"))
      );
    }
  }, []);

  const onCloseWelcomeModal = () => {
    localStorage.setItem("hasSeenWelcomeModal", "true");
    setHasSeenWelcomeModal(true);
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

      <WelcomeModal open={!hasSeenWelcomeModal} onClose={onCloseWelcomeModal} />

      <LensProvider>
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
          <main className="antialiased">
            <Component {...pageProps} />
            <Toaster />
          </main>
        </SchemaContext.Provider>
      </LensProvider>
    </>
  );
}

export default MyApp;
