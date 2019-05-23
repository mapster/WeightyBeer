import { BrewRepository } from "./dao/BrewRepository";
import { ImageRepository } from "./dao/ImageRepository";

export interface RepoContext {
    brewRepo: BrewRepository,
    imageRepo: ImageRepository
}