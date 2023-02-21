import Button from "./Button";
import Modal from "./Modal";
import cn from "../lib/classNames";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";

type PricingModalProps = {
  onClose: (price?: number) => void;
};

const PRICES = [5, 10, 15];

const PricingModal = ({ onClose }: PricingModalProps) => {
  const [price, setPrice] = useState<number>();

  return (
    <Modal
      onClose={() => {
        onClose(price);
      }}
    >
      {({ close }) => (
        <div className="flex flex-col gap-4 antialiased">
          <div className="flex flex-col items-center text-center pt-8 px-10 pb-5">
            <div className="flex flex-col items-center gap-3.5">
              <h1 className="text-3xl font-medium">
                Prismabuilder<span className="text-yellow-500">++</span>
              </h1>

              <i>
                An extended version of Prisma Schema Builder is in the works
              </i>
            </div>

            <hr className="mt-8 max-w-sm border-gray-300 dark:border-neutral-800 w-full" />

            <ul className="flex flex-col gap-3.5 text-xl text-left mt-9">
              <li>💾 &nbsp;Save your schemas in the cloud</li>
              <li>🖥️ &nbsp;Access to a desktop version of the app</li>
              <li>📣 &nbsp;Priority on GitHub issues and features</li>
            </ul>

            <hr className="mt-8 max-w-sm border-gray-300 dark:border-neutral-800 w-full" />

            <p
              className="mt-9 text-xl leading-tight font-medium"
              style={{ lineHeight: 1.6 }}
            >
              How much would you be willing to pay for Prismabuilder++ on a
              monthly basis?
            </p>

            <div className="flex gap-3.5 mt-8">
              {PRICES.map((PRICE) => (
                <button
                  key={PRICE}
                  type="button"
                  className={cn(
                    "rounded-lg border p-5 flex flex-col items-center transition",
                    PRICE === price
                      ? "border-indigo-500 dark:border-blue-600 bg-indigo-500 dark:bg-blue-600 text-white"
                      : "border-gray-300 dark:border-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-800 hover:border-gray-400 dark:hover:border-neutral-700"
                  )}
                  onClick={() => {
                    setPrice(PRICE === price ? undefined : PRICE);
                  }}
                >
                  <p className="text-3xl font-medium tracking-wide">
                    ${PRICE} <span className="text-xs font-medium">/month</span>
                  </p>
                </button>
              ))}
            </div>

            <Button
              type="button"
              className="mt-10"
              variant={price ? "primary" : "secondary"}
              icon={price ? CheckIcon : undefined}
              onClick={() => {
                close();
              }}
            >
              {price ? "Done" : "Close"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PricingModal;
