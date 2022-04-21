import LinkPreview from "./LinkPreview";

const Links = () => (
  <div className="space-y-4">
    <div className="divide-x text-sm text-gray-600 justify-self-end">
      <a
        className="hover:underline hover:text-gray-700 pr-3 focus:ring-2"
        href="https://github.com/albingroen/prismabuilder.io"
        rel="noopener noreferrer"
        target="_blank"
      >
        Source code
      </a>

      <a
        href="https://github.com/albingroen/prismabuilder.io/issues/new?labels=bug"
        className="hover:underline hover:text-gray-700 px-3 focus:ring-2"
        rel="noopener noreferrer"
        target="_blank"
      >
        Report a bug
      </a>

      <a
        href="https://github.com/albingroen/prismabuilder.io/issues/new?labels=enhancement"
        className="hover:underline hover:text-gray-700 pl-3 focus:ring-2"
        rel="noopener noreferrer"
        target="_blank"
      >
        Suggest feature
      </a>
    </div>

    <hr className="!my-4" />

    <LinkPreview url="https://demando.io" />
  </div>
);

export default Links;
