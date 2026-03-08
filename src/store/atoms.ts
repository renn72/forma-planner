import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { Plan, AppState, WarmupSet, RoundData, LiftData } from '@/types'
import { generateId, generateAttempts, generateWarmups } from '@/lib/helpers'

const createEmptyWarmups = (): WarmupSet[] => {
  return Array.from({ length: 8 }, () => ({
    id: generateId(),
    weight: '',
    reps: '',
    isComplete: false,
  }))
}

const createRound = (weights: (number | undefined)[]): RoundData => ({
  id: generateId(),
  attempts: [
    { id: generateId(), weight: weights[0]?.toString() || '', isComplete: false, isGoodLift: null },
    { id: generateId(), weight: weights[1]?.toString() || '', isComplete: false, isGoodLift: null },
    { id: generateId(), weight: weights[2]?.toString() || '', isComplete: false, isGoodLift: null },
  ],
})

export const createLiftDataFromTarget = (targetWeight: number): LiftData => {
  if (!targetWeight || targetWeight <= 0) {
    return {
      warmups: createEmptyWarmups(),
      rounds: [
        createRound([0, 0, 0]),
        createRound([0, 0, 0]),
        createRound([0, 0, 0]),
      ],
      hasFourthRound: false,
      notes: '',
    }
  }

  const attempts = generateAttempts(targetWeight)
  const warmups = generateWarmups(attempts[1])

  return {
    warmups: warmups.map((w) => ({
      id: generateId(),
      weight: w.weight.toString(),
      reps: w.reps,
      isComplete: false,
    })),
    rounds: [
      createRound([attempts[0], attempts[1], attempts[2]]),
      createRound([attempts[3], attempts[4], attempts[5]]),
      createRound([attempts[6], attempts[7], attempts[8]]),
    ],
    hasFourthRound: false,
    notes: '',
  }
}

export const createDefaultPlan = (name: string = 'New Plan'): Plan => {
  const emptyLiftData: LiftData = {
    warmups: createEmptyWarmups(),
    rounds: [
      createRound([0, 0, 0]),
      createRound([0, 0, 0]),
      createRound([0, 0, 0]),
    ],
    hasFourthRound: false,
    notes: '',
  }

  return {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      bodyweight: 0,
      gender: 'male',
      squatTarget: 0,
      benchTarget: 0,
      deadliftTarget: 0,
    },
    lifts: {
      squat: emptyLiftData,
      bench: emptyLiftData,
      deadlift: emptyLiftData,
    },
  }
}

const defaultState: AppState = {
  plans: [],
  currentPlanId: null,
}

export const appStateAtom = atomWithStorage<AppState>('pl-planner-state', defaultState)

export const plansAtom = atom(
  (get) => get(appStateAtom).plans,
  (get, set, newPlans: Plan[]) => {
    const current = get(appStateAtom)
    set(appStateAtom, { ...current, plans: newPlans })
  },
)

export const currentPlanIdAtom = atom(
  (get) => get(appStateAtom).currentPlanId,
  (get, set, newId: string | null) => {
    const current = get(appStateAtom)
    set(appStateAtom, { ...current, currentPlanId: newId })
  },
)

export const currentPlanAtom = atom(
  (get) => {
    const state = get(appStateAtom)
    return state.plans.find((p: Plan) => p.id === state.currentPlanId) || null
  },
  (get, set, updatedPlan: Plan) => {
    const state = get(appStateAtom)
    const newPlans = state.plans.map((p: Plan) =>
      p.id === updatedPlan.id ? { ...updatedPlan, updatedAt: new Date().toISOString() } : p,
    )
    set(appStateAtom, { ...state, plans: newPlans })
  },
)

export const addPlanAtom = atom(null, (get, set, name: string) => {
  const state = get(appStateAtom)
  const newPlan = createDefaultPlan(name)
  set(appStateAtom, {
    ...state,
    plans: [...state.plans, newPlan],
    currentPlanId: newPlan.id,
  })
})

export const deletePlanAtom = atom(null, (get, set, planId: string) => {
  const state = get(appStateAtom)
  const newPlans = state.plans.filter((p: Plan) => p.id !== planId)
  const newCurrentId =
    state.currentPlanId === planId
      ? newPlans.length > 0
        ? newPlans[0].id
        : null
      : state.currentPlanId
  set(appStateAtom, {
    ...state,
    plans: newPlans,
    currentPlanId: newCurrentId,
  })
})
