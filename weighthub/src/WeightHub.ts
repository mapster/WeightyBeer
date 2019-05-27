import quantize from "./quantize";
import { WeightHubPublisher } from "./publisher/WeightHubPublisher";
import { SensorSource } from "./source/SensorSource";
import { ActionSource } from "./action/ActionSource";

export interface Weight {
    id: string;
    zero: number;
    empty: number;
    full: number;
    current: number;
    percent: number;
}

export interface SensorReading {
    id: string;
    value: number;
}

export type ActionTarget = 'zero' | 'full' | 'empty';
export interface Action {
    id: string;
    type: 'calibrate';
    target: ActionTarget;
}

export class WeightHub {
    constructor(
        private sensorSource: SensorSource,
        private actionSource: ActionSource,
        private weightHubPublisher: WeightHubPublisher
    ) { }

    run() {
        this.sensorSource.start(this);
        this.actionSource.start(this);
    }

    async registerSensor(reading: SensorReading): Promise<void> {
        const success = await this.weightHubPublisher.createWeight(reading.id, quantize(reading.value));

        if (success) {
            console.log(`Registered sensor: ${reading.id}`)
        }
    }

    async updateSensor(reading: SensorReading): Promise<void> {
        const quantized = quantize(reading.value) || 1;

        const { current, full, empty } = await this.weightHubPublisher.getWeight(reading.id);

        const avg = Math.floor((current + quantized) / 2);
        const one = full - empty || 1;
        const part = avg - empty || 1;
        const percent = Math.min(100, Math.floor((part / one) * 100));

        const success = await this.weightHubPublisher.updateWeight(reading.id, quantized, percent);
        if (!success) {
            console.error(`Failed to update weight data: ${reading.id}`);
        }
    }

    async doAction(action: Action): Promise<void> {
        switch (action.type) {
            case 'calibrate':
                await this.calibrate(action);
                break;
            default:
                console.error(`Unknown action.type requested: '${action.type}'`);
        }
    }

    private async calibrate({ id, target }: Action): Promise<void> {
        if (!id) {
            console.error(`Invalid/missing action.id: ${id}`);
            return;
        }

        const weight = await this.weightHubPublisher.getWeight(id);

        if (['zero', 'empty', 'full'].includes(target)) {
            if (!isNaN(weight.current)) {
                console.log(`Calibrating '${target}' of '${id}' to: ${weight.current}`);
                const success = await this.weightHubPublisher.set(id, target, weight.current);
                if (!success) {
                    console.error(`Failed to calibrate '${target}' of '${id}' to: ${weight.current}`);
                }
            }
        } else {
            console.error(`Unknown calibration target: '${target}'`);
        }
    }
}