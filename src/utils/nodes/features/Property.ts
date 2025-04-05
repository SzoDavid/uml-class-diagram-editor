import {
    InvalidNodeParameterCause,
    PropertyModifier,
    Visibility,
} from '../types.ts';
import { MultiplicityRange } from './MultiplicityRange.ts';
import { Validator } from '../../Validator.ts';
import { DecoratedFeature, Decorator } from './DecoratedFeature.ts';
import { FeatureWithVisibility } from './FeatureWithVisibility.ts';

/**
 * Based on chapter 9.5.4 of UML 2.5.1 specification.
 *
 * [<visibility>] [‘/’] <name> [‘:’ <prop-type>] [‘[‘ <multiplicity-range> ‘]’] [‘=’ <default>] [‘{‘ <prop-modifier >
 *  [‘,’ <prop-modifier >]* ’}
 */
export class Property implements DecoratedFeature, FeatureWithVisibility {
    visibility: Visibility | null;
    isDerived: boolean;
    name: string;
    type: string;
    multiplicity: MultiplicityRange;
    defaultValue: string;
    isStatic: boolean;
    modifiers: PropertyModifier[]; // TODO: validate when connections are implemented
    redefines: string;
    subsets: string;

    omitVisibility = true;

    constructor(
        name: string,
        type = '',
        visibility: Visibility | null = null,
        isDerived = false,
        multiplicity: MultiplicityRange = new MultiplicityRange(null, null),
        defaultValue = '',
        isStatic = false,
        modifiers: PropertyModifier[] = [],
        redefines = '',
        subsets = '',
    ) {
        this.visibility = visibility;
        this.name = name;
        this.type = type;
        this.isDerived = isDerived;
        this.multiplicity = multiplicity;
        this.defaultValue = defaultValue;
        this.isStatic = isStatic;
        this.modifiers = modifiers;
        this.redefines = redefines;
        this.subsets = subsets;
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
        if (this.multiplicity.upper)
            postfix += `[${this.multiplicity.toString()}]`;
        if (this.defaultValue) postfix += ` = ${this.defaultValue}`;

        const mods = [];
        if (this.redefines) mods.push(`redefines ${this.redefines}`);
        if (this.subsets) mods.push(`subsets ${this.subsets}`);

        if (this.modifiers.length > 0) mods.push(...this.modifiers);

        if (mods.length > 0) postfix += ` {${mods.join(', ')}}`;

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

        if (this.name === '')
            errors.push({ parameter: 'name', message: 'error.name.required' });
        else if (!Validator.isAlphanumeric(this.name))
            errors.push({
                parameter: 'name',
                message: 'error.name.alphanumeric',
            });

        if (this.type && !Validator.isAlphanumericWithBrackets(this.type)) {
            errors.push({
                parameter: 'type',
                message: 'error.type_alphanumeric',
            });
        }

        if (
            this.defaultValue &&
            !Validator.isAlphanumericWithBrackets(this.defaultValue)
        ) {
            errors.push({
                parameter: 'defaultValue',
                message: 'error.default_value_alphanumeric',
            });
        }

        if (this.multiplicity) {
            const multiErrors = this.multiplicity.validate();
            if (multiErrors.length > 0)
                errors.push({
                    parameter: 'multiplicity',
                    message: 'error.multiplicity_range.invalid',
                    context: multiErrors,
                });
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
            this.isStatic,
            [...this.modifiers],
            this.redefines,
            this.subsets,
        );
    }

    static fromSerializable(data: any): Property {
        return new Property(
            data.name,
            data.type,
            data.visibility,
            data.isDerived,
            data.multiplicity
                ? MultiplicityRange.fromSerializable(data.multiplicity)
                : undefined,
            data.defaultValue,
            data.isStatic,
            [...data.modifiers],
            data.redefines,
            data.subsets,
        );
    }
}
