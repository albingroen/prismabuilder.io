import {
  Clock,
  Code,
  Database,
  ExternalLink,
  Hash,
  HelpCircle,
  Icon,
  ToggleRight,
  Type,
} from "react-feather";

export const prismaTypesToIcons: Record<string, Icon> = {
  Int: Hash,
  DateTime: Clock,
  String: Type,
  Boolean: ToggleRight,
  BigInt: Hash,
  Float: Hash,
  Decimal: Hash,
  Json: Code,
  Bytes: Database,
  Relation: ExternalLink,
  default: HelpCircle,
};
