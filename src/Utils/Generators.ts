import { faker } from '@faker-js/faker';
import {Cat} from "../Models/Cat.model"
import {ICat, EyeColors} from "../Types/Cat.type"

export function generateCat(): ICat {
    const MyCat: ICat = Cat.getNewCat();
    return MyCat;
}

export function generateCatArray(): ICat[]{
    const radomNumber = faker.datatype.number({min:5, max:10});
    const catArray: ICat[] = [];
    for(let i = 0; i < radomNumber; i++){
        catArray.push(generateCat());
    }
    return catArray;
}