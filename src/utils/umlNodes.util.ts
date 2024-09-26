export enum Visibility {
    PRIVATE='-',
    PUBLIC='+',
    PROTECTED='#',
    PACKAGE='~'
}

export type Direction = 'in'|'out'|'inout';
export type ParameterProperty = 'ordered'|'unordered'|'unique'|'nonunique'|'seq'|'sequence';

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
    private readonly _lower: number|null;
    private readonly _upper: number|'*';

    constructor(upper: number|'*',
                lower: number|null = null) {
        this._lower = lower;
        this._upper = upper;
    }

    toString(): string {
        return `${this._lower ? this._lower + '..' : ''}${this._upper}`;
    }
}

/**
 * Based on chapter 9.5.4 of UML 2.5.1 specification.
 *
 * [<visibility>] [‘/’] <name> [‘:’ <prop-type>] [‘[‘ <multiplicity-range> ‘]’] [‘=’ <default>] [‘{‘ <prop-modifier >
 *  [‘,’ <prop-modifier >]* ’}
 */
export class Property {
    private readonly _visibility: Visibility|null;
    private readonly _isDerived: boolean;
    private readonly _name: string;
    private readonly _type: string|null;
    private readonly _multiplicity: MultiplicityRange|null;
    private readonly _defaultValue: string|null;
    // TODO: implement modifiers

    constructor(name: string,
                type: string|null = null,
                visibility: Visibility|null = null,
                isDerived: boolean = false,
                multiplicity: MultiplicityRange|null = null,
                defaultValue: string|null = null) {
        this._visibility = visibility;
        this._name = name;
        this._type = type;
        this._isDerived = isDerived;
        this._multiplicity = multiplicity;
        this._defaultValue = defaultValue;
    }

    toString(): string {
        let value = `${this._visibility ?? ''}${this._isDerived ? '/' : ''}${this._name}`;

        if (this._type) value += `: ${this._type}`;
        if (this._multiplicity) value += `[${this._multiplicity.toString()}]`;
        if (this._defaultValue) value += ` = ${this._defaultValue}`;

        return value;
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
    private readonly _direction: Direction|null;
    private readonly _name: string;
    private readonly _type: string;
    private readonly _multiplicity: MultiplicityRange|null;
    private readonly _default: string|null;
    private readonly _properties: ParameterProperty[];

    constructor(name: string,
                type: string,
                direction: Direction|null = null,
                multiplicity: MultiplicityRange|null = null,
                defaultValue: string|null = null,
                properties: ParameterProperty[] = []) {
        this._direction = direction;
        this._name = name;
        this._type = type;
        this._multiplicity = multiplicity;
        this._default = defaultValue;
        this._properties = properties;
    }

    toString(): string {
        let value = '';

        if (this._direction) value += `${this._direction} `;

        value += `${this._name}: ${this._type}`;

        if (this._multiplicity) value += `[${this._multiplicity.toString()}]`;
        if (this._default) value += ` = ${this._default}`;
        if (this._properties.length) value += ` {${this._properties.join(',')}}`;

        return value;
    }
}

/**
 * Based on chapter 9.6.4 of UML 2.5.1 specification.
 *
 * [<visibility>] <name> ‘(‘ [<parameter-list>] ‘)’ [‘:’ [<return-type>] [‘[‘ <multiplicity-range> ‘]’]
 *  [‘{‘ <oper-property> [‘,’ <oper-property>
 */
export class Operation {
    private readonly _visibility: Visibility|null;
    private readonly _name: string;
    private readonly _params: Parameter[];
    private readonly _returnType: string|null;
    private readonly _returnMultiplicity: MultiplicityRange|null;
    //TODO: oper-property

    constructor(name: string,
                params: Parameter[] = [],
                visibility: Visibility|null = null,
                returnType: string|null = null,
                returnMultiplicity: MultiplicityRange|null = null) {
        this._name = name;
        this._params = params;
        this._visibility = visibility;
        this._returnType = returnType;
        this._returnMultiplicity = returnMultiplicity;
    }

    toString(): string {
        let value = `${this._visibility ?? ''}${this._name}(${this._params.join(', ')})`;
        if (this._returnType) value += `: ${this._returnType}`;
        if (this._returnMultiplicity) value += `[${this._returnMultiplicity.toString()}]`;

        return value;
    }
}

export class ClassNode extends Node {
    name: string;
    properties: Property[];
    operations: Operation[];

    constructor(name: string, properties: Property[], operations: Operation[],  x: number, y: number, width: number) {
        super(x, y, width);
        this.name = name;
        this.properties = properties;
        this.operations = operations;
    }
}