import {
  CalculatorIcon,
  CubeIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
import {
  CalendarIcon,
  CheckIcon,
  CodeIcon,
  DatabaseIcon,
  MenuAlt2Icon,
  ViewListIcon,
} from "@heroicons/react/outline";

export const prismaTypesToIcons: Record<string, any> = {
  Int: CalculatorIcon,
  DateTime: CalendarIcon,
  String: MenuAlt2Icon,
  Boolean: CheckIcon,
  BigInt: CalculatorIcon,
  Float: CalculatorIcon,
  Decimal: CalculatorIcon,
  Json: CodeIcon,
  Bytes: DatabaseIcon,
  Model: CubeIcon,
  Enum: ViewListIcon,
  default: QuestionMarkCircleIcon,
};
