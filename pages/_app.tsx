import "../styles/globals.css";
import Seo from "../components/Seo";
import WelcomeModal from "../components/WelcomeModal";
import splitbee from "@splitbee/web";
import type { AppProps } from "next/app";
import { LensProvider } from "@prisma/lens";
import { SchemaContext } from "../lib/context";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import GraphModal from "../components/GraphModal";

splitbee.init();

function MyApp({ Component, pageProps }: AppProps) {
  const [schema, setSchema] = useState({
    models: [],
    enums: [],
  });

  useEffect(() => {
    if (window) {
      const lcValue = localStorage.getItem("schema");
      if (lcValue) {
        setSchema(JSON.parse(lcValue));
      }
    }
  }, []);

  useEffect(() => {
    if (window) {
      localStorage.setItem("schema", JSON.stringify(schema));
    }
  }, [schema]);

  const [hasSeenWelcomeModal, setHasSeenWelcomeModal] = useState<boolean>(true);
  const [hasSeenGraphModal, setHasSeenGraphModal] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage) {
      setHasSeenWelcomeModal(
        Boolean(localStorage.getItem("hasSeenWelcomeModal"))
      );

      setHasSeenGraphModal(Boolean(localStorage.getItem("hasSeenGraphModal")));
    }
  }, []);

  const onCloseWelcomeModal = () => {
    localStorage.setItem("hasSeenWelcomeModal", "true");
    setHasSeenWelcomeModal(true);
  };

  const onCloseGraphModal = () => {
    localStorage.setItem("hasSeenGraphModal", "true");
    setHasSeenGraphModal(true);
  };

  return (
    <>
      <Seo />

      <WelcomeModal open={!hasSeenWelcomeModal} onClose={onCloseWelcomeModal} />

      <GraphModal open={!hasSeenGraphModal} onClose={onCloseGraphModal} />

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
