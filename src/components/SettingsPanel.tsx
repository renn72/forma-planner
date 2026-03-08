import { useAtom } from 'jotai'
import { currentPlanAtom, createLiftDataFromTarget } from '@/store/atoms'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { LiftType } from '@/types'

export function SettingsPanel() {
  const [plan, setPlan] = useAtom(currentPlanAtom)

  if (!plan) return null

  const updateSetting = (key: string, value: number | string) => {
    setPlan({
      ...plan,
      settings: {
        ...plan.settings,
        [key]: value,
      },
    })
  }

  const updateTarget = (liftType: LiftType, target: number) => {
    const liftData = createLiftDataFromTarget(target)
    
    setPlan({
      ...plan,
      settings: {
        ...plan.settings,
        [`${liftType}Target`]: target,
      },
      lifts: {
        ...plan.lifts,
        [liftType]: liftData,
      },
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="bodyweight" className="text-xs">
              Bodyweight (kg)
            </Label>
            <Input
              id="bodyweight"
              type="number"
              placeholder="0"
              value={plan.settings.bodyweight || ''}
              onChange={(e) =>
                updateSetting('bodyweight', parseFloat(e.target.value) || 0)
              }
              className="h-8"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gender" className="text-xs">
              Gender
            </Label>
            <Select
              value={plan.settings.gender}
              onValueChange={(value) => updateSetting('gender', value)}
            >
              <SelectTrigger id="gender" className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Targets (kg)</Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label htmlFor="squatTarget" className="text-[0.65rem] text-muted-foreground">
                Squat
              </Label>
              <Input
                id="squatTarget"
                type="number"
                placeholder="0"
                value={plan.settings.squatTarget || ''}
                onChange={(e) =>
                  updateTarget('squat', parseFloat(e.target.value) || 0)
                }
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="benchTarget" className="text-[0.65rem] text-muted-foreground">
                Bench
              </Label>
              <Input
                id="benchTarget"
                type="number"
                placeholder="0"
                value={plan.settings.benchTarget || ''}
                onChange={(e) =>
                  updateTarget('bench', parseFloat(e.target.value) || 0)
                }
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="deadliftTarget" className="text-[0.65rem] text-muted-foreground">
                Deadlift
              </Label>
              <Input
                id="deadliftTarget"
                type="number"
                placeholder="0"
                value={plan.settings.deadliftTarget || ''}
                onChange={(e) =>
                  updateTarget('deadlift', parseFloat(e.target.value) || 0)
                }
                className="h-8"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
