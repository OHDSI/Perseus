/**
 * Integer division
 */
export function integerDivision(divisible, divisor) {
  const remain = divisible % divisor
  const result = (divisible - remain) / divisor;
  return remain === 0 ? result : result + 1
}
