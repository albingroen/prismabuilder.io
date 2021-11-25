import "../styles/globals.css";
import Seo from "../components/Seo";
import splitbee from "@splitbee/web";
import type { AppProps } from "next/app";
import { LensProvider } from "@prisma/lens";
import { SchemaContext } from "../lib/context";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

splitbee.init();

function MyApp({ Component, pageProps }: AppProps) {
  const [schema, setSchema] = useState({
    models: [],
    enums: [],
  });

  return (
    <>
      <Seo />

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
