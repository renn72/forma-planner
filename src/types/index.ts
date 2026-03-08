export type LiftType = 'squat' | 'bench' | 'deadlift'

export interface WarmupSet {
  id: string
  weight: string
  reps: string
  isComplete: boolean
}

export interface Attempt {
  id: string
  weight: string
  isComplete: boolean
  isGoodLift: boolean | null
}

export interface RoundData {
  id: string
  attempts: [Attempt, Attempt, Attempt]
}

export interface LiftData {
  warmups: WarmupSet[]
  rounds: RoundData[]
  hasFourthRound: boolean
  notes: string
}

export interface PlanSettings {
  bodyweight: number
  gender: 'male' | 'female'
  squatTarget: number
  benchTarget: number
  deadliftTarget: number
}

export interface Plan {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  settings: PlanSettings
  lifts: {
    squat: LiftData
    bench: LiftData
    deadlift: LiftData
  }
}

export interface AppState {
  plans: Plan[]
  currentPlanId: string | null
}
