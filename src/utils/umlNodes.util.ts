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

export enum Visibility {
    PRIVATE='-',
    PUBLIC='+',
    PROTECTED='#',
    PACKAGE='~'
}

/**
 * Based on chapter 7.5.4.1 of UML 2.5.1 specification.
 *
 * <multiplicity> ::= <multiplicity-range> [ [ ‘{‘ <order-designator> [‘,’ <uniqueness-designator> ] ‘}’ ] |
 *  [ ‘{‘ <uniqueness-designator> [‘,’ <order-designator> ] ‘}’ ] ]
 */
export class Multiplicity {
    lower: number|null;
    upper: number|'*';
    orderDesignation: boolean|null;
    uniquenessDesignation: boolean|null

    constructor(upper: number|'*',
                lower: number|null = null,
                orderDesignation: boolean|null = null,
                uniquenessDesignation: boolean|null = null) {
        this.lower = lower;
        this.upper = upper;
        this.orderDesignation = orderDesignation;
        this.uniquenessDesignation = uniquenessDesignation;
    }

    toString(): string {
        let value = `[${this.lower ? this.lower + '..' : ''}${this.upper}]`;

        const designations = [];
        if (this.orderDesignation !== null) {
            designations.push(this.orderDesignation ? 'ordered' : 'unordered');
        }
        if (this.uniquenessDesignation !== null) {
            designations.push(this.uniquenessDesignation ? 'unique' : 'nonunique');
        }

        if (designations.length > 0) {
            value += ` {${designations.join(' ')}}`;
        }

        return value;
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
    multiplicity: Multiplicity|null;
    defaultValue: string|null;
    // TODO: implement modifiers

    constructor(name: string,
                type: string|null = null,
                visibility: Visibility|null = null,
                isDerived: boolean = false,
                multiplicity: Multiplicity|null = null,
                defaultValue: string|null = null) {
        this.visibility = visibility;
        this.name = name;
        this.type = type;
        this.isDerived = isDerived;
        this.multiplicity = multiplicity;
        this.defaultValue = defaultValue;
    }

    toString(): string {
        let value = `${this.visibility ?? ''}${this.isDerived ? '/' : ''}${this.name}`;

        if (this.type) value += `: ${this.type}`;
        if (this.multiplicity) value += this.multiplicity.toString();
        if (this.defaultValue) value += ` = ${this.defaultValue}`;

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
    visibility: Visibility|null;
    name: string;
    //TODO: finish
}

export interface Method {
    name: string;
    returns: string;
    visibility: Visibility;
    static: boolean;
}

export class ClassNode extends Node {
    name: string;
    properties: Property[];
    methods: Method[];

    constructor(name: string, properties: Property[], methods: Method[],  x: number, y: number, width: number) {
        super(x, y, width);
        this.name = name;
        this.properties = properties;
        this.methods = methods;
    }
}