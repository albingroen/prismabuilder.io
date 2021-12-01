import { Button } from "@prisma/lens";
import Modal from "./Modal";

type WelcomeModalProps = {
  onClose: () => void;
  open: boolean;
};

const WelcomeModal = ({ onClose, open }: WelcomeModalProps) => {
  return (
    <Modal heading="Welcome!" open={open} onClose={onClose}>
      <p className="text-lg text-gray-700">
        Welcome to Prisma Schema Builder. You&apos;ve probably come here either
        because you&apos;ve seen something about it on social media, your friend
        has been telling you about it, or you just happened to find this page.
      </p>

      <h2 className="text-xl font-medium mt-8">So, what is this?</h2>

      <p className="mt-3 text-lg text-gray-700">
        Prisma Schema Builder is an attempt to build a visual tool for
        constructing{" "}
        <a className="text-blue-600 hover:underline" href="https://prisma.io">
          Prisma
        </a>{" "}
        database schemas. It&apos;s an open source community lead product, and
        does not have any affiliation with Prisma whatsoever.
      </p>

      <h2 className="text-xl font-medium mt-8">How do I get started?</h2>

      <p className="mt-3 text-lg text-gray-700">
        Simply, hit the button below, and then click &ldquo;New schema&rdquo; in
        the upper left hand corner. After that you can start creating your first
        schema. Once you&apos;re happy with your schema, you can hit the green
        button to generate the code for your Prisma schema file.
      </p>

      <div className="mt-10">
        <Button onClick={onClose} fillParent>
          Get started
        </Button>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
