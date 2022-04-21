/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

interface LinkPreviewProps {
  url: string;
}

export default function LinkPreview({ url }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<any>();

  useEffect(() => {
    fetch(`/api/metadata?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then(setMetadata);
  }, [url]);

  if (!metadata?.og) return null;

  return (
    <a
      className="flex flex-col w-full rounded-md overflow-hidden border"
      rel="noopener noreferrer"
      target="_blank"
      href={url}
    >
      <img src={metadata.og.image} className="w-full" alt={`${url} og`} />
      <div className="bg-white p-4 w-full">
        <h4 className="font-semibold text-sm">{metadata.og.title}</h4>
        <p className="text-sm mt-2 text-gray-800 font-medium">
          {metadata.og.description}
        </p>
      </div>
    </a>
  );
}
