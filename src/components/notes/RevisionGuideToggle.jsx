import { LogIn } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function RevisionGuideToggle({ open, onToggle }) {
  const label = open ? 'Hide revision guide' : 'Show revision guide'
  return <TooltipProvider delayDuration={250}><Tooltip>
    <TooltipTrigger asChild><button className={`outline-toggle ${open ? 'is-open' : ''}`} aria-label={label} aria-expanded={open} aria-controls="revision-navigation" onClick={onToggle}><LogIn aria-hidden="true"/></button></TooltipTrigger>
    <TooltipContent side="right" sideOffset={10}>{label}</TooltipContent>
  </Tooltip></TooltipProvider>
}
