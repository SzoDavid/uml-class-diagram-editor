export enum Visibility {
    PRIVATE='-',
    PUBLIC='+',
    PROTECTED='#',
    PACKAGE='~'
}

export type Direction = 'in'|'out'|'inout';
export type ParameterProperty = 'ordered'|'unordered'|'unique'|'nonunique'|'sequence';

export interface StaticString {
    prefix: string;
    name: string;
    value: string;
}

export class Node {
    isSelected: boolean = false;
    isDragging: boolean = false;
    height: number = 0;

    x: number;
    y: number;
    width: number;

    constructor(x: number, y: number, width: number) {
        this.x = x;
        this.y = y;
        this.width = width;
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
    upper: number|'*'|null; // TODO: when validating null is not allowed

    constructor(upper: number|'*'|null,
                lower: number|null = null) {
        this.lower = lower;
        this.upper = upper;
    }

    toString(): string {
        return `${this.lower ? this.lower + '..' : ''}${this.upper}`;
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

    toString(): string | StaticString {
        const prefix = `${this.visibility ?? ''}${this.isDerived ? '/' : ''}`;

        let postfix = '';
        if (this.type) postfix += `: ${this.type}`;
        if (this.multiplicity && this.multiplicity.upper) postfix += `[${this.multiplicity.toString()}]`;
        if (this.defaultValue) postfix += ` = ${this.defaultValue}`;

        return this.isStatic ? {
            prefix: prefix,
            name: this.name,
            value: `${prefix}${this.name}${postfix}`
        } : `${prefix}${this.name}${postfix}`;
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
    //TODO: oper-property

    constructor(name: string,
                params: Parameter[] = [],
                visibility: Visibility|null = null,
                returnType: string|null = null,
                returnMultiplicity: MultiplicityRange|null = null,
                isStatic: boolean = false) {
        this.name = name;
        this.params = params;
        this.visibility = visibility;
        this.returnType = returnType;
        this.returnMultiplicity = returnMultiplicity;
        this.isStatic = isStatic;
    }

    toString(): string | StaticString {
        const prefix = this.visibility ?? '';
        let postfix = `(${this.params.join(', ')})`;
        if (this.returnType) postfix += `: ${this.returnType}`;
        if (this.returnMultiplicity && this.returnMultiplicity.upper) postfix += `[${this.returnMultiplicity.toString()}]`;

        return this.isStatic ? {
            prefix: prefix,
            name: this.name,
            value: `${prefix}${this.name}${postfix}`
        } : `${prefix}${this.name}${postfix}`;
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
                operations: Operation[]=[],
                width: number=100) {
        super(x, y, width);
        this.name = name;
        this.properties = properties;
        this.operations = operations;
    }
}