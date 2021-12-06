import {
  Box,
  Clock,
  Code,
  Database,
  Hash,
  HelpCircle,
  Icon,
  List,
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
  Model: Box,
  Enum: List,
  default: HelpCircle,
};
