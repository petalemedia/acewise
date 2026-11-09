import { 
  addDependencies,
  acosDependencies,
  acoshDependencies,
  asinDependencies,
  asinhDependencies,
  atanDependencies,
  atanhDependencies,
  cbrtDependencies,
  cosDependencies,
  coshDependencies,
  create,
  cubeDependencies,
  divideDependencies,
  evaluateDependencies,
  expDependencies,
  factory,
  logDependencies,
  log10Dependencies,
  multiplyDependencies,
  powDependencies,
  sinDependencies,
  sinhDependencies,
  sqrtDependencies,
  squareDependencies,
  subtractDependencies,
  tanDependencies,
  tanhDependencies,
} from "mathjs";

type OperationFunction = (...args: number[]) => number;
const createOperation = (name: string, fn: OperationFunction) => factory(name, [], () => fn);
const factorial = (value: number) => {
  if (!Number.isInteger(value) || value < 0 || value > 170) return NaN;
  let result = 1;
  for (let n = 2; n <= value; n++) result *= n;
  return result;
};
const powerOfTen = (exponent: number) => Math.pow(10, exponent);

const { evaluate } = create({
  addDependencies,
  acosDependencies,
  acoshDependencies,
  asinDependencies,
  asinhDependencies,
  atanDependencies,
  atanhDependencies,
  cbrtDependencies,
  cosDependencies,
  coshDependencies,
  cubeDependencies,
  divideDependencies,
  evaluateDependencies,
  expDependencies,
  logDependencies,
  log10Dependencies,
  multiplyDependencies,
  powDependencies,
  sinDependencies,
  sinhDependencies,
  sqrtDependencies,
  squareDependencies,
  subtractDependencies,
  tanDependencies,
  tanhDependencies,
  createFactorial: createOperation("factorial", factorial),
  createReciprocal: createOperation("reciprocal", value => 1 / value),
  createPowerOfTen: createOperation("powerOfTen", powerOfTen),
});

export default (expression: string[]): number => {
  try { return evaluate(expression.join("")); } catch { return NaN; }
}
