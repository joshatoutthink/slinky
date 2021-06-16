function test(desc, isPass) {
  const status = isPass ? "pass" : "fail";

  console.log(style(status), desc, status);
}
const pre = "\x1b";
const reset = pre + "[0m";
const COLORS = {
  failText: "[31m%s",
  passText: "[32m%s",
  failBg: "[41m" + pre + "[30m %s ",
  passBg: "[42m" + pre + "[30m %s ",
};
const style = (status) =>
  pre +
  COLORS[`${status}Text`] +
  reset +
  " " +
  pre +
  COLORS[`${status}Bg`] +
  reset;

module.exports = { test };

// * THIS ALSO WORKS  R;G;B;
// 38 is foreground
// 48 is background
// ? console.log(pre + "[38;2;255;0;0m%s" + reset, "test");
