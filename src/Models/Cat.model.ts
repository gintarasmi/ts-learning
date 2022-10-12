import { faker } from '@faker-js/faker';
import mongoose, { Document, mongo, Schema } from 'mongoose';
import { ICat, EyeColors } from '../Types/Cat.type';

export const eyeColors: EyeColors[] = [
  EyeColors.Amber,
  EyeColors.Blue,
  EyeColors.Red,
  EyeColors.Green
];

export class Cat implements ICat {
  public givenName: ICat['givenName'];
  public age: ICat['age'];
  public breed: ICat['breed'];
  public weight: ICat['weight'];
  public eyeColor: ICat['eyeColor'];

  constructor(
    //  givenName?: ICat["givenName"],
    //  age?: ICat["age"],
    //  breed?: ICat["breed"],
    //  weight?: ICat["weight"],
    //  eyeColor?: ICat["eyeColor"],
    { givenName, age, breed, weight, eyeColor }: ICat
  ) {
    this.givenName = givenName;
    this.age = age;
    this.breed = breed;
    this.weight = weight;
    this.eyeColor = eyeColor;
  }
  static randomName() {
    return faker.name.firstName();
  }
  static randomBreed() {
    return faker.animal.cat();
  }
  static randomNumber(min: number, max: number) {
    return faker.datatype.number({ min: min, max: max });
  }
  static randomEyeColor() {
    return faker.helpers.arrayElement(eyeColors);
  }
  public static getNewCat = () => {
    const cat = new Cat({
      givenName: this.randomName(),
      age: this.randomNumber(0, 10),
      breed: this.randomBreed(),
      weight: this.randomNumber(1, 10),
      eyeColor: this.randomEyeColor()
    });
    // this.givenName = this.randomName();
    // this.age = this.randomNumber(0, 10);
    // this.breed = this.randomBreed();
    // this.weight = this.randomNumber(1, 10);
    // this.eyeColor = this.randomEyeColor();
    return cat;
  };
}

export interface ICatModel extends ICat, Document {}

export const CatSchema: Schema = new Schema(
  {
    givenName: { type: String, required: true },
    age: { type: Number, required: true },
    breed: { type: String, required: true },
    weight: { type: Number, required: true },
    eyeColor: { type: Object.values(EyeColors), required: true },
    deletedAt: { type: Date }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<ICatModel>('Cat', CatSchema);
