import { BrewRepository } from "./dao/BrewRepository";
import { ImageRepository } from "./dao/ImageRepository";
import { TapRepository } from "./dao/TapRepository";
import { WeightRepository } from "./dao/WeightRepository";

export interface RepoContext {
    brewRepo: BrewRepository,
    imageRepo: ImageRepository,
    tapRepo: TapRepository,
    weightRepo: WeightRepository
}