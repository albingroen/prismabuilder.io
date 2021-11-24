import {
  Clock,
  Database,
  ExternalLink,
  Hash,
  HelpCircle,
  Icon,
  Server,
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
  Json: Database,
  Bytes: Server,
  Relation: ExternalLink,
  default: HelpCircle,
};
