import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { InstructionsPage } from "@/components/InstructionsPage";
import { LiftPanel } from "@/components/LiftPanel";
import { PlanSelector } from "@/components/PlanSelector";
import { SettingsPanel } from "@/components/SettingsPanel";
import { StatsDisplay } from "@/components/StatsDisplay";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentPlanAtom } from "@/store/atoms";

type AppView = "planner" | "instructions";

const getViewFromHash = (hash: string): AppView => {
  return hash === "#instructions" ? "instructions" : "planner";
};

export function App() {
  const currentPlan = useAtomValue(currentPlanAtom);
  const [view, setView] = useState<AppView>(() => {
    if (typeof window === "undefined") {
      return "planner";
    }

    return getViewFromHash(window.location.hash);
  });

  useEffect(() => {
    const handleHashChange = () => {
      setView(getViewFromHash(window.location.hash));
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const nextHash = view === "instructions" ? "#instructions" : "#planner";

    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [view]);

  return (
    <div className="min-h-screen">
      <div className="py-5 px-4 mx-auto max-w-3xl sm:py-8 sm:px-6">
        <header className="py-5 px-4 mb-8 space-y-5 border sm:px-5 rounded-[1.75rem] border-border/60 bg-card/75 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.22)] backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
            <div className="flex gap-3.5 items-center">
              <span
                className="flex justify-center items-center w-10 h-10 text-base font-black rounded-xl shadow-sm"
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
                <small className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Forma by WSYS
                </small>
              </div>
            </div>

            <div className="flex gap-2 justify-center p-1 rounded-2xl border border-border/60 bg-muted/55">
              <Button
                size="sm"
                variant={view === "planner" ? "default" : "ghost"}
                onClick={() => setView("planner")}
                className="min-w-28"
              >
                Planner
              </Button>
              <Button
                size="sm"
                variant={view === "instructions" ? "default" : "ghost"}
                onClick={() => setView("instructions")}
                className="min-w-28"
              >
                Instructions
              </Button>
            </div>
          </div>

          {view === "planner" ? (
            <PlanSelector />
          ) : (
            <div className="py-3 px-4 text-sm bg-gradient-to-r rounded-2xl border border-border/60 from-background/80 to-accent/15 text-muted-foreground">
              Built-in guide for how to use the planner and how the attempt,
              warmup, and scoring calculations work.
            </div>
          )}
        </header>

        {view === "instructions" ? (
          <InstructionsPage />
        ) : currentPlan ? (
          <div className="space-y-5">
            <SettingsPanel />
            <StatsDisplay />

            <Tabs defaultValue="squat" className="gap-4 w-full">
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
          <div className="flex justify-center items-center h-[58vh]">
            <div className="py-8 px-6 space-y-2 text-center border shadow-sm rounded-[1.5rem] border-border/60 bg-card/70 backdrop-blur-sm">
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
  );
}

export default App;
