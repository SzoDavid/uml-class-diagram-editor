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
 * [’{’ <parm-property> [’,’ <parm-property>]* ’}’]
 */
export class Parameter implements Feature {
    direction: Direction|null;
    name: string;
    type: string;
    multiplicity: MultiplicityRange|null;
    defaultValue: string|null;
    properties: ParameterProperty[];

    constructor(name: string,
                type: string,
                direction: Direction|null = null,
                multiplicity: MultiplicityRange|null = null,
                defaultValue: string|null = null,
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

        value += `${this.name}: ${this.type}`;

        if (this.multiplicity && this.multiplicity.upper) value += `[${this.multiplicity.toString()}]`;
        if (this.defaultValue) value += ` = ${this.defaultValue}`;
        if (this.properties.length) value += ` {${this.properties.join(',')}}`;

        return value;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors: InvalidNodeParameterCause[] = [];

        if (this.name === '') errors.push({parameter: 'name', message: 'Name is required'});
        else if (!Validator.isAlphanumeric(this.name)) errors.push({parameter: 'name', message: 'Name must be alphanumeric'});

        if (this.type === '') errors.push({parameter: 'type', message: 'Type is required'});
        else if (!Validator.isAlphanumeric(this.type)) errors.push({parameter: 'type', message: 'Type must be alphanumeric'});

        if (this.defaultValue) {
            if (this.defaultValue === '') errors.push({parameter: 'defaultValue', message: 'Default value is required'});
            else if (!Validator.isAlphanumeric(this.defaultValue)) errors.push({parameter: 'defaultValue', message: 'Default value must be alphanumeric'});
        }

        if (this.properties.length > 1) {
            if (this.properties.includes('unique') && this.properties.includes('nonunique'))
                errors.push({parameter: 'properties', message: 'Property cannot be unique and nonunique in the same time'});
            if (this.properties.includes('ordered') && this.properties.includes('unordered'))
                errors.push({parameter: 'properties', message: 'Property cannot be ordered and unordered in the same time'});
        }

        if (this.multiplicity) {
            const multiErrors = this.multiplicity.validate();
            if (multiErrors.length > 0) errors.push({parameter: 'multiplicity', message: 'Multiplicity is invalid', context: multiErrors});
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