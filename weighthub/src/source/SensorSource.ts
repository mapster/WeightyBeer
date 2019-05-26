import { WeightHub } from "../WeightHub";

export interface SensorSource {
    start(weightHub: WeightHub): void;
}
