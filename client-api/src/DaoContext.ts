import { BrewRepository } from "./dao/BrewRepository";
import { ImageRepository } from "./dao/ImageRepository";
import { TapRepository } from "./dao/TapRepository";
import { WeightRepository } from "./dao/WeightRepository";
import { ActionPublisher } from "./dao/ActionPublisher";

export interface DaoContext {
    brewRepo: BrewRepository,
    imageRepo: ImageRepository,
    tapRepo: TapRepository,
    weightRepo: WeightRepository,
    actionPublisher: ActionPublisher,
}