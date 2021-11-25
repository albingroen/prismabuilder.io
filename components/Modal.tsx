import { Dialog } from "@headlessui/react";
import { ReactNode } from "react";

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
  heading?: string;
  open: boolean;
};

const Modal = ({ children, heading, open, onClose }: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="w-full relative bg-white rounded-lg max-w-2xl mx-auto">
          <div className="p-4 border-b">
            <Dialog.Title className="text-xl font-medium">
              {heading}
            </Dialog.Title>
          </div>

          <div className="p-6 overflow-auto">{children}</div>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
