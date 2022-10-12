import * as yup from 'yup';
import { EyeColors } from '../Types/Cat.type';

export let catSchema = yup.object().shape({
  body: yup.object({
    givenName: yup.string().required(),
    age: yup.number().required().positive().integer(),
    breed: yup.string().required(),
    weight: yup.number().required().positive().integer(),
    eyeColor: yup
      .mixed<EyeColors>()
      .oneOf(Object.values(EyeColors) as EyeColors[])
  })
});

export let personSchema = yup.object().shape({
  body: yup.object({
    name: yup.string().required(),
    age: yup.number().required().positive().integer(),
    breed: yup.array().of(catSchema)
  })
});

export let addressSchema = yup.object().shape({
  body: yup.object({
    city: yup.string().required(),
    street: yup.string().required(),
    houseNumber: yup.string().required(),
    flatNumber: yup.string()
  })
});

export let houseSchema = yup.object().shape({
  body: yup.object({
    address: addressSchema.fields.body,
    people: yup.array().of(personSchema.fields.body)
  })
});

export let userSchema = yup.object().shape({
  body: yup.object({
    email: yup.string().email().required(),
    password: yup.string().required()
  })
});
