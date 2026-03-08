import { useAtom } from 'jotai'
import { currentPlanAtom } from '@/store/atoms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { WarmupSetRow } from './WarmupSetRow'
import { AttemptSelector } from './AttemptSelector'
import type { LiftData, LiftType, WarmupSet, RoundData } from '@/types'
import { generateId } from '@/lib/helpers'

interface LiftPanelProps {
  liftType: LiftType
}

export function LiftPanel({ liftType }: LiftPanelProps) {
  const [plan, setPlan] = useAtom(currentPlanAtom)

  if (!plan) return null

  const liftData: LiftData = plan.lifts[liftType]

  const updateLiftData = (newLiftData: LiftData) => {
    setPlan({
      ...plan,
      lifts: {
        ...plan.lifts,
        [liftType]: newLiftData,
      },
    })
  }

  const updateWarmup = (index: number, updatedSet: WarmupSet) => {
    const newWarmups = [...liftData.warmups]
    newWarmups[index] = updatedSet
    updateLiftData({ ...liftData, warmups: newWarmups })
  }

  const clearWarmup = (index: number) => {
    const newWarmups = [...liftData.warmups]
    newWarmups[index] = {
      ...newWarmups[index],
      weight: '',
      reps: '',
      isComplete: false,
    }
    updateLiftData({ ...liftData, warmups: newWarmups })
  }

  const updateRound = (roundIndex: number, roundData: RoundData) => {
    const newRounds = [...liftData.rounds]
    newRounds[roundIndex] = roundData
    updateLiftData({ ...liftData, rounds: newRounds })
  }

  const addFourthRound = () => {
    const lastRound = liftData.rounds[liftData.rounds.length - 1]
    const lastWeight = parseFloat(lastRound?.attempts[1]?.weight) || 0
    const fourthWeight = lastWeight + 2.5

    const fourthRound: RoundData = {
      id: generateId(),
      attempts: [
        {
          id: generateId(),
          weight: (fourthWeight - 2.5).toString(),
          isComplete: false,
          isGoodLift: null,
        },
        {
          id: generateId(),
          weight: fourthWeight.toString(),
          isComplete: false,
          isGoodLift: null,
        },
        {
          id: generateId(),
          weight: (fourthWeight + 2.5).toString(),
          isComplete: false,
          isGoodLift: null,
        },
      ],
    }

    updateLiftData({
      ...liftData,
      rounds: [...liftData.rounds, fourthRound],
      hasFourthRound: true,
    })
  }

  const removeFourthRound = () => {
    updateLiftData({
      ...liftData,
      rounds: liftData.rounds.slice(0, 3),
      hasFourthRound: false,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Warmup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b">
              <div className="col-span-4 text-center">Weight</div>
              <div className="col-span-3 text-center">Reps</div>
              <div className="col-span-2 text-center">Clear</div>
              <div className="col-span-3 text-center">Done</div>
            </div>
            <div className="divide-y divide-dashed p-3">
              {liftData.warmups.map((warmupSet: WarmupSet, index: number) => (
                <WarmupSetRow
                  key={warmupSet.id}
                  set={warmupSet}
                  index={index}
                  onUpdate={(updated) => updateWarmup(index, updated)}
                  onClear={() => clearWarmup(index)}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-dashed border rounded-lg">
            {liftData.rounds.map((round: RoundData, index: number) => {
              const roundNumber = index + 1
              const isFourth = index === 3
              const canAddFourth = index === 2 && !liftData.hasFourthRound

              return (
                <AttemptSelector
                  key={round.id}
                  roundNumber={roundNumber}
                  roundData={round}
                  onUpdateRound={(updatedRound) => updateRound(index, updatedRound)}
                  canAddFourth={canAddFourth}
                  onAddFourth={addFourthRound}
                  isFourth={isFourth}
                  onRemoveFourth={isFourth ? removeFourthRound : undefined}
                />
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes for this lift..."
            value={liftData.notes || ''}
            onChange={(e) => updateLiftData({ ...liftData, notes: e.target.value })}
            className="min-h-[80px] resize-none"
          />
        </CardContent>
      </Card>
    </div>
  )
}
