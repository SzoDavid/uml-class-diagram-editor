import {Feature} from './Feature.ts';
import {InvalidNodeParameterCause} from '../types.ts';

/**
 * Member of Property and Parameter.
 *
 * Based on chapter 7.5.4.1 of UML 2.5.1 specification.
 *
 *  [ <lower> ‘..’ ] <upper>
 */
export class MultiplicityRange implements Feature {
    lower: number|null;
    upper: number|'*'|null;

    constructor(upper: number|'*'|null,
                lower: number|null = null) {
        this.lower = lower;
        this.upper = upper;
    }

    toString(): string {
        return `${this.lower ? this.lower + '..' : ''}${this.upper}`;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors: InvalidNodeParameterCause[] = [];

        if (this.upper === null || this.upper.valueOf() === '') {
            return errors;
        }

        if (isNaN(+this.upper) && this.upper !== '*')
            errors.push({parameter: 'upper', message: 'The only acceptable non-numeric value is "*"'});

        if (this.upper !== '*' && this.upper <= 0)
            errors.push({parameter: 'upper', message: 'Upper limit must be larger than 0'});

        if (this.lower !== null) {
            if (this.lower < 0)
                errors.push({parameter: 'lower', message: 'Lower limit must be at least 0'});
            if (this.upper !== '*' && this.lower >= this.upper)
                errors.push({parameter: 'lower', message: 'Lower limit must be less than upper'});
        }

        return errors;
    }

    clone(): MultiplicityRange {
        if (this.upper === null || (isNaN(+this.upper) && this.upper !== '*'))
            return new MultiplicityRange(null, null);
        return new MultiplicityRange(this.upper, this.lower);
    }
}