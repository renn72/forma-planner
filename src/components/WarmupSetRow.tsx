import { useState } from 'react'
import { CheckCircle, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { WarmupSet } from '@/types'
import { InputDialog } from './InputDialog'

interface WarmupSetRowProps {
  set: WarmupSet
  index: number
  onUpdate: (updatedSet: WarmupSet) => void
  onClear: () => void
}

export function WarmupSetRow({ set, index, onUpdate, onClear }: WarmupSetRowProps) {
  const [weightDialogOpen, setWeightDialogOpen] = useState(false)
  const [repsDialogOpen, setRepsDialogOpen] = useState(false)

  if (!set.weight && index > 0) return null

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-12 items-center gap-2 py-2 text-sm transition-colors',
          set.isComplete && 'text-primary',
          !set.weight && 'opacity-50',
        )}
      >
        <button
          className={cn(
            'col-span-4 text-center font-medium',
            set.weight && 'hover:text-primary',
          )}
          onClick={() => setWeightDialogOpen(true)}
        >
          {set.weight ? `${set.weight}kg` : '-'}
        </button>

        <button
          className="col-span-3 text-center text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setRepsDialogOpen(true)}
        >
          {set.reps || '-'}
        </button>

        <div className="col-span-2 flex justify-center">
          <button
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div className="col-span-3 flex justify-end">
          <button
            onClick={() => onUpdate({ ...set, isComplete: !set.isComplete })}
            className={cn(
              'transition-colors',
              set.isComplete ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <CheckCircle
              className="size-5"
              weight={set.isComplete ? 'fill' : 'regular'}
            />
          </button>
        </div>
      </div>

      <InputDialog
        open={weightDialogOpen}
        onOpenChange={setWeightDialogOpen}
        onSave={(weight) => onUpdate({ ...set, weight })}
        initialValue={set.weight}
        title="Weight (kg)"
        placeholder="Enter weight in kg"
      />

      <InputDialog
        open={repsDialogOpen}
        onOpenChange={setRepsDialogOpen}
        onSave={(reps) => onUpdate({ ...set, reps })}
        initialValue={set.reps}
        title="Reps"
        placeholder="Enter reps"
      />
    </>
  )
}
