import { useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Plus, Trash } from '@phosphor-icons/react'
import { plansAtom, currentPlanIdAtom, addPlanAtom, deletePlanAtom } from '@/store/atoms'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InputDialog } from './InputDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Plan } from '@/types'

export function PlanSelector() {
  const plans = useAtomValue(plansAtom)
  const [currentPlanId, setCurrentPlanId] = useAtom(currentPlanIdAtom)
  const addPlan = useSetAtom(addPlanAtom)
  const deletePlan = useSetAtom(deletePlanAtom)

  const [newPlanDialogOpen, setNewPlanDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const currentPlan = plans.find((p: Plan) => p.id === currentPlanId)

  return (
    <>
      <div className="flex items-center gap-2">
        {plans.length > 0 ? (
          <Select value={currentPlanId || ''} onValueChange={setCurrentPlanId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan: Plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex-1 text-sm text-muted-foreground">No plans yet</div>
        )}

        <Button
          size="icon-sm"
          variant="outline"
          onClick={() => setNewPlanDialogOpen(true)}
        >
          <Plus className="size-3.5" />
        </Button>

        {currentPlan && plans.length > 0 && (
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="size-3.5" />
          </Button>
        )}
      </div>

      <InputDialog
        open={newPlanDialogOpen}
        onOpenChange={setNewPlanDialogOpen}
        onSave={(name) => {
          if (name.trim()) {
            addPlan(name.trim())
          }
        }}
        title="New Plan"
        placeholder="Plan name"
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentPlan?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (currentPlanId) {
                  deletePlan(currentPlanId)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
