import {InvalidNodeParameterCause, OperationProperty, Visibility} from '../types.ts';
import {Parameter} from './Parameter.ts';
import {MultiplicityRange} from './MultiplicityRange.ts';
import {Validator} from '../../Validator.ts';
import {DecoratedFeature, Decorator} from './DecoratedFeature.ts';
import {FeatureWithVisibility} from './FeatureWithVisibility.ts';

/**
 * Based on chapter 9.6.4 of UML 2.5.1 specification.
 *
 * [<visibility>] <name> ‘(‘ [<parameter-list>] ‘)’ [‘:’ [<return-type>] [‘[‘ <multiplicity-range> ‘]’]
 *  [‘{‘ <oper-property> [‘,’ <oper-property> ]* '}'
 */
export class Operation implements DecoratedFeature, FeatureWithVisibility {
    name: string;
    params: Parameter[];
    visibility: Visibility|null;
    returnType: string|null;
    returnMultiplicity: MultiplicityRange|null;
    isStatic: boolean;
    isAbstract: boolean;
    properties: OperationProperty[];
    redefines: string|null;

    omitVisibility: boolean = true;

    constructor(name: string,
                params: Parameter[] = [],
                visibility: Visibility|null = null,
                returnType: string|null = null,
                returnMultiplicity: MultiplicityRange|null = null,
                isStatic: boolean = false,
                isAbstract: boolean = false,
                properties: OperationProperty[] = [],
                redefines: string|null = null) {
        this.name = name;
        this.params = params;
        this.visibility = visibility;
        this.returnType = returnType;
        this.returnMultiplicity = returnMultiplicity;
        this.isStatic = isStatic;
        this.isAbstract = isAbstract;
        this.properties = properties;
        this.redefines = redefines; // TODO: validate when connections are implemented
    }

    get prefix() {
        return this.omitVisibility ? (this.visibility ?? '') : '';
    }

    get text() {
        return this.name;
    }

    get postfix() {
        let postfix = `(${this.params.join(', ')})`;
        if (this.returnType) postfix += `: ${this.returnType}`;
        if (this.returnMultiplicity && this.returnMultiplicity.upper) postfix += `[${this.returnMultiplicity.toString()}]`;

        const props = [];
        if (this.isAbstract) props.push('abstract');
        if (this.redefines) props.push(`redefines ${this.redefines}`);

        if (this.properties.length > 0) props.push(...this.properties);

        if (props.length > 0) postfix += ` {${props.join(', ')}}`;

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
            errors.push({parameter: 'name', message: 'Name is required'});
        else if (!Validator.isAlphanumeric(this.name))
            errors.push({parameter: 'name', message: 'Name must be alphanumeric'});

        if (this.returnType) {
            if (this.returnType === '')
                errors.push({parameter: 'returnType', message: 'Return type is required'});
            else if (!Validator.isAlphanumeric(this.returnType))
                errors.push({parameter: 'returnType', message: 'Return type must be alphanumeric'});
        }

        this.params.forEach((param, i) => {
            const paramErrors = param.validate();
            if (paramErrors.length > 0)
                errors.push({parameter: 'params', index: i, message: 'Parameter is invalid', context: paramErrors});
        });

        if (this.returnMultiplicity) {
            const multiErrors = this.returnMultiplicity.validate();
            if (multiErrors.length > 0)
                errors.push({parameter: 'returnMultiplicity', message: 'Return multiplicity is invalid', context: multiErrors});
        }

        if ((this.properties.includes('unique') || this.properties.includes('ordered'))
            && (!this.returnMultiplicity || !this.returnMultiplicity.upper))
            errors.push({parameter: 'properties', message: 'Parameters "unique" and "ordered" requires multiplicity to be set'});

        if (this.isStatic && this.isAbstract)
            errors.push({parameter: 'isAbstract', message: 'Operation cannot be both static and abstract'});

        return errors;
    }

    clone(): Operation {
        return new Operation(
            this.name,
            this.params.map(param => param.clone()),
            this.visibility,
            this.returnType,
            this.returnMultiplicity?.clone(),
            this.isStatic,
            this.isAbstract,
            [...this.properties],
            this.redefines
        );
    }
}