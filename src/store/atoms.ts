import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type {
  Attempt,
  AppState,
  LiftData,
  Plan,
  PlanSettings,
  RoundData,
  WarmupSet,
} from "@/types"
import { generateAttempts, generateId, generateWarmups } from "@/lib/helpers"

const APP_STATE_STORAGE_VERSION = "1.00"
const APP_STATE_STORAGE_KEY = `pl-planner-state-v${APP_STATE_STORAGE_VERSION}`
const LEGACY_APP_STATE_STORAGE_KEYS = ["pl-planner-state"]

const DEFAULT_WARMUP_COUNT = 8
const DEFAULT_ROUND_COUNT = 3
const MAX_ROUND_COUNT = 4

type PersistedAppState = {
  version: string
  state: AppState
}

const defaultState: AppState = {
  plans: [],
  currentPlanId: null,
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null
}

const normalizeNonEmptyString = (value: unknown, fallback: string): string => {
  return typeof value === "string" && value.trim() ? value.trim() : fallback
}

const normalizeStringValue = (
  value: unknown,
  fallback: string = ""
): string => {
  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toString()
  }

  return fallback
}

const normalizeNumber = (value: unknown, fallback: number = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return fallback
}

const normalizeNonNegativeNumber = (
  value: unknown,
  fallback: number = 0
): number => {
  return Math.max(0, normalizeNumber(value, fallback))
}

const normalizeBoolean = (
  value: unknown,
  fallback: boolean = false
): boolean => {
  return typeof value === "boolean" ? value : fallback
}

const normalizeId = (value: unknown): string => {
  return normalizeNonEmptyString(value, generateId())
}

const normalizeDate = (value: unknown, fallback: string): string => {
  return typeof value === "string" && !Number.isNaN(Date.parse(value))
    ? value
    : fallback
}

const createEmptyWarmupSet = (): WarmupSet => ({
  id: generateId(),
  weight: "",
  reps: "",
  isComplete: false,
})

const createEmptyWarmups = (): WarmupSet[] => {
  return Array.from({ length: DEFAULT_WARMUP_COUNT }, () =>
    createEmptyWarmupSet()
  )
}

const createAttempt = (weight: number | string = "0"): Attempt => ({
  id: generateId(),
  weight: typeof weight === "number" ? weight.toString() : weight,
  isComplete: false,
  isGoodLift: null,
})

const createRound = (weights: (number | undefined)[]): RoundData => ({
  id: generateId(),
  attempts: [
    createAttempt(weights[0] ?? "0"),
    createAttempt(weights[1] ?? "0"),
    createAttempt(weights[2] ?? "0"),
  ],
})

const createEmptyLiftData = (): LiftData => ({
  warmups: createEmptyWarmups(),
  rounds: [
    createRound([0, 0, 0]),
    createRound([0, 0, 0]),
    createRound([0, 0, 0]),
  ],
  hasFourthRound: false,
  notes: "",
})

const createDefaultSettings = (): PlanSettings => ({
  bodyweight: 0,
  gender: "male",
  squatTarget: 0,
  benchTarget: 0,
  deadliftTarget: 0,
})

export const createLiftDataFromTarget = (targetWeight: number): LiftData => {
  if (!targetWeight || targetWeight <= 0) {
    return createEmptyLiftData()
  }

  const attempts = generateAttempts(targetWeight)
  const warmups = generateWarmups(attempts[1])

  return {
    warmups: warmups.map((warmup) => ({
      id: generateId(),
      weight: warmup.weight.toString(),
      reps: warmup.reps,
      isComplete: false,
    })),
    rounds: [
      createRound([attempts[0], attempts[1], attempts[2]]),
      createRound([attempts[3], attempts[4], attempts[5]]),
      createRound([attempts[6], attempts[7], attempts[8]]),
    ],
    hasFourthRound: false,
    notes: "",
  }
}

export const createDefaultPlan = (name: string = "New Plan"): Plan => {
  return {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: createDefaultSettings(),
    lifts: {
      squat: createEmptyLiftData(),
      bench: createEmptyLiftData(),
      deadlift: createEmptyLiftData(),
    },
  }
}

const normalizeWarmupSet = (value: unknown): WarmupSet => {
  if (!isRecord(value)) {
    return createEmptyWarmupSet()
  }

  return {
    id: normalizeId(value.id),
    weight: normalizeStringValue(value.weight),
    reps: normalizeStringValue(value.reps),
    isComplete: normalizeBoolean(value.isComplete),
  }
}

const normalizeAttempt = (value: unknown): Attempt => {
  if (!isRecord(value)) {
    return createAttempt()
  }

  return {
    id: normalizeId(value.id),
    weight: normalizeStringValue(value.weight, "0"),
    isComplete: normalizeBoolean(value.isComplete),
    isGoodLift:
      value.isGoodLift === true || value.isGoodLift === false
        ? value.isGoodLift
        : null,
  }
}

const normalizeRound = (value: unknown): RoundData => {
  if (!isRecord(value)) {
    return createRound([0, 0, 0])
  }

  const attempts = Array.isArray(value.attempts)
    ? value.attempts.slice(0, 3).map(normalizeAttempt)
    : []

  while (attempts.length < 3) {
    attempts.push(createAttempt())
  }

  return {
    id: normalizeId(value.id),
    attempts: attempts as [Attempt, Attempt, Attempt],
  }
}

const normalizeLiftData = (value: unknown): LiftData => {
  if (!isRecord(value)) {
    return createEmptyLiftData()
  }

  const warmups = Array.isArray(value.warmups)
    ? value.warmups.slice(0, DEFAULT_WARMUP_COUNT).map(normalizeWarmupSet)
    : []

  while (warmups.length < DEFAULT_WARMUP_COUNT) {
    warmups.push(createEmptyWarmupSet())
  }

  const rounds = Array.isArray(value.rounds)
    ? value.rounds.slice(0, MAX_ROUND_COUNT).map(normalizeRound)
    : []

  while (rounds.length < DEFAULT_ROUND_COUNT) {
    rounds.push(createRound([0, 0, 0]))
  }

  const hasFourthRound =
    normalizeBoolean(value.hasFourthRound) ||
    rounds.length > DEFAULT_ROUND_COUNT

  if (hasFourthRound && rounds.length < MAX_ROUND_COUNT) {
    rounds.push(createRound([0, 0, 0]))
  }

  return {
    warmups,
    rounds: rounds.slice(
      0,
      hasFourthRound ? MAX_ROUND_COUNT : DEFAULT_ROUND_COUNT
    ),
    hasFourthRound,
    notes: normalizeStringValue(value.notes),
  }
}

const normalizePlanSettings = (value: unknown): PlanSettings => {
  if (!isRecord(value)) {
    return createDefaultSettings()
  }

  return {
    bodyweight: normalizeNonNegativeNumber(value.bodyweight),
    gender: value.gender === "female" ? "female" : "male",
    squatTarget: normalizeNonNegativeNumber(value.squatTarget),
    benchTarget: normalizeNonNegativeNumber(value.benchTarget),
    deadliftTarget: normalizeNonNegativeNumber(value.deadliftTarget),
  }
}

const normalizePlan = (
  value: unknown,
  usedIds: Set<string>,
  index: number
): Plan | null => {
  if (!isRecord(value)) {
    return null
  }

  const now = new Date().toISOString()
  const requestedId = normalizeId(value.id)
  const id = usedIds.has(requestedId) ? generateId() : requestedId
  const lifts = isRecord(value.lifts) ? value.lifts : {}

  usedIds.add(id)

  return {
    id,
    name: normalizeNonEmptyString(value.name, `Plan ${index + 1}`),
    createdAt: normalizeDate(value.createdAt, now),
    updatedAt: normalizeDate(value.updatedAt, now),
    settings: normalizePlanSettings(value.settings),
    lifts: {
      squat: normalizeLiftData(lifts.squat),
      bench: normalizeLiftData(lifts.bench),
      deadlift: normalizeLiftData(lifts.deadlift),
    },
  }
}

const normalizeAppState = (value: unknown): AppState => {
  if (!isRecord(value)) {
    return defaultState
  }

  const usedPlanIds = new Set<string>()
  const plans = Array.isArray(value.plans)
    ? value.plans
        .map((plan, index) => normalizePlan(plan, usedPlanIds, index))
        .filter((plan): plan is Plan => plan !== null)
    : []

  const requestedCurrentPlanId =
    typeof value.currentPlanId === "string" ? value.currentPlanId : null

  return {
    plans,
    currentPlanId: plans.some((plan) => plan.id === requestedCurrentPlanId)
      ? requestedCurrentPlanId
      : (plans[0]?.id ?? null),
  }
}

const parseStoredState = (rawValue: string | null): AppState | null => {
  if (!rawValue) {
    return null
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown

    if (
      isRecord(parsed) &&
      typeof parsed.version === "string" &&
      "state" in parsed
    ) {
      return parsed.version === APP_STATE_STORAGE_VERSION
        ? normalizeAppState(parsed.state)
        : null
    }

    return normalizeAppState(parsed)
  } catch {
    return null
  }
}

const serializeAppState = (state: AppState): string => {
  const payload: PersistedAppState = {
    version: APP_STATE_STORAGE_VERSION,
    state,
  }

  return JSON.stringify(payload)
}

const removeLegacyAppStateKeys = () => {
  for (const legacyKey of LEGACY_APP_STATE_STORAGE_KEYS) {
    window.localStorage.removeItem(legacyKey)
  }
}

const readPersistedAppState = (initialValue: AppState): AppState => {
  if (typeof window === "undefined") {
    return initialValue
  }

  try {
    const currentState = parseStoredState(
      window.localStorage.getItem(APP_STATE_STORAGE_KEY)
    )

    if (currentState) {
      window.localStorage.setItem(
        APP_STATE_STORAGE_KEY,
        serializeAppState(currentState)
      )
      removeLegacyAppStateKeys()
      return currentState
    }

    for (const legacyKey of LEGACY_APP_STATE_STORAGE_KEYS) {
      const legacyState = parseStoredState(
        window.localStorage.getItem(legacyKey)
      )

      if (legacyState) {
        window.localStorage.setItem(
          APP_STATE_STORAGE_KEY,
          serializeAppState(legacyState)
        )
        removeLegacyAppStateKeys()
        return legacyState
      }
    }
  } catch {
    return initialValue
  }

  return initialValue
}

const appStateStorage = {
  getItem: (_key: string, initialValue: AppState) => {
    return readPersistedAppState(initialValue)
  },
  setItem: (key: string, newValue: AppState) => {
    if (typeof window === "undefined") {
      return
    }

    try {
      const normalizedState = normalizeAppState(newValue)
      window.localStorage.setItem(key, serializeAppState(normalizedState))
      removeLegacyAppStateKeys()
    } catch {
      // Keep the app working in-memory if storage is unavailable or full.
    }
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") {
      return
    }

    try {
      window.localStorage.removeItem(key)
      removeLegacyAppStateKeys()
    } catch {
      // Keep the reset path non-fatal for storage errors too.
    }
  },
  subscribe: (
    _key: string,
    callback: (value: AppState) => void,
    initialValue: AppState
  ) => {
    if (typeof window === "undefined") {
      return undefined
    }

    const watchedKeys = new Set([
      APP_STATE_STORAGE_KEY,
      ...LEGACY_APP_STATE_STORAGE_KEYS,
    ])

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage) {
        return
      }

      if (event.key !== null && !watchedKeys.has(event.key)) {
        return
      }

      callback(readPersistedAppState(initialValue))
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  },
}

export const appStateAtom = atomWithStorage<AppState>(
  APP_STATE_STORAGE_KEY,
  defaultState,
  appStateStorage,
  { getOnInit: true }
)

export const plansAtom = atom(
  (get) => get(appStateAtom).plans,
  (get, set, newPlans: Plan[]) => {
    const current = get(appStateAtom)
    set(appStateAtom, normalizeAppState({ ...current, plans: newPlans }))
  }
)

export const currentPlanIdAtom = atom(
  (get) => get(appStateAtom).currentPlanId,
  (get, set, newId: string | null) => {
    const current = get(appStateAtom)
    set(appStateAtom, normalizeAppState({ ...current, currentPlanId: newId }))
  }
)

export const currentPlanAtom = atom(
  (get) => {
    const state = get(appStateAtom)
    return (
      state.plans.find((plan: Plan) => plan.id === state.currentPlanId) || null
    )
  },
  (get, set, updatedPlan: Plan) => {
    const state = get(appStateAtom)
    const newPlans = state.plans.map((plan: Plan) =>
      plan.id === updatedPlan.id
        ? { ...updatedPlan, updatedAt: new Date().toISOString() }
        : plan
    )
    set(appStateAtom, normalizeAppState({ ...state, plans: newPlans }))
  }
)

export const addPlanAtom = atom(null, (get, set, name: string) => {
  const state = get(appStateAtom)
  const newPlan = createDefaultPlan(name)
  set(
    appStateAtom,
    normalizeAppState({
      ...state,
      plans: [...state.plans, newPlan],
      currentPlanId: newPlan.id,
    })
  )
})

export const deletePlanAtom = atom(null, (get, set, planId: string) => {
  const state = get(appStateAtom)
  const newPlans = state.plans.filter((plan: Plan) => plan.id !== planId)
  const newCurrentId =
    state.currentPlanId === planId
      ? newPlans.length > 0
        ? newPlans[0].id
        : null
      : state.currentPlanId

  set(
    appStateAtom,
    normalizeAppState({
      ...state,
      plans: newPlans,
      currentPlanId: newCurrentId,
    })
  )
})
