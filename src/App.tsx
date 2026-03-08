import { useAtomValue } from 'jotai'
import { currentPlanAtom } from '@/store/atoms'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlanSelector } from '@/components/PlanSelector'
import { SettingsPanel } from '@/components/SettingsPanel'
import { LiftPanel } from '@/components/LiftPanel'
import { StatsDisplay } from '@/components/StatsDisplay'

export function App() {
  const currentPlan = useAtomValue(currentPlanAtom)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <header className="mb-6 space-y-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-black"
              style={{
                background: 'linear-gradient(135deg, #f7d58a 0%, #e0a64b 48%, #9e6420 100%)',
                color: '#121216',
              }}
            >
              F
            </span>
            <div className="flex flex-col leading-tight">
              <strong className="text-base font-semibold tracking-wide">Planner</strong>
              <small className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Forma by WSYS
              </small>
            </div>
          </div>
          <PlanSelector />
        </header>

        {currentPlan ? (
          <div className="space-y-4">
            <SettingsPanel />
            <StatsDisplay />

            <Tabs defaultValue="squat" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="squat" className="flex-1">
                  Squat
                </TabsTrigger>
                <TabsTrigger value="bench" className="flex-1">
                  Bench
                </TabsTrigger>
                <TabsTrigger value="deadlift" className="flex-1">
                  Deadlift
                </TabsTrigger>
              </TabsList>

              <TabsContent value="squat">
                <LiftPanel liftType="squat" />
              </TabsContent>

              <TabsContent value="bench">
                <LiftPanel liftType="bench" />
              </TabsContent>

              <TabsContent value="deadlift">
                <LiftPanel liftType="deadlift" />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex h-[60vh] items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No plan selected</p>
              <p className="text-xs text-muted-foreground">
                Create a new plan to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
