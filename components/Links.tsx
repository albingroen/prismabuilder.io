import {
  MegaphoneIcon,
  BugAntIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import SidebarItem from "./SidebarItem";
import SponsorButton from "./SponsorButton";
import Stack from "./Stack";

export const LINKS = [
  {
    label: "Suggest a feature",
    href: "https://github.com/albingroen/prismabuilder.io/issues/new?labels=enhancement",
    icon: MegaphoneIcon,
  },
  {
    label: "Report a bug",
    href: "https://github.com/albingroen/prismabuilder.io/issues/new?labels=bug",
    icon: BugAntIcon,
  },
  {
    label: "Source code",
    href: "https://github.com/albingroen/prismabuilder.io",
    icon: CodeBracketIcon,
  },
];

const Links = () => (
  <Stack direction="vertical" spacing="large" className="mt-3">
    <ul className="w-full">
      {LINKS.map((LINK) => (
        <SidebarItem
          key={LINK.label}
          href={LINK.href}
          icon={LINK.icon}
          target="_blank"
          rel="noopener"
        >
          {LINK.label}
        </SidebarItem>
      ))}
    </ul>

    <SponsorButton />
  </Stack>
);

export default Links;
