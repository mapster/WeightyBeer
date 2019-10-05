import { Request, Response } from "express-serve-static-core";
import { ImageRepository } from "../dao/ImageRepository";

export default class BrewImageController {
    constructor(private imageRepo: ImageRepository) {
    }

    async postImage(req: Request, res: Response) {

        if (req.files && Object.keys(req.files).length >= 0 && req.files.brewImage && !(req.files.brewImage instanceof Array)) {
            const file = req.files.brewImage;

            const image = await this.imageRepo.create(file);

            res.status(200).send(image);
            return;
        }

        res.status(400).send('No brew image was uploaded.');
        return;
    }

    getImage(req: Request, res: Response) {
        res.sendFile(this.imageRepo.getFilePath(req.params.filename));
    }
}

