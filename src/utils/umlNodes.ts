import {Validator} from './Validator.ts';

export enum Visibility {
    PRIVATE='-',
    PUBLIC='+',
    PROTECTED='#',
    PACKAGE='~'
}

export type Direction = 'in'|'out'|'inout';
export type ParameterProperty = 'ordered'|'unordered'|'unique'|'nonunique'|'sequence';

interface InvalidNodeParameterCause {
    parameter: string;
    message: string;
    index?: number;
    context?: InvalidNodeParameterCause[]
}

export interface StaticString {
    prefix: string;
    name: string;
    value: string;
}

export class Node {
    isSelected: boolean = false;
    isDragging: boolean = false;
    height: number = 0;
    width: number = 0;

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }
}

/**
 * Member of Property and Parameter.
 *
 * Based on chapter 7.5.4.1 of UML 2.5.1 specification.
 *
 *  [ <lower> ‘..’ ] <upper>
 */
export class MultiplicityRange {
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

        if (this.upper === null) {
            return errors;
        }

        if (this.upper !== '*' && this.upper <= 0) errors.push({parameter: 'upper', message: 'Upper limit must be larger than 0'});

        if (this.lower !== null) {
            if (this.lower < 0) errors.push({parameter: 'lower', message: 'Lower limit must be at least 0'});
            if (this.upper !== '*' && this.lower >= this.upper) errors.push({parameter: 'lower', message: 'Lower limit must be less than upper'});
        }

        return errors;
    }
}

/**
 * Based on chapter 9.5.4 of UML 2.5.1 specification.
 *
 * [<visibility>] [‘/’] <name> [‘:’ <prop-type>] [‘[‘ <multiplicity-range> ‘]’] [‘=’ <default>] [‘{‘ <prop-modifier >
 *  [‘,’ <prop-modifier >]* ’}
 */
export class Property {
    visibility: Visibility|null;
    isDerived: boolean;
    name: string;
    type: string|null;
    multiplicity: MultiplicityRange|null;
    defaultValue: string|null;
    isStatic: boolean;
    // TODO: implement modifiers

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
        return `${this.visibility ?? ''}${this.isDerived ? '/' : ''}`;
    }

    get postfix(): string {
        let postfix = '';
        if (this.type) postfix += `: ${this.type}`;
        if (this.multiplicity && this.multiplicity.upper) postfix += `[${this.multiplicity.toString()}]`;
        if (this.defaultValue) postfix += ` = ${this.defaultValue}`;

        return postfix;
    }

    toString(): string {
        return `${this.prefix}${this.name}${this.postfix}`;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors: InvalidNodeParameterCause[] = [];

        if (this.name === '') errors.push({parameter: 'name', message: 'Name is required'});
        else if (!Validator.isAlphanumeric(this.name)) errors.push({parameter: 'name', message: 'Name must be alphanumeric'});

        if (this.type) {
            if (this.type === '') errors.push({parameter: 'type', message: 'Type is required'});
            else if (!Validator.isAlphanumeric(this.type)) errors.push({parameter: 'type', message: 'Type must be alphanumeric'});
        }

        if (this.multiplicity) {
            const multiErrors = this.multiplicity.validate();
            if (multiErrors.length > 0) errors.push({parameter: 'multiplicity', message: 'Multiplicity is invalid', context: multiErrors});
        }

        return errors;
    }
}

/**
 * Member of Operation.
 *
 * Based on chapter 9.4.4 of UML 2.5.1 specification.
 *
 * [<direction>] <parameter-name> ’:’ <type-expression> [’[’<multiplicity-range>’]’] [’=’ <default>]
 * [’{’ <parm-property> [’,’ <parm-property>]* ’}’]
 */
export class Parameter {
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
        else if (!Validator.isAlphanumeric(this.type)) errors.push({parameter: 'name', message: 'Type must be alphanumeric'});

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
}

/**
 * Based on chapter 9.6.4 of UML 2.5.1 specification.
 *
 * [<visibility>] <name> ‘(‘ [<parameter-list>] ‘)’ [‘:’ [<return-type>] [‘[‘ <multiplicity-range> ‘]’]
 *  [‘{‘ <oper-property> [‘,’ <oper-property> ]* '}'
 */
export class Operation {
    visibility: Visibility|null;
    name: string;
    params: Parameter[];
    returnType: string|null;
    returnMultiplicity: MultiplicityRange|null;
    isStatic: boolean;
    isAbstract: boolean; // NOTE: at validation it can be either static or abstract
    //TODO: oper-property

    constructor(name: string,
                params: Parameter[] = [],
                visibility: Visibility|null = null,
                returnType: string|null = null,
                returnMultiplicity: MultiplicityRange|null = null,
                isStatic: boolean = false,
                isAbstract: boolean = false) {
        this.name = name;
        this.params = params;
        this.visibility = visibility;
        this.returnType = returnType;
        this.returnMultiplicity = returnMultiplicity;
        this.isStatic = isStatic;
        this.isAbstract = isAbstract;
    }

    get prefix() {
        return this.visibility ?? '';
    }

    get postfix() {
        let postfix = `(${this.params.join(', ')})`;
        if (this.returnType) postfix += `: ${this.returnType}`;
        if (this.returnMultiplicity && this.returnMultiplicity.upper) postfix += `[${this.returnMultiplicity.toString()}]`;
        if (this.isAbstract) postfix += ' {abstract}';

        return postfix;
    }

    toString(): string {
        return `${this.prefix}${this.name}${this.postfix}`;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors: InvalidNodeParameterCause[] = [];

        if (this.name === '') errors.push({parameter: 'name', message: 'Name is required'});
        else if (!Validator.isAlphanumeric(this.name)) errors.push({parameter: 'name', message: 'Name must be alphanumeric'});

        if (this.returnType) {
            if (this.returnType === '') errors.push({parameter: 'returnType', message: 'Return type is required'});
            else if (!Validator.isAlphanumeric(this.returnType)) errors.push({parameter: 'returnType', message: 'Return type must be alphanumeric'});
        }

        this.params.forEach((param, i) => {
            const paramErrors = param.validate();
            if (paramErrors.length > 0) errors.push({parameter: 'params', index: i, message: 'Parameter is invalid', context: paramErrors});
        });

        if (this.returnMultiplicity) {
            const multiErrors = this.returnMultiplicity.validate();
            if (multiErrors.length > 0) errors.push({parameter: 'returnMultiplicity', message: 'Return multiplicity is invalid', context: multiErrors});
        }

        return errors;
    }
}

export class ClassNode extends Node {
    name: string;
    properties: Property[];
    operations: Operation[];

    constructor(name: string,
                x: number,
                y: number,
                properties: Property[]=[],
                operations: Operation[]=[]) {
        super(x, y);
        this.name = name;
        this.properties = properties;
        this.operations = operations;
    }

    public isAbstract(): boolean {
        for (const operation of this.operations) {
            if (operation.isAbstract) return true;
        }
        return false;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors: InvalidNodeParameterCause[] = [];

        if (this.name === '') errors.push({parameter: 'name', message: 'Name is required'});
        else if (!Validator.isAlphanumeric(this.name)) errors.push({parameter: 'name', message: 'Name must be alphanumeric'});

        this.properties.forEach((prop, i) => {
            const propErrors = prop.validate();
            if (propErrors.length > 0) errors.push({parameter: 'properties', index: i, message: 'Property is invalid', context: propErrors});
        });

        this.operations.forEach((operation, i) => {
            const operationErrors = operation.validate();
            if (operationErrors.length > 0) errors.push({parameter: 'properties', index: i, message: 'Property is invalid', context: operationErrors});
        });

        return errors;
    }
}
