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

interface SensorData {
    weight: Weight;
    readings: number[];
    sum: number;
    calibrate: {
        readings: number[];
        sum: number;
    };
}

const TARGET_WINDOW = 100;
const TARGET_CALIBRATE_WINDOW = 2000;

export class WeightHub {
    private data: {[key: string]: SensorData} = {};

    constructor(
        private sensorSource: SensorSource,
        private actionSource: ActionSource,
        private weightHubPublisher: WeightHubPublisher
    ) { }

    run() {
        this.sensorSource.start(this);
        this.actionSource.start(this);
        
        console.log("Weighthub successfully started");
    }

    async registerSensor(reading: SensorReading): Promise<void> {
        const quantized = quantize(reading.value);

        this.data[reading.id] = {
            weight: await this.getOrCreate(reading),
            readings: [quantized],
            sum: quantized,
            calibrate: {
                readings: [quantized],
                sum: quantized
            }
        }
        
        console.log(`Registered sensor: ${reading.id}`)
    }

    async updateSensor(reading: SensorReading): Promise<void> {
        const avg = this.addReadingAndCalculateMean(reading);
        const data = this.data[reading.id];
        
        const updatedWeight = {
            ...data.weight, 
            current: avg,
            percent: this.calculatePercent(data.weight.full, data.weight.empty, avg),
        };
        data.weight = updatedWeight;

        const success = await this.weightHubPublisher.updateWeight(reading.id, updatedWeight.current, updatedWeight.percent);
        if (!success) {
            console.error(`Failed to update weight data: ${reading.id}`);
        }
    }

    private calculatePercent(full: number, empty: number, current: number): number {
        const one = full - empty;
        const part = current - empty || 1;
        const percent = Math.min(100, Math.floor((part / one) * 100));
        
        return percent;
    }

    private addReadingAndCalculateMean(reading: SensorReading): number {
        const data = this.data[reading.id];
        
        // TODO: Concider some action if length > TARGET_WINDOW
        if (data.readings.length >= TARGET_WINDOW) {
            const removed = data.readings.shift() as number;
            data.sum -= removed;
        }

        if (data.calibrate.readings.length >= TARGET_CALIBRATE_WINDOW) {
            const removed = data.calibrate.readings.shift() as number;
            data.calibrate.sum -= removed;
        }

        const quantized = quantize(reading.value);
        
        data.readings.push(quantized);
        data.sum += quantized;

        data.calibrate.readings.push(quantized);
        data.calibrate.sum += quantized;

        return Math.floor(data.sum / data.readings.length);
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

    private async getOrCreate(reading: SensorReading): Promise<Weight> {
        let weight = await this.weightHubPublisher.getWeight(reading.id);

        if (!weight) {
            await this.weightHubPublisher.createWeight(reading.id, quantize(reading.value));
            return {
                id: reading.id, 
                zero: 0,
                empty: 0,
                full: 0,
                current: 0,
                percent: 0,
            };
        }

        return weight;
    }

    private async calibrate({ id, target }: Action): Promise<void> {
        if (!id) {
            console.error(`Invalid/missing action.id: ${id}`);
            return;
        }

        const weight = this.data[id].weight;
        const calibrate = this.data[id].calibrate;

        if (['zero', 'empty', 'full'].includes(target)) {
            const average = Math.floor(calibrate.sum / calibrate.readings.length);

            weight[target] = average;
            console.log(`Calibrating '${target}' of '${id}' to: ${average}`);

            const success = await this.weightHubPublisher.set(id, target, average);
            if (!success) {
                console.error(`Failed to calibrate '${target}' of '${id}' to: ${average}`);
            }
        } else {
            console.error(`Unknown calibration target: '${target}'`);
        }
    }
}