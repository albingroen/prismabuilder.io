import Stack from "./Stack";
import classNames from "../lib/classNames";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";
import { XIcon } from "@heroicons/react/outline";

const { Overlay, Title, Description } = Dialog;

export interface CustomModalProps {
  children?: ReactNode | (({ onClose }: { onClose?: () => void }) => ReactNode);
  overlayClassName?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  description?: string;
  heading?: string;
}

export interface ModalProps extends CustomModalProps {}

export function getModalOverlayStyles() {
  const modalOverlayStyles = {
    base: "bg-black bg-opacity-40 fixed inset-0",
  };

  return classNames(modalOverlayStyles.base);
}

export function getModalContentStyles() {
  const modalContentStyles = {
    base: "bg-white w-full max-w-lg rounded-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 divide-y focus:outline-none max-h-[90vh] flex flex-col",
  };

  return classNames(modalContentStyles.base);
}

export default function Modal({
  showCloseButton = true,
  overlayClassName,
  contentClassName,
  description,
  children,
  onClose,
  heading,
}: ModalProps) {
  const [open, setOpen] = useState<boolean>(true);

  function handleClose() {
    if (!onClose) return;

    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 200);
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={handleClose} open>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Overlay
            className={classNames(getModalOverlayStyles(), overlayClassName)}
          />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            className={classNames(getModalContentStyles(), contentClassName)}
          >
            {heading && (
              <Stack className="px-4 py-3.5" align="center" justify="between">
                {heading && (
                  <Title as={Fragment}>
                    <h3 className="text-xl">{heading}</h3>
                  </Title>
                )}

                {showCloseButton && (
                  <button onClick={handleClose}>
                    <XIcon className="w-5 text-gray-500 group-hover:text-inherit transition" />
                  </button>
                )}
              </Stack>
            )}

            <Stack
              className="p-5 flex-1 overflow-y-auto"
              direction="vertical"
              spacing="large"
              align="start"
            >
              {description && (
                <Description as={Fragment}>
                  <p className="text-stone-500">{description}</p>
                </Description>
              )}

              {children &&
                (typeof children === "function"
                  ? children({ onClose: handleClose })
                  : children)}
            </Stack>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
