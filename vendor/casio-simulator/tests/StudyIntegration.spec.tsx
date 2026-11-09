import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import App from '../src/components/App';
import { renderWithProviders, pressButtons, assertOutputIsEqualTo } from './test-utils';

describe('Study-space integration', () => {
  beforeEach(() => renderWithProviders(<App/>));
  it('evaluates powers using SHIFT and multiply', () => {
    pressButtons(['2', 'SHIFT']);
    fireEvent.click(screen.getByRole('button', { name: 'power' }));
    pressButtons(['3', '=']);
    assertOutputIsEqualTo('8');
  });
  it('stores, adds, recalls and clears memory', () => {
    pressButtons(['12', 'SHIFT']);
    fireEvent.click(screen.getByRole('button', { name: 'memory recall' }));
    pressButtons(['AC', '3']);
    fireEvent.click(screen.getByRole('button', { name: 'memory add' }));
    fireEvent.click(screen.getByRole('button', { name: 'memory recall' }));
    assertOutputIsEqualTo('15');
    pressButtons(['SHIFT', 'AC']);
    fireEvent.click(screen.getByRole('button', { name: 'memory recall' }));
    assertOutputIsEqualTo('0');
  });
  it('recalls Ans after a new entry', () => {
    pressButtons(['7', '+', '5', '=', '2', '×']);
    fireEvent.click(screen.getByRole('button', { name: 'previous answer' }));
    pressButtons(['=']);
    assertOutputIsEqualTo('24');
  });
  it('supports factorial and reciprocal on shifted bracket keys', () => {
    pressButtons(['5', 'SHIFT']);
    fireEvent.click(screen.getByRole('button', { name: 'factorial' }));
    assertOutputIsEqualTo('120');
    pressButtons(['AC', '4', 'SHIFT']);
    fireEvent.click(screen.getByRole('button', { name: 'reciprocal' }));
    assertOutputIsEqualTo('0.25');
  });
  it('accepts physical keyboard input and Escape clears the display', () => {
    for (const key of ['2', '+', '3', '*', '4', 'Enter']) fireEvent.keyDown(window, { key });
    assertOutputIsEqualTo('14');
    fireEvent.keyDown(window, { key: 'Escape' });
    assertOutputIsEqualTo('0');
  });
  it('recovers from division by zero', () => {
    pressButtons(['1', '÷', '0', '=']);
    assertOutputIsEqualTo('Error');
    pressButtons(['AC', '2', '+', '2', '=']);
    assertOutputIsEqualTo('4');
  });
});
