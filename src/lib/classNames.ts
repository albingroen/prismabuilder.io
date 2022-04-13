export default function classNames(
  ...classes: Array<string | false | undefined>
) {
  return classes.filter(Boolean).join(" ");
}
