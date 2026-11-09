import { useEffect, useRef } from 'react';
import Calculator from './Calculator';
import { useAppDispatch, useCalcActions } from '../hooks';

export default function App() {
  const container = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const actions = useCalcActions();
  useEffect(() => {
    const fit = () => {
      const node = container.current;
      if (!node) return;
      const scale = Math.min((window.innerWidth - 16) / 345, (window.innerHeight - 16) / node.offsetHeight);
      node.style.setProperty('--device-scale', String(Math.max(.15, scale)));
    };
    const observer = new ResizeObserver(fit);
    if (container.current) observer.observe(container.current);
    window.addEventListener('resize', fit);
    fit();
    const keyboard = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (/^[0-9.]$/.test(event.key)) dispatch(actions.updateCurrentOperand({ input: event.key }));
      else if (['+', '-', '*', '/', '^'].includes(event.key)) dispatch(actions.updateExpression({ operator: event.key as '+' | '-' | '*' | '/' | '^' }));
      else if (event.key === 'Enter' || event.key === '=') dispatch(actions.evaluateExpression());
      else if (event.key === 'Backspace' || event.key === 'Delete') dispatch(actions.backspace());
      else if (event.key === 'Escape') dispatch(actions.allClear());
      else if (event.key === '(') dispatch(actions.openBracket());
      else if (event.key === ')') dispatch(actions.closeBracket());
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', keyboard);
    return () => { observer.disconnect(); window.removeEventListener('resize', fit); window.removeEventListener('keydown', keyboard); };
  }, [dispatch]);
  return <div ref={container} className="simulator-device"><Calculator/></div>;
}
