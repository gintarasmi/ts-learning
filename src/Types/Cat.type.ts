import {IAnimal} from "./Animal.type"

export enum EyeColors {
    Amber,
    Blue,
    Red,
    Green,
}

export interface ICat extends IAnimal{
    breed: string,
    eyeColor: EyeColors, 
}
