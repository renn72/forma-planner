import { useState } from "react"
import { Plus } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { InputDialog } from "./InputDialog"
import type { RoundData, Attempt } from "@/types"

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
    return attempt.isGoodLift ? "good" : "bad"
  }

  return (
    <>
      <div className="relative flex items-center justify-between gap-4 bg-gradient-to-r from-background/50 via-primary/3 to-accent/10 px-4 py-4 sm:px-5">
        <div className="text-5xl font-black tracking-[-0.05em] text-primary/90">
          {roundNumber}
        </div>

        <div className="flex flex-1 flex-col items-center gap-2">
          {roundData.attempts.map((attempt: Attempt, index: number) => {
            const status = getAttemptStatus(attempt)
            const isMiddle = index === 1

            return (
              <button
                key={attempt.id}
                onClick={() => handleOpenEdit(index)}
                disabled={isComplete}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-1 text-3xl leading-none transition-all",
                  status === "good" &&
                    "scale-[1.03] bg-emerald-500/12 font-bold text-emerald-600 dark:text-emerald-300",
                  status === "bad" &&
                    "scale-[1.03] bg-rose-500/12 font-bold text-rose-600 dark:text-rose-300",
                  !isComplete && !isMiddle && "text-muted-foreground",
                  isMiddle && "font-semibold text-foreground",
                  isComplete && "cursor-default",
                  !isComplete &&
                    "cursor-pointer hover:bg-accent/20 hover:text-primary"
                )}
              >
                <span className="tabular-nums">{attempt.weight || "-"}</span>
                <span className="text-base font-normal text-muted-foreground">
                  kg
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col items-center gap-2">
          {canAddFourth && !isComplete && (
            <button
              onClick={onAddFourth}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent/25 hover:text-foreground"
            >
              <Plus className="size-6" weight="bold" />
            </button>
          )}
          {isComplete && (
            <button
              onClick={handleClearRound}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
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
        initialValue={roundData.attempts[editingIndex]?.weight || ""}
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
