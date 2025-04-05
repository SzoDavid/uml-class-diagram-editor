import {
    InvalidNodeParameterCause,
    OperationProperty,
    Visibility,
} from '../types.ts';
import { Parameter } from './Parameter.ts';
import { MultiplicityRange } from './MultiplicityRange.ts';
import { Validator } from '../../Validator.ts';
import { DecoratedFeature, Decorator } from './DecoratedFeature.ts';
import { FeatureWithVisibility } from './FeatureWithVisibility.ts';
import { FeatureLine, MultilineFeature } from './MultilineFeature.ts';

/**
 * Based on chapter 9.6.4 of UML 2.5.1 specification.
 *
 * [<visibility>] <name> ‘(‘ [<parameter-list>] ‘)’ [‘:’ [<return-type>] [‘[‘ <multiplicity-range> ‘]’]
 *  [‘{‘ <oper-property> [‘,’ <oper-property> ]* '}'
 */
export class Operation
    implements DecoratedFeature, FeatureWithVisibility, MultilineFeature
{
    name: string;
    params: Parameter[];
    visibility: Visibility | null;
    returnType: string;
    returnMultiplicity: MultiplicityRange;
    isStatic: boolean;
    isAbstract: boolean;
    properties: OperationProperty[];
    redefines: string;

    omitVisibility = true;

    constructor(
        name: string,
        params: Parameter[] = [],
        visibility: Visibility | null = null,
        returnType = '',
        returnMultiplicity: MultiplicityRange = new MultiplicityRange(null),
        isStatic = false,
        isAbstract = false,
        properties: OperationProperty[] = [],
        redefines = '',
    ) {
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
        return `(${this.params.join(', ')})${this.returnText()}`;
    }

    get decorator(): Decorator {
        if (this.isStatic) return 'underline';
        return 'none';
    }

    toString(): string {
        return `${this.prefix}${this.text}${this.postfix}`;
    }

    toMultilineString(): FeatureLine[] {
        const lines = [
            {
                text: `${this.prefix}${this.text}(`,
                tabbed: false,
            },
        ];

        this.params.forEach((param, i) =>
            lines.push({
                text: `${param.toString()}${this.params.length - 1 === i ? '' : ','}`,
                tabbed: true,
            }),
        );

        lines.push({
            text: `)${this.returnText()}`,
            tabbed: false,
        });

        return lines;
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

        if (
            this.returnType &&
            !Validator.isAlphanumericWithBrackets(this.returnType)
        ) {
            errors.push({
                parameter: 'returnType',
                message: 'error.type_alphanumeric',
            });
        }

        this.params.forEach((param, i) => {
            const paramErrors = param.validate();
            if (paramErrors.length > 0)
                errors.push({
                    parameter: 'params',
                    index: i,
                    message: 'error.parameter.invalid',
                    context: paramErrors,
                });
        });

        if (this.returnMultiplicity) {
            const multiErrors = this.returnMultiplicity.validate();
            if (multiErrors.length > 0)
                errors.push({
                    parameter: 'returnMultiplicity',
                    message: 'error.multiplicity_range.invalid',
                    context: multiErrors,
                });
        }

        if (
            (this.properties.includes('unique') ||
                this.properties.includes('ordered')) &&
            !this.returnMultiplicity.upper
        )
            errors.push({
                parameter: 'properties',
                message: 'error.parameter.unique_ordered_needs_multiplicity',
            });

        if (this.isStatic && this.isAbstract)
            errors.push({
                parameter: 'isAbstract',
                message: 'error.operation.static_and_abstract',
            });

        return errors;
    }

    clone(): Operation {
        return new Operation(
            this.name,
            this.params.map((param) => param.clone()),
            this.visibility,
            this.returnType,
            this.returnMultiplicity?.clone(),
            this.isStatic,
            this.isAbstract,
            [...this.properties],
            this.redefines,
        );
    }

    returnText(): string {
        let returnText = '';

        if (this.returnType) returnText += `: ${this.returnType}`;
        if (this.returnMultiplicity.upper)
            returnText += `[${this.returnMultiplicity.toString()}]`;

        const props = [];
        if (this.isAbstract) props.push('abstract');
        if (this.redefines) props.push(`redefines ${this.redefines}`);

        if (this.properties.length > 0) props.push(...this.properties);

        if (props.length > 0) returnText += ` {${props.join(', ')}}`;

        return returnText;
    }

    static fromSerializable(data: any): Operation {
        return new Operation(
            data.name,
            data.params.map((param: any) => Parameter.fromSerializable(param)),
            data.visibility,
            data.returnType,
            data.returnMultiplicity
                ? MultiplicityRange.fromSerializable(data.returnMultiplicity)
                : undefined,
            data.isStatic,
            data.isAbstract,
            [...data.properties],
            data.redefines,
        );
    }
}
