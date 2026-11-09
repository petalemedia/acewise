import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import './dropdown-surface.css'

// Selects and action menus use different accessible Radix primitives, but share
// this surface and item component so their visual treatment stays in one place.
export const DropdownSurface = forwardRef(function DropdownSurface(
  { as: Component = 'div', matchTriggerWidth = false, className, ...props }, ref,
) {
  return <Component ref={ref} className={cn('ui-floating-panel shared-dropdown', className)} data-match-trigger-width={matchTriggerWidth} {...props}/>
})

export const DropdownSurfaceItem = forwardRef(function DropdownSurfaceItem(
  { as: Component = 'div', className, ...props }, ref,
) {
  return <Component ref={ref} className={cn('shared-dropdown-item', className)} {...props}/>
})
