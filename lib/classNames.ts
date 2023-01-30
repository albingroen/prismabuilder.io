const cn = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");

export default cn;
