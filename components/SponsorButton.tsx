import { HeartIcon } from "@heroicons/react/20/solid";
import classNames from "../lib/classNames";

export default function SponsorButton() {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/sponsors/albingroen"
      className={classNames(
        "text-center w-full select-none font-medium rounded-md py-2 px-4 text-sm relative disabled:opacity-50 flex items-center justify-center gap-2",
        "focus:outline-none focus-visible:ring-1",
        "bg-gray-900 hover:bg-gray-700 text-white focus-visible:ring-white focus-visible:bg-gray-700",
        "dark:bg-white dark:hover:bg-neutral-200 dark:text-black dark:focus-visible:ring-white dark:focus-visible:bg-neutral-200"
      )}
    >
      <span>Sponsor the developer</span>
      <HeartIcon className="w-4 text-red-500" />
    </a>
  );
}
