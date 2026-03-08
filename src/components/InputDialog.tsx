import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Trash } from "@phosphor-icons/react"

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
  initialValue = "",
  title = "Edit Value",
  placeholder = "",
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
      <DialogContent className="sm:max-w-[340px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-1">
          {multiline ? (
            <textarea
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex min-h-[112px] w-full rounded-xl border border-input bg-background/80 px-3 py-3 text-base leading-6 ring-offset-background placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="flex justify-center gap-3 pb-2">
            <button
              onClick={() => handleComplete(true)}
              disabled={isComplete && isGoodLift === true}
              className={`flex min-w-28 flex-col items-center gap-2 rounded-2xl border border-border/60 p-4 transition-all ${
                isComplete && isGoodLift === true
                  ? "bg-emerald-500/18 text-emerald-600 dark:text-emerald-300"
                  : "text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-300"
              }`}
            >
              <CheckCircle
                className="size-10"
                weight={isComplete && isGoodLift === true ? "fill" : "regular"}
              />
              <span className="text-sm font-medium">Good</span>
            </button>
            <button
              onClick={() => handleComplete(false)}
              disabled={isComplete && isGoodLift === false}
              className={`flex min-w-28 flex-col items-center gap-2 rounded-2xl border border-border/60 p-4 transition-all ${
                isComplete && isGoodLift === false
                  ? "bg-rose-500/18 text-rose-600 dark:text-rose-300"
                  : "text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300"
              }`}
            >
              <XCircle
                className="size-10"
                weight={isComplete && isGoodLift === false ? "fill" : "regular"}
              />
              <span className="text-sm font-medium">Bad</span>
            </button>
          </div>
        )}

        <DialogFooter className="gap-3 pt-1">
          {isFourthRound && onRemoveFourth && (
            <Button
              variant="destructive"
              size="icon-sm"
              onClick={onRemoveFourth}
              className="mr-auto"
            >
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
