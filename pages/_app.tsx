import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LensProvider } from "@prisma/lens";
import { useState } from "react";
import { SchemaContext } from "../lib/context";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  const [schema, setSchema] = useState({
    models: [],
    enums: [],
  });

  return (
    <LensProvider>
      <SchemaContext.Provider value={{ schema, setSchema }}>
        <main className="antialiased">
          <Component {...pageProps} />
          <Toaster />
        </main>
      </SchemaContext.Provider>
    </LensProvider>
  );
}

export default MyApp;
