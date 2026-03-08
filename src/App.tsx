import { useAtomValue } from "jotai"
import { currentPlanAtom } from "@/store/atoms"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlanSelector } from "@/components/PlanSelector"
import { SettingsPanel } from "@/components/SettingsPanel"
import { LiftPanel } from "@/components/LiftPanel"
import { StatsDisplay } from "@/components/StatsDisplay"

export function App() {
  const currentPlan = useAtomValue(currentPlanAtom)

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-8 space-y-5 rounded-[1.75rem] border border-border/60 bg-card/75 px-4 py-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.22)] backdrop-blur-sm sm:px-5">
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-black shadow-sm"
              style={{
                background:
                  "linear-gradient(145deg, #f4ddb0 0%, #e8b96a 46%, #b2732e 100%)",
                color: "#24170c",
              }}
            >
              F
            </span>
            <div className="flex flex-col leading-tight">
              <strong className="text-lg font-semibold tracking-[0.02em]">
                Planner
              </strong>
              <small className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                Forma by WSYS
              </small>
            </div>
          </div>
          <PlanSelector />
        </header>

        {currentPlan ? (
          <div className="space-y-5">
            <SettingsPanel />
            <StatsDisplay />

            <Tabs defaultValue="squat" className="w-full gap-4">
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
          <div className="flex h-[58vh] items-center justify-center">
            <div className="space-y-2 rounded-[1.5rem] border border-border/60 bg-card/70 px-6 py-8 text-center shadow-sm backdrop-blur-sm">
              <p className="text-lg font-semibold text-foreground">
                No plan selected
              </p>
              <p className="text-sm text-muted-foreground">
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
