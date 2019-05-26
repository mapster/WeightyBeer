import quantize from "./quantize";
import { WeightHubPublisher } from "./publisher/WeightHubPublisher";
import { SensorSource } from "./source/SensorSource";

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

export class WeightHub {
    constructor(
        private sensorSource: SensorSource,
        private weightHubPublisher: WeightHubPublisher
    ) { }

    run() {
        this.sensorSource.start(this);
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
}