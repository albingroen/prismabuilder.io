import {
  ArrowsRightLeftIcon,
  Bars3BottomLeftIcon,
  CircleStackIcon,
  ClockIcon,
  CodeBracketIcon,
  CubeIcon,
  HashtagIcon,
  ListBulletIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { HeroIcon } from "./types";

export const prismaTypesToIcons: Record<string, HeroIcon> = {
  Int: HashtagIcon,
  DateTime: ClockIcon,
  String: Bars3BottomLeftIcon,
  Boolean: ArrowsRightLeftIcon,
  BigInt: HashtagIcon,
  Float: HashtagIcon,
  Decimal: HashtagIcon,
  Json: CodeBracketIcon,
  Bytes: CircleStackIcon,
  Model: CubeIcon,
  Enum: ListBulletIcon,
  default: QuestionMarkCircleIcon,
};
