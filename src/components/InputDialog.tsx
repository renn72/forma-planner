import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle, Trash } from '@phosphor-icons/react'

interface InputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (value: string) => void
  initialValue?: string
  title?: string
  placeholder?: string
  multiline?: boolean
  showOutcomeButtons?: boolean
  onComplete?: (isGood: boolean) => void
  isComplete?: boolean
  isGoodLift?: boolean | null
  isFourthRound?: boolean
  onRemoveFourth?: () => void
}

export function InputDialog({
  open,
  onOpenChange,
  onSave,
  initialValue = '',
  title = 'Edit Value',
  placeholder = '',
  multiline = false,
  showOutcomeButtons = false,
  onComplete,
  isComplete = false,
  isGoodLift = null,
  isFourthRound = false,
  onRemoveFourth,
}: InputDialogProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (open) {
      setValue(initialValue)
    }
  }, [open, initialValue])

  const handleSave = () => {
    onSave(value)
    onOpenChange(false)
  }

  const handleComplete = (isGood: boolean) => {
    if (onComplete) {
      onComplete(isGood)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {multiline ? (
            <textarea
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          ) : (
            <Input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </div>

        {showOutcomeButtons && (
          <div className="flex justify-center gap-4 pb-4">
            <button
              onClick={() => handleComplete(true)}
              disabled={isComplete && isGoodLift === true}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                isComplete && isGoodLift === true
                  ? 'bg-green-500/20 text-green-500'
                  : 'hover:bg-green-500/10 text-muted-foreground hover:text-green-500'
              }`}
            >
              <CheckCircle className="size-8" weight={isComplete && isGoodLift === true ? 'fill' : 'regular'} />
              <span className="text-xs">Good</span>
            </button>
            <button
              onClick={() => handleComplete(false)}
              disabled={isComplete && isGoodLift === false}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                isComplete && isGoodLift === false
                  ? 'bg-red-500/20 text-red-500'
                  : 'hover:bg-red-500/10 text-muted-foreground hover:text-red-500'
              }`}
            >
              <XCircle className="size-8" weight={isComplete && isGoodLift === false ? 'fill' : 'regular'} />
              <span className="text-xs">Bad</span>
            </button>
          </div>
        )}

        <DialogFooter className="gap-2">
          {isFourthRound && onRemoveFourth && (
            <Button variant="destructive" onClick={onRemoveFourth} className="mr-auto">
              <Trash className="size-4" />
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
