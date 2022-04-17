import {
  CalculatorIcon,
  CubeIcon,
  CubeTransparentIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
import {
  CalendarIcon,
  CheckIcon,
  CodeIcon,
  DatabaseIcon,
  MenuAlt2Icon,
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
  Enum: CubeTransparentIcon,
  default: QuestionMarkCircleIcon,
};
