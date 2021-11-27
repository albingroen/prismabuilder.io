import { Button } from "@prisma/lens";
import Image from "next/image";
import Modal from "./Modal";

type GraphModalProps = {
  onClose: () => void;
  open: boolean;
};

const GraphModal = ({ onClose, open }: GraphModalProps) => {
  const graphImage =
    "https://res.cloudinary.com/albin-groen/image/upload/f_auto,q_auto/v1638030978/graph-min_tn0hc5.png";

  const linkImage =
    "https://res.cloudinary.com/albin-groen/image/upload/f_auto,q_auto/v1638030978/link-min_d7pfxe.png";

  return (
    <Modal heading="Graph view" open={open} onClose={onClose}>
      <p className="text-lg text-gray-700 mb-6">
        A new feature to Prisma Schema Builder has arrived! Graph View. In this
        view you can see your schema in a graph network, to see how every model
        and field is related.
      </p>

      <a target="_blank" rel="noopener noreferrer" href={graphImage}>
        <Image src={graphImage} alt="Graph viewk" height={700} width={1120} />
      </a>

      <p className="text-lg text-gray-700 mb-6 mt-8">
        To access the Graph view, just click the globe in the bottom left
        corner.
      </p>

      <a target="_blank" rel="noopener noreferrer" href={linkImage}>
        <Image src={linkImage} alt="Graph viewk" height={700} width={1120} />
      </a>

      <div className="mt-10">
        <Button variant="secondary" onClick={onClose} fillParent>
          Got it!
        </Button>
      </div>
    </Modal>
  );
};

export default GraphModal;
