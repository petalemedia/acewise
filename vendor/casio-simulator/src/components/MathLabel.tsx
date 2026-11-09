import { Children, isValidElement, cloneElement, type ReactNode } from 'react';
const labels: Record<string, string> = {
  '`x^2`': 'x²', '`root()(x)`': '√x', '`10^x`': '10ˣ', '`e^x`': 'eˣ',
  '`leftarrow`': '←', '`sin^-1`': 'sin⁻¹', '`cos^-1`': 'cos⁻¹', '`tan^-1`': 'tan⁻¹',
  '`root(3)(x)`': '³√x', '`x^3`': 'x³', '`x!`': 'x!', '`x^y`': 'xʸ',
  '`to`': '→', '`pi`': 'π', '`x`': 'x', '`a`': 'a',
};
function renderLabels(children: ReactNode): ReactNode {
  return Children.map(children, child => {
    if (typeof child === 'string') return labels[child] ?? child.replaceAll('`', '');
    if (isValidElement<{ children?: ReactNode }>(child)) return cloneElement(child, {}, renderLabels(child.props.children));
    return child;
  });
}
export function MathJax({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={className}>{renderLabels(children)}</span>;
}
