import "../styles/globals.css";
import Seo from "../components/Seo";
import WelcomeModal from "../components/WelcomeModal";
import splitbee from "@splitbee/web";
import type { AppProps } from "next/app";
import { LensProvider } from "@prisma/lens";
import { SchemaContext } from "../lib/context";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

splitbee.init();

function MyApp({ Component, pageProps }: AppProps) {
  const [schema, setSchema] = useState({
    models: [],
    enums: [],
  });

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

  return (
    <>
      <Seo />

      <WelcomeModal open={!hasSeenWelcomeModal} onClose={onCloseWelcomeModal} />

      <LensProvider>
        <SchemaContext.Provider value={{ schema, setSchema }}>
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
