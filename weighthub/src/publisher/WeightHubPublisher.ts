import { Weight, ActionTarget } from "../WeightHub";

export interface WeightHubPublisher {
    updateWeight(id: string, current: number, percent: number): Promise<boolean>
    createWeight(id: string, current: number): Promise<boolean>;
    getWeight(id: string): Promise<Weight | undefined>
    set(id: string, field: ActionTarget, value: number): Promise<boolean>
}
