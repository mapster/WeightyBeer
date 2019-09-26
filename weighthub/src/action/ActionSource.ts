import { WeightHub } from "../WeightHub";

export interface ActionSource {
    start(weightHub: WeightHub): void;
}