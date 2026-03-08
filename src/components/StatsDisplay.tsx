import { useAtomValue } from "jotai"
import { currentPlanAtom } from "@/store/atoms"
import { Card, CardContent } from "@/components/ui/card"
import { calculateDOTS, calculateOldWilks } from "@/lib/helpers"
import type { RoundData, Attempt } from "@/types"

export function StatsDisplay() {
  const plan = useAtomValue(currentPlanAtom)

  if (!plan || !plan.settings.bodyweight) return null

  const isFemale = plan.settings.gender === "female"
  const bodyweight = plan.settings.bodyweight

  const getBestLift = (liftType: "squat" | "bench" | "deadlift") => {
    const liftData = plan.lifts[liftType]

    let allAttempts: Attempt[] = []
    liftData.rounds.forEach((round: RoundData) => {
      allAttempts = [...allAttempts, ...round.attempts]
    })

    const goodLifts = allAttempts.filter(
      (a: Attempt) => a.isComplete && a.isGoodLift
    )
    if (goodLifts.length === 0) return 0

    return Math.max(...goodLifts.map((a: Attempt) => parseFloat(a.weight) || 0))
  }

  const targetTotal =
    plan.settings.squatTarget +
    plan.settings.benchTarget +
    plan.settings.deadliftTarget

  const squat = getBestLift("squat")
  const bench = getBestLift("bench")
  const deadlift = getBestLift("deadlift")
  const currentTotal = squat + bench + deadlift

  const targetDOTS = calculateDOTS(bodyweight, targetTotal, isFemale)
  const targetWilks = calculateOldWilks(bodyweight, targetTotal, isFemale)

  const currentDOTS = calculateDOTS(bodyweight, currentTotal, isFemale)
  const currentWilks = calculateOldWilks(bodyweight, currentTotal, isFemale)

  return (
    <Card>
      <CardContent className="p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-primary/4 to-background/80 p-4">
            <div className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Target
            </div>
            <div className="space-y-2 text-base">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-lg font-semibold tabular-nums">
                  {targetTotal} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DOTS</span>
                <span className="tabular-nums">{targetDOTS}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wilks</span>
                <span className="tabular-nums">{targetWilks}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border/60 bg-gradient-to-br from-accent/45 via-secondary/20 to-background/80 p-4">
            <div className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Current
            </div>
            <div className="space-y-2 text-base">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-lg font-semibold tabular-nums">
                  {currentTotal} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DOTS</span>
                <span className="tabular-nums">{currentDOTS}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wilks</span>
                <span className="tabular-nums">{currentWilks}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
