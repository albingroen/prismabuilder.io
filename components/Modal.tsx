import Stack from "./Stack";
import classNames from "../lib/classNames";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";

type ModalProps = {
  children: ({ close }: { close: () => void }) => JSX.Element;
  isCloseButtonVisible?: boolean;
  contentClassName?: string;
  description?: string;
  onClose: () => void;
  className?: string;
  heading?: string;
};

const Modal = ({
  isCloseButtonVisible = true,
  contentClassName,
  description,
  className,
  children,
  onClose,
  heading,
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog
      className="fixed z-10 inset-0 overflow-y-auto antialiased font-[Inter]"
      as="div"
      onClose={handleClose}
      open={isOpen}
    >
      <div className="fixed inset-0 bg-gray-500/50" />

      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel
          className={classNames(
            "relative bg-white rounded-lg w-full shadow mx-auto max-w-screen-sm overflow-hidden",
            className
          )}
        >
          {(heading || description) && (
            <Stack align="start" className="p-5 border-b justify-between">
              <Stack direction="vertical" spacing="small">
                {heading && (
                  <Dialog.Title className="text-xl font-medium">
                    {heading}
                  </Dialog.Title>
                )}

                {description && (
                  <Dialog.Description className="text-gray-800 text-sm leading-relaxed">
                    {description}
                  </Dialog.Description>
                )}
              </Stack>

              {isCloseButtonVisible && (
                <button
                  type="button"
                  title="Close modal"
                  className="text-gray-400 hover:text-inherit transition rounded-md focus:outline-none"
                  onClick={handleClose}
                >
                  <XMarkIcon className="w-6" />
                </button>
              )}
            </Stack>
          )}

          {children && (
            <div className={classNames("p-5", contentClassName)}>
              {children({
                close: handleClose,
              })}
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
