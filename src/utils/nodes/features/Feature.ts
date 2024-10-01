import {InvalidNodeParameterCause} from '../types.ts';

export interface Feature {
    toString(): string;
    validate(): InvalidNodeParameterCause[];
    clone(): Feature;
}