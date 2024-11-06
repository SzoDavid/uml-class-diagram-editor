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
        if (!this.upper) return '';
        return `${this.lower !== null ? this.lower + '..' : ''}${this.upper}`;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors: InvalidNodeParameterCause[] = [];

        if (this.upper === null || this.upper.valueOf() === '') {
            return errors;
        }

        if (isNaN(+this.upper) && this.upper !== '*')
            errors.push({parameter: 'upper', message: 'error.multiplicity_range.invalid_non_numeric_value'});

        if (this.upper !== '*' && this.upper <= 0)
            errors.push({parameter: 'upper', message: 'error.multiplicity_range.upper_not_larger_than_zero'});

        if (this.lower !== null) {
            if (this.lower < 0)
                errors.push({parameter: 'lower', message: 'error.multiplicity_range.lower_less_than_zero'});
            if (this.upper !== '*' && this.lower >= this.upper)
                errors.push({parameter: 'lower', message: 'error.multiplicity_range.lower_not_less_than_upper'});
        }

        return errors;
    }

    clone(): MultiplicityRange {
        if (this.upper === null || (isNaN(+this.upper) && this.upper !== '*'))
            return new MultiplicityRange(null, null);
        return new MultiplicityRange(this.upper, this.lower);
    }
}