import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownSurface, DropdownSurfaceItem } from './dropdown-surface'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
  return (
    <DropdownSurfaceItem as={DropdownMenuPrimitive.SubTrigger}
      className={cn(
        inset && "shared-dropdown-inset",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownSurfaceItem>
  )
}

function DropdownMenuSubContent({ className, ...props }) {
  return (
    <DropdownSurface as={DropdownMenuPrimitive.SubContent}
      className={className}
      {...props}
    />
  )
}

function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownSurface as={DropdownMenuPrimitive.Content}
        sideOffset={sideOffset}
        className={className}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem({ className, inset, ...props }) {
  return (
    <DropdownSurfaceItem as={DropdownMenuPrimitive.Item}
      className={cn(
        inset && "shared-dropdown-inset",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({ className, children, checked, ...props }) {
  return (
    <DropdownSurfaceItem as={DropdownMenuPrimitive.CheckboxItem}
      className={cn(
        "shared-dropdown-indicator-left",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownSurfaceItem>
  )
}

function DropdownMenuRadioItem({ className, children, ...props }) {
  return (
    <DropdownSurfaceItem as={DropdownMenuPrimitive.RadioItem}
      className={cn(
        "shared-dropdown-indicator-left",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownSurfaceItem>
  )
}

function DropdownMenuLabel({ className, inset, ...props }) {
  return <DropdownMenuPrimitive.Label className={cn("px-2 py-1.5 text-sm font-semibold", inset && "shared-dropdown-inset", className)} {...props} />
}

function DropdownMenuSeparator({ className, ...props }) {
  return <DropdownMenuPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
}

function DropdownMenuShortcut({ className, ...props }) {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
