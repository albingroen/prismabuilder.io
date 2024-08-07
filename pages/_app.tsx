import "../styles/globals.css";
import "react-cmdk/dist/cmdk.css";
import "reactflow/dist/style.css";
import NewsModal from "../components/NewsModal";
import Seo from "../components/Seo";
import Stack from "../components/Stack";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { SchemaContext } from "../lib/context";
import { Toaster } from "react-hot-toast";
import { classNames } from "react-cmdk";
import { inter } from "../lib/font";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [streamDateInLocalTZ, setStreamDateInLocalTZ] = useState<Date>();

  const [schemas, setSchemas] = useState<any[]>([]);

  useEffect(() => {
    if (window) {
      const lcValue = localStorage.getItem("schemas");
      if (lcValue) {
        setSchemas(JSON.parse(lcValue));
      }

      const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const streamDateInUTC = fromZonedTime(
        new Date("2024-08-07 11:00 PM"),
        "America/Los_Angeles",
      );

      setStreamDateInLocalTZ(toZonedTime(streamDateInUTC, localTZ));
    }
  }, []);

  useEffect(() => {
    if (window) {
      localStorage.setItem("schemas", JSON.stringify(schemas ?? []));
    }
  }, [schemas]);

  const [hasSeenNewsModal, setHasSeenNewsModal] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage) {
      setHasSeenNewsModal(localStorage.getItem("hasSeenNewsModal") === "true");
    }
  }, []);

  const onCloseNewsModal = () => {
    localStorage.setItem("hasSeenNewsModal", "true");
    setHasSeenNewsModal(true);
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
                  : s,
              ),
            );
          },
        }}
      >
        <main className={classNames(inter.variable, "font-sans")}>
          {!hasSeenNewsModal && <NewsModal onClose={onCloseNewsModal} />}

          {/*<Stack spacing="none" direction="vertical" className="h-screen">
            <Stack
              spacing="mini"
              align="center"
              justify="center"
              className="bg-emerald-600 dark:bg-emerald-900 p-2"
            >
              <p className="text-sm font-medium text-white">
                I&apos;m going full-time on Prisma Schema Builder!
              </p>{" "}
              <button
                type="button"
                className="underline decoration-1 underline-offset-2 text-sm text-white opacity-65 hover:opacity-100 font-medium"
                onClick={() => {
                  setHasSeenNewsModal(false);
                }}
              >
                Read the announcement &nbsp;📰
              </button>
            </Stack>

            <div className="flex-1 flex">
              <Component {...pageProps} />
              <Toaster
                toastOptions={{
                  className: "dark:!bg-neutral-900 dark:!text-white",
                }}
              />
            </div>
          </Stack>*/}

          <Stack spacing="none" direction="vertical" className="h-screen">
            <Stack
              spacing="small"
              align="center"
              justify="center"
              className="bg-[#874BF6] p-2"
              // className="bg-orange-600 p-2"
            >
              <svg className="w-4" viewBox="0 0 2400 2800">
                <g>
                  <g id="Layer_1-2">
                    <path
                      className="fill-[#F0F0FF]"
                      d="M500,0L0,500v1800h600v500l500-500h400l900-900V0H500z M2200,1300l-400,400h-400l-350,350v-350H600V200h1600    V1300z"
                    />
                    <rect
                      x="1700"
                      y="550"
                      className="fill-[#F0F0FF]"
                      width="200"
                      height="600"
                    />
                    <rect
                      x="1150"
                      y="550"
                      className="fill-[#F0F0FF]"
                      width="200"
                      height="600"
                    />
                  </g>
                </g>
              </svg>
              <Stack align="center" spacing="mini">
                <p className="text-sm font-semibold text-white">
                  TypeScript | Rust | Designing the UI for Prisma Schema Builder
                  2
                </p>{" "}
                <a
                  href="https://twitch.tv/groenalbin"
                  className="underline decoration-1 underline-offset-2 text-sm text-white font-medium animate-pulse"
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={() => {
                    setHasSeenNewsModal(false);
                  }}
                >
                  Starts{" "}
                  {streamDateInLocalTZ
                    ? `at ${format(
                        streamDateInLocalTZ,
                        "MMM d hh:mm a, yyyy (O)",
                      )}`
                    : "soon"}
                </a>
                <ArrowUpRightIcon className="w-4 stroke-white" /> 🎬 &nbsp;
                <a
                  // href="https://www.youtube.com/watch?v=5KvO2cT3MnA"
                  href="https://www.youtube.com/@albingroen"
                  className="underline decoration-1 underline-offset-2 text-sm text-white font-medium animate-pulse"
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={() => {
                    setHasSeenNewsModal(false);
                  }}
                >
                  YouTube
                </a>
              </Stack>
            </Stack>

            <div className="flex-1 flex">
              <Component {...pageProps} />
              <Toaster
                toastOptions={{
                  className: "dark:!bg-neutral-900 dark:!text-white",
                }}
              />
            </div>
          </Stack>

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

      <Analytics />
    </>
  );
}

export default MyApp;
