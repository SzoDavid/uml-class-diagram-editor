import {Feature} from './Feature.ts';
import {Direction, InvalidNodeParameterCause, ParameterProperty} from '../types.ts';
import {MultiplicityRange} from './MultiplicityRange.ts';
import {Validator} from '../../Validator.ts';

/**
 * Member of Operation.
 *
 * Based on chapter 9.4.4 of UML 2.5.1 specification.
 *
 * [<direction>] <parameter-name> ’:’ <type-expression> [’[’<multiplicity-range>’]’] [’=’ <default>]
 * [’{’ <param-property> [’,’ <param-property>]* ’}’]
 */
export class Parameter implements Feature {
    direction: Direction|null;
    name: string;
    type: string;
    multiplicity: MultiplicityRange;
    defaultValue: string;
    properties: ParameterProperty[];

    constructor(name: string,
                type: string = '',
                direction: Direction|null = null,
                multiplicity: MultiplicityRange = new MultiplicityRange(null),
                defaultValue: string = '',
                properties: ParameterProperty[] = []) {
        this.direction = direction;
        this.name = name;
        this.type = type;
        this.multiplicity = multiplicity;
        this.defaultValue = defaultValue;
        this.properties = properties;
    }

    toString(): string {
        let value = '';

        if (this.direction) value += `${this.direction} `;

        value += `${this.name}`;

        if (this.type) value += `: ${this.type}`;
        if (this.multiplicity && this.multiplicity.upper) value += `[${this.multiplicity.toString()}]`;
        if (this.defaultValue) value += ` = ${this.defaultValue}`;
        if (this.properties.length) value += ` {${this.properties.join(',')}}`;

        return value;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors: InvalidNodeParameterCause[] = [];

        if (this.name === '') errors.push({parameter: 'name', message: 'error.name.required'});
        else if (!Validator.isAlphanumeric(this.name)) errors.push({parameter: 'name', message: 'error.name.alphanumeric'});

        if (this.type && !Validator.isAlphanumeric(this.type)) {
            errors.push({parameter: 'type', message: 'error.type_alphanumeric'});
        }

        if (this.defaultValue && !Validator.isAlphanumeric(this.defaultValue)) {
            errors.push({parameter: 'defaultValue', message: 'error.default_value_alphanumeric'});
        }

        if (this.properties.length > 1) {
            if (this.properties.includes('unique') && this.properties.includes('nonunique'))
                errors.push({parameter: 'properties', message: 'error.parameter.unique_nonunique'});
            if (this.properties.includes('ordered') && this.properties.includes('unordered'))
                errors.push({parameter: 'properties', message: 'error.parameter.ordered_unordered'});
        }

        if (this.multiplicity) {
            const multiErrors = this.multiplicity.validate();
            if (multiErrors.length > 0) errors.push({parameter: 'multiplicity', message: 'error.multiplicity_range.invalid', context: multiErrors});
        }

        return errors;
    }

    clone(): Parameter {
        return new Parameter(
            this.name,
            this.type,
            this.direction,
            this.multiplicity?.clone(),
            this.defaultValue,
            [...this.properties]
        );
    }
}