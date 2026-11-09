import { Check, Highlighter, Trash2, X } from 'lucide-react'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { highlightColors } from '@/lib/note-highlights'

function HighlightPalette({ color, onChange }) {
  return <div className="highlight-palette" role="group" aria-label="Change highlight colour">
    {highlightColors.map(value => <button
      key={value}
      aria-label={`${value === 'mint' ? 'green' : value} highlight`}
      aria-pressed={color === value}
      className={`color-dot ${value}`}
      onClick={() => onChange(value)}
    >{color === value && <span className="swatch-check"><Check/></span>}</button>)}
  </div>
}

export function HighlightEditor({ tools }) {
  return <Popover open={Boolean(tools.editing)} onOpenChange={open => { if (!open) tools.closeEditor() }}>
    <PopoverAnchor virtualRef={tools.anchor}/>
    <PopoverContent className="color-popover highlight-editor" side="top" sideOffset={9} collisionPadding={12} updatePositionStrategy="always" aria-label="Edit saved highlight" onCloseAutoFocus={event => event.preventDefault()}>
      
      <HighlightPalette color={tools.editing?.color} onChange={tools.recolor}/>
      <button className="delete-highlight" onClick={() => tools.remove()}><Trash2/>Delete highlight</button>
    </PopoverContent>
  </Popover>
}

export function SavedHighlights({ tools, open, onOpenChange, contentLabel = 'notes' }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="saved-highlights-dialog" onCloseAutoFocus={event => event.preventDefault()}>
      <DialogTitle>Your highlights</DialogTitle>
      <DialogDescription>Saved on this device. Choose a highlight to return to it and edit its colour.</DialogDescription>
      {!tools.records.length ? <p className="highlights-empty"><Highlighter/>Turn on Highlight, then select text in your {contentLabel} to save your first highlight.</p> : <div className="highlight-list">
        {tools.records.map(item => <div className="saved-highlight-row" key={item.id}>
          <button className="revisit-highlight" onClick={() => { onOpenChange(false); tools.revisit(item.id) }} aria-label={`Go to highlight: ${item.text}`}>
            <span className={`color-dot ${item.color}`} aria-hidden="true"/>
            <span>{item.text}</span>
          </button>
          <button className="remove-saved-highlight" aria-label={`Delete highlight: ${item.text}`} onClick={() => tools.remove(item.id)}><Trash2/></button>
        </div>)}
      </div>}
    </DialogContent>
  </Dialog>
}
