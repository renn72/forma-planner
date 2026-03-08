import { useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { InputDialog } from './InputDialog'
import type { RoundData, Attempt } from '@/types'

interface AttemptSelectorProps {
  roundNumber: number
  roundData: RoundData
  onUpdateRound: (roundData: RoundData) => void
  canAddFourth?: boolean
  onAddFourth?: () => void
  onRemoveFourth?: () => void
  isFourth?: boolean
}

export function AttemptSelector({
  roundNumber,
  roundData,
  onUpdateRound,
  canAddFourth = false,
  onAddFourth,
  onRemoveFourth,
  isFourth = false,
}: AttemptSelectorProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(0)

  const isComplete = roundData.attempts.some((a: Attempt) => a.isComplete)

  const handleOpenEdit = (index: number) => {
    if (isComplete) return
    setEditingIndex(index)
    setEditDialogOpen(true)
  }

  const handleUpdateWeight = (index: number, weight: string) => {
    const newAttempts = [...roundData.attempts]

    newAttempts[index] = {
      ...newAttempts[index],
      weight,
    }

    // If editing the middle weight (index 1), auto-adjust lower and higher
    if (index === 1 && weight) {
      const middleWeight = parseFloat(weight) || 0
      const lowerWeight = middleWeight - 2.5
      const higherWeight = middleWeight + 2.5

      if (newAttempts[0]) {
        newAttempts[0] = { ...newAttempts[0], weight: lowerWeight.toString() }
      }
      if (newAttempts[2]) {
        newAttempts[2] = { ...newAttempts[2], weight: higherWeight.toString() }
      }
    }

    onUpdateRound({
      ...roundData,
      attempts: newAttempts as [Attempt, Attempt, Attempt],
    })
  }

  const handleComplete = (index: number, isGood: boolean) => {
    const newAttempts = [...roundData.attempts]
    newAttempts[index] = {
      ...newAttempts[index],
      isComplete: true,
      isGoodLift: isGood,
    }
    onUpdateRound({
      ...roundData,
      attempts: newAttempts as [Attempt, Attempt, Attempt],
    })
  }

  const handleClearRound = () => {
    const newAttempts = roundData.attempts.map((a: Attempt) => ({
      ...a,
      isComplete: false,
      isGoodLift: null,
    }))
    onUpdateRound({
      ...roundData,
      attempts: newAttempts as [Attempt, Attempt, Attempt],
    })
  }

  const getAttemptStatus = (attempt: Attempt) => {
    if (!attempt.isComplete) return null
    return attempt.isGoodLift ? 'good' : 'bad'
  }

  return (
    <>
      <div className="relative flex items-center justify-between px-4 py-3">
        <div className="text-4xl font-bold text-primary">{roundNumber}</div>

        <div className="flex flex-col items-center gap-1">
          {roundData.attempts.map((attempt: Attempt, index: number) => {
            const status = getAttemptStatus(attempt)
            const isMiddle = index === 1

            return (
              <button
                key={attempt.id}
                onClick={() => handleOpenEdit(index)}
                disabled={isComplete}
                className={cn(
                  'flex items-center gap-2 text-2xl transition-all',
                  status === 'good' && 'scale-110 text-green-500 font-bold',
                  status === 'bad' && 'scale-110 text-red-500 font-bold',
                  !isComplete && !isMiddle && 'text-muted-foreground',
                  isMiddle && 'font-bold text-foreground',
                  isComplete && 'cursor-default',
                  !isComplete && 'hover:text-primary cursor-pointer',
                )}
              >
                <span className="tabular-nums">{attempt.weight || '-'}</span>
                <span className="text-sm font-normal">kg</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col items-center gap-2">
          {canAddFourth && !isComplete && (
            <button
              onClick={onAddFourth}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="size-5" weight="bold" />
            </button>
          )}
          {isComplete && (
            <button
              onClick={handleClearRound}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <InputDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={(value) => handleUpdateWeight(editingIndex, value)}
        initialValue={roundData.attempts[editingIndex]?.weight || ''}
        title={`Round ${roundNumber} - Attempt ${editingIndex + 1}`}
        placeholder="Weight in kg"
        showOutcomeButtons
        onComplete={(isGood) => {
          handleComplete(editingIndex, isGood)
          setEditDialogOpen(false)
        }}
        isComplete={roundData.attempts[editingIndex]?.isComplete || false}
        isGoodLift={roundData.attempts[editingIndex]?.isGoodLift ?? null}
        isFourthRound={isFourth}
        onRemoveFourth={onRemoveFourth}
      />
    </>
  )
}
