import {InvalidNodeParameterCause, Visibility} from '../types.ts';
import {MultiplicityRange} from './MultiplicityRange.ts';
import {Validator} from '../../Validator.ts';
import {DecoratedFeature, Decorator} from './DecoratedFeature.ts';
import {FeatureWithVisibility} from './FeatureWithVisibility.ts';

/**
 * Based on chapter 9.5.4 of UML 2.5.1 specification.
 *
 * [<visibility>] [‘/’] <name> [‘:’ <prop-type>] [‘[‘ <multiplicity-range> ‘]’] [‘=’ <default>] [‘{‘ <prop-modifier >
 *  [‘,’ <prop-modifier >]* ’}
 */
export class Property implements DecoratedFeature, FeatureWithVisibility {
    visibility: Visibility|null;
    isDerived: boolean;
    name: string;
    type: string|null;
    multiplicity: MultiplicityRange|null;
    defaultValue: string|null;
    isStatic: boolean;
    // TODO: implement modifiers

    omitVisibility: boolean = true;

    constructor(name: string,
                type: string|null = null,
                visibility: Visibility|null = null,
                isDerived: boolean = false,
                multiplicity: MultiplicityRange|null = null,
                defaultValue: string|null = null,
                isStatic: boolean = false) {
        this.visibility = visibility;
        this.name = name;
        this.type = type;
        this.isDerived = isDerived;
        this.multiplicity = multiplicity;
        this.defaultValue = defaultValue;
        this.isStatic = isStatic;
    }

    get prefix(): string {
        return `${this.omitVisibility ? (this.visibility ?? '') : ''}${this.isDerived ? '/' : ''}`;
    }

    get text(): string {
        return this.name;
    }

    get postfix(): string {
        let postfix = '';
        if (this.type) postfix += `: ${this.type}`;
        if (this.multiplicity && this.multiplicity.upper) postfix += `[${this.multiplicity.toString()}]`;
        if (this.defaultValue) postfix += ` = ${this.defaultValue}`;

        return postfix;
    }

    get decorator(): Decorator {
        if (this.isStatic) return 'underline';
        return 'none';
    }

    toString(): string {
        return `${this.prefix}${this.text}${this.postfix}`;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors: InvalidNodeParameterCause[] = [];

        if (this.name === '') errors.push({parameter: 'name', message: 'Name is required'});
        else if (!Validator.isAlphanumeric(this.name)) errors.push({parameter: 'name', message: 'Name must be alphanumeric'});

        if (this.type) {
            if (this.type === '') errors.push({parameter: 'type', message: 'Type is required'});
            else if (!Validator.isAlphanumeric(this.type)) errors.push({parameter: 'type', message: 'Type must be alphanumeric'});
        }

        if (this.defaultValue) {
            if (this.defaultValue === '') errors.push({parameter: 'defaultValue', message: 'Default value is required'});
            else if (!Validator.isAlphanumeric(this.defaultValue)) errors.push({parameter: 'defaultValue', message: 'Default value must be alphanumeric'});
        }

        if (this.multiplicity) {
            const multiErrors = this.multiplicity.validate();
            if (multiErrors.length > 0) errors.push({parameter: 'multiplicity', message: 'Multiplicity is invalid', context: multiErrors});
        }

        return errors;
    }

    clone(): Property {
        return new Property(
            this.name,
            this.type,
            this.visibility,
            this.isDerived,
            this.multiplicity?.clone(),
            this.defaultValue,
            this.isStatic
        );
    }
}