import { CalculatorIcon } from "@heroicons/react/solid";
import {
  CalendarIcon,
  CheckIcon,
  CodeIcon,
  DatabaseIcon,
  MenuAlt2Icon,
} from "@heroicons/react/outline";
import { FieldType } from "../types";

export const TYPES: Array<{ name: FieldType; description: string; icon: any }> =
  [
    {
      name: "DateTime",
      description: "A calendar date",
      icon: CalendarIcon,
    },
    {
      name: "String",
      description: "Any text",
      icon: MenuAlt2Icon,
    },
    {
      name: "Boolean",
      description: "True or False",
      icon: CheckIcon,
    },
    {
      name: "Int",
      description: "A fixed number",
      icon: CalculatorIcon,
    },
    {
      name: "BigInt",
      description: "A very big number",
      icon: CalculatorIcon,
    },
    {
      name: "Float",
      description: "Float number",
      icon: CalculatorIcon,
    },
    {
      name: "Decimal",
      description: "Decimal number",
      icon: CalculatorIcon,
    },
    {
      name: "Json",
      description: "Any JSON data",
      icon: CodeIcon,
    },
    {
      name: "Bytes",
      description: "Abstract bytes data",
      icon: DatabaseIcon,
    },
  ];
