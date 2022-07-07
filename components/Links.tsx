import LinkPreview from "./LinkPreview";

export const LINKS = [
  {
    label: "Source code",
    href: "https://github.com/albingroen/prismabuilder.io",
  },
  {
    label: "Report a bug",
    href: "https://github.com/albingroen/prismabuilder.io/issues/new?labels=bug",
  },
  {
    label: "Suggest a feature",
    href: "https://github.com/albingroen/prismabuilder.io/issues/new?labels=enhancement",
  },
];

const Links = () => (
  <div className="space-y-4">
    <div className="divide-x text-sm text-gray-600 justify-self-end">
      {LINKS.map((LINK) => (
        <a
          className="hover:underline hover:text-gray-700 pr-3 focus:ring-2"
          rel="noopener noreferrer"
          href={LINK.href}
          key={LINK.label}
          target="_blank"
        >
          {LINK.label}
        </a>
      ))}
    </div>

    <hr className="!my-4" />

    <LinkPreview url="https://taskplane.app" />
  </div>
);

export default Links;
