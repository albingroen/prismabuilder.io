/* eslint-disable @next/next/no-img-element */
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Modal from "./Modal";
import Stack from "./Stack";

type NewsModalProps = {
  onClose: () => void;
};

const NewsModal = ({ onClose }: NewsModalProps) => {
  return (
    <Modal
      className="bg-gradient-to-b from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-900 shadow-2xl shadow-emerald-300 dark:shadow-emerald-950"
      onClose={() => {
        onClose();
      }}
    >
      {({ close }) => (
        <Stack direction="vertical" className="p-4" spacing="huge">
          <Stack align="start" justify="between">
            <h1 className="text-3xl font-medium tracking-tight leading-normal text-balance">
              I&apos;m going full-time on Prisma Schema Builder!
            </h1>

            <button type="button" onClick={() => {}}></button>

            <button onClick={close}>
              <XMarkIcon className="w-6 text-gray-500 hover:text-inherit" />
            </button>
          </Stack>

          <Stack align="center" spacing="small">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://abgn.me"
              className="group"
            >
              <Stack align="center" className="group" spacing="small">
                <img
                  src="https://res.cloudinary.com/albin-groen/image/upload/v1720949279/profilne-new-min-square_hnxx8n.jpg"
                  className="w-6 rounded-full"
                  alt=""
                />
                <p className="group-hover:underline decoration-1 underline-offset-2 font-medium">
                  Albin Groen
                </p>
              </Stack>
            </a>

            <p className="text-sm font-medium text-neutral-400">·</p>

            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              July 27, 2024
            </p>
          </Stack>

          <p className="leading-relaxed text-balance text-neutral-500 pl-4 border-l-4 border-l-gray-300 dark:border-l-neutral-700">
            I will be streaming my work on{" "}
            <a
              className="hover:underline text-blue-600 dark:text-blue-400 font-medium decoration-1 underline-offset-2"
              href="https://twitch.tv/groenalbin"
              rel="noopener noreferrer"
              target="_blank"
            >
              Twitch
            </a>
            , and post updates on{" "}
            <a
              href="https://mastodon.social/@abgn"
              className="hover:underline text-blue-600 dark:text-blue-400 font-medium decoration-1 underline-offset-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              Mastodon
            </a>
            . There&apos;s also a{" "}
            <a
              className="hover:underline text-blue-600 dark:text-blue-400 font-medium decoration-1 underline-offset-2"
              href="https://patreon.com/abgn"
              rel="noopener noreferrer"
              target="_blank"
            >
              Patreon
            </a>{" "}
            page. If you&apos;re not able to support monetarily (which is
            understandable), I would really appreaciate bug reports on{" "}
            <a
              className="hover:underline text-blue-600 dark:text-blue-400 font-medium decoration-1 underline-offset-2"
              href="https://github.com/albingroen/prismabuilder.io"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            .
          </p>

          <Stack direction="vertical" spacing="large">
            <p className="leading-relaxed text-balance">
              During the last couple of years, I&apos;ve asked all of you here
              whether or not you would be interested in an improved version of
              the app, and I&apos;ve gotten such amazing feedback!
            </p>

            <p className="leading-relaxed text-balance">
              I recently quit my full-time job to work on personal projects -
              and Prisma Schema Builder came to mind very quickly. Initially, I
              built this for myself. I found it hard to write schemas in code,
              and to get an overview of all the relationships in the app.
            </p>

            <p className="leading-relaxed text-balance">
              Now, my goal is to build a <i>way</i> better version of Prisma
              Schema Builder. And to do so in under 5 months, since that&apos;s
              the amount of money I&apos;ve got saved up.
            </p>

            <h2 className="text-2xl font-medium tracking-tight mt-4">
              What will it include?
            </h2>

            <Stack direction="vertical" spacing="small">
              <h3 className="text-xl font-medium tracaking-tight">Phase 1</h3>

              <ul className="flex flex-col gap-1 list-inside">
                <li className="leading-relaxed text-balance font-medium">
                  💅 &nbsp;Overhauled user interface
                </li>

                <li className="leading-relaxed text-balance font-medium">
                  🖥️ &nbsp;Desktop app for local schemas
                </li>

                <li className="leading-relaxed text-balance font-medium">
                  🍃 &nbsp;MongoDB support
                </li>

                <li className="leading-relaxed text-balance font-medium">
                  ↪️ &nbsp;Entity relationship diagrams
                </li>

                <li className="leading-relaxed text-balance font-medium">
                  👥 &nbsp;Team collaboration
                </li>
              </ul>
            </Stack>

            <Stack direction="vertical" spacing="small">
              <h3 className="text-xl font-medium tracaking-tight">Phase 2</h3>

              <ul className="flex flex-col gap-1 list-inside list-disc">
                <li className="leading-relaxed text-balance font-medium">
                  ✨ &nbsp;LLM for scaffolding schemas
                </li>

                <li className="leading-relaxed text-balance font-medium">
                  ✳️ &nbsp;Schema agnostic (not only Prisma!)
                </li>
              </ul>
            </Stack>

            <Stack direction="vertical">
              <h2 className="text-2xl font-medium tracking-tight mt-4">
                Status?
              </h2>

              <p className="leading-relaxed text-balance">
                I&apos;ve started working a little bit on the new interface, and
                I wanted to give you a sneak peek.
              </p>
            </Stack>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/new-light.png"
              className="dark:hidden -mx-6"
            >
              <Image
                alt="New Prisma Schema Builder interface"
                src="/new-light.png"
                height={1781}
                width={2751}
              />
            </a>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/new-dark.png"
              className="hidden dark:block -mx-5"
            >
              <Image
                alt="New Prisma Schema Builder interface"
                src="/new-dark.png"
                height={1781}
                width={2751}
              />
            </a>
          </Stack>
        </Stack>
      )}
    </Modal>
  );
};

export default NewsModal;
