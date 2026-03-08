import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const usageSteps = [
  {
    title: "1. Create a plan",
    body: "Start with a named plan, then set bodyweight, gender, and target numbers for squat, bench, and deadlift.",
  },
  {
    title: "2. Let the app build the session",
    body: "Each lift target generates a warmup ladder plus three rounds of attempt options automatically.",
  },
  {
    title: "3. Adjust on the platform",
    body: "Tap any warmup or attempt to edit it. Editing the middle attempt in a round shifts the lower and higher options by 2.5 kg.",
  },
  {
    title: "4. Record outcomes",
    body: "Mark attempts as good or bad. Current totals only use completed attempts marked as good lifts.",
  },
]

const attemptRounds = [
  {
    round: "Round 1",
    percents: "90%, 91%, 92%",
    note: "The middle value at 91% acts as the opener baseline for warmups.",
  },
  {
    round: "Round 2",
    percents: "95%, 96%, 97%",
    note: "This is the second-attempt ladder built from the same target.",
  },
  {
    round: "Round 3",
    percents: "99%, 100%, 102%",
    note: "This is the final planned ladder around the target lift.",
  },
]

const warmupBands = [
  {
    band: "Under 91 kg opener",
    reps: "5-7, 3-5, 1, 1, 1, then singles if extra sets exist",
  },
  {
    band: "91-181.99 kg opener",
    reps: "8-10, 4-7, 3, 2, 1-2, then singles",
  },
  {
    band: "182-272.99 kg opener",
    reps: "8-10, 5-8, 3-5, 2, 1-2, then singles",
  },
  {
    band: "273 kg+ opener",
    reps: "8-10, 8, 5, 3, 1-2, then singles",
  },
]

const scoreRules = [
  "The app scans every attempt in a lift and keeps the heaviest attempt that is both completed and marked good.",
  "Current total = best squat + best bench + best deadlift.",
  "Target total = squat target + bench target + deadlift target.",
  "DOTS and Old Wilks both multiply total weight by a bodyweight-adjusted coefficient.",
]

export function InstructionsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Instructions</CardTitle>
          <CardDescription>
            This page covers both the app workflow and the calculation logic
            behind warmups, attempts, and score tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {usageSteps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border/60 bg-gradient-to-br from-background/80 to-muted/50 p-4"
            >
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attempt Algorithm</CardTitle>
            <CardDescription>
              Targets are converted into a three-round attempt ladder.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/60 bg-muted/45 p-4">
              <div className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Rounding rule
              </div>
              <p className="mt-2 font-mono text-sm text-foreground">
                rounded = Math.round((target * percent) / 2.5) * 2.5
              </p>
            </div>

            <div className="space-y-3">
              {attemptRounds.map((round) => (
                <div
                  key={round.round}
                  className="rounded-2xl border border-border/60 bg-background/70 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{round.round}</span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {round.percents}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {round.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border/60 bg-accent/20 p-4">
              <div className="text-sm text-muted-foreground">
                If rounding would make two neighboring attempts equal, the app
                shifts the outer attempt by{" "}
                <span className="font-semibold text-foreground">2.5 kg</span> so
                the three choices stay distinct.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Warmup Algorithm</CardTitle>
            <CardDescription>
              Warmups are table-driven, not percentage-driven.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/60 bg-muted/45 p-4">
              <p className="text-sm text-muted-foreground">
                The app uses the{" "}
                <span className="font-semibold text-foreground">
                  middle attempt from round 1
                </span>{" "}
                as the opener. That is the 91% value after rounding.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Lookup rule
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                The opener is matched to the highest warmup-table row whose
                threshold is less than or equal to that opener, but still below
                the next row. The weights from that row become the warmup
                sequence.
              </p>
            </div>

            <div className="space-y-3">
              {warmupBands.map((band) => (
                <div
                  key={band.band}
                  className="rounded-2xl border border-border/60 bg-gradient-to-br from-background/85 to-secondary/20 p-4"
                >
                  <div className="font-semibold">{band.band}</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Typical rep flow: {band.reps}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fourth Round Logic</CardTitle>
            <CardDescription>
              A fourth round is optional and built from the last planned middle
              attempt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">
                When you add round 4, the app reads the{" "}
                <span className="font-semibold text-foreground">
                  middle attempt of the last round
                </span>
                , adds 2.5 kg, and creates a fresh triplet around it.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/45 p-4 font-mono text-sm text-foreground">
              round4 = [lastMiddle, lastMiddle + 2.5, lastMiddle + 5]
            </div>

            <p className="text-sm text-muted-foreground">
              In other words, the new middle attempt becomes the previous middle
              attempt plus 2.5 kg, and the lower and upper options sit 2.5 kg on
              either side of it.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scoring Fundamentals</CardTitle>
            <CardDescription>
              Current scores come from successful attempts only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {scoreRules.map((rule) => (
                <div
                  key={rule}
                  className="rounded-2xl border border-border/60 bg-gradient-to-br from-background/80 to-accent/15 p-4 text-sm text-muted-foreground"
                >
                  {rule}
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-muted/45 p-4">
                <div className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  DOTS
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Uses sex-specific polynomial coefficients with bodyweight
                  clamped to 40-210 kg for men and 40-150 kg for women, then
                  applies{" "}
                  <span className="font-mono text-foreground">
                    500 / denominator * total
                  </span>
                  .
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/45 p-4">
                <div className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Old Wilks
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Uses the legacy Wilks polynomial and clamps bodyweight to
                  40-201.9 kg for men and 26.51-154.53 kg for women before
                  applying{" "}
                  <span className="font-mono text-foreground">
                    500 / denominator * total
                  </span>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Important Behaviors</CardTitle>
          <CardDescription>
            These rules affect how the planner behaves while you edit.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
            Changing a lift target regenerates that lift&apos;s warmups and
            attempt rounds from scratch using the target algorithm.
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
            A round is treated as complete once any one of its three attempts is
            marked complete. You can clear the round to reopen it.
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
            Warmup rows only appear progressively. Empty warmup rows after the
            first hidden row stay out of view until earlier rows are filled.
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
            If bodyweight is not set, the score card stays hidden because DOTS
            and Wilks both depend on bodyweight.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
