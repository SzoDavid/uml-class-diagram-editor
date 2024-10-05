import {InvalidNodeParameterCause} from './types.ts';
import {Validator} from '../Validator.ts';
import {Property} from './features/Property.ts';
import {Operation} from './features/Operation.ts';
import {ANode} from './ANode.ts';

export enum ClassStereotype {
    INTERFACE = 'Interface',
    AUXILIARY = 'Auxiliary', //TODO: validate when connections are implemented
    FOCUS = 'Focus',
    IMPLEMENTATION_CLASS = 'ImplementationClass',
    METACLASS = 'Metaclass',
    TYPE = 'Type',
    UTILITY = 'Utility'
}

export class ClassNode extends ANode {
    name: string;
    properties: Property[];
    operations: Operation[];
    isNotShownPropertiesExist: boolean;
    isNotShownOperationsExist: boolean;
    hasAbstractFlag: boolean;
    private _stereotype?: ClassStereotype;

    constructor(name: string,
                x: number,
                y: number,
                properties: Property[]=[],
                operations: Operation[]=[],
                isNotShownPropertiesExist: boolean = false,
                isNotShownOperationsExist: boolean = false,
                isAbstract: boolean = false,
                stereotype?: ClassStereotype) {
        super(x, y);
        this.name = name;
        this.properties = properties;
        this.operations = operations;
        this.isNotShownPropertiesExist = isNotShownPropertiesExist;
        this.isNotShownOperationsExist = isNotShownOperationsExist;
        this.hasAbstractFlag = isAbstract;
        this._stereotype = stereotype;
    }

    public set stereotype(value: ClassStereotype|undefined) {
        this._stereotype = value;

        if (value === ClassStereotype.UTILITY) {
            this.properties.forEach(property => property.isStatic = true);
            this.operations.forEach(operation => operation.isStatic = true);
        }
    }

    public get stereotype(): ClassStereotype|undefined {
        return this._stereotype;
    }

    public get isAbstract(): boolean {
        if (this.hasAbstractFlag) return true;

        for (const operation of this.operations) {
            if (operation.isAbstract) return true;
        }
        return false;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors: InvalidNodeParameterCause[] = [];

        if (this.name === '') errors.push({parameter: 'name', message: 'error.name.required'});
        else if (!Validator.isAlphanumeric(this.name)) errors.push({parameter: 'name', message: 'error.name.alphanumeric'});

        this.properties.forEach((prop, i) => {
            const propErrors = prop.validate();
            if (propErrors.length > 0) errors.push({parameter: 'properties', index: i, message: 'error.invalid_class_property', context: propErrors});
        });

        this.operations.forEach((operation, i) => {
            const operationErrors = operation.validate();
            if (operationErrors.length > 0) errors.push({parameter: 'operations', index: i, message: 'error.operation.invalid', context: operationErrors});
        });

        return errors;
    }

    clone(): ClassNode {
        const clone = new ClassNode(
            this.name,
            this.x,
            this.y,
            this.properties.map(prop => prop.clone()),
            this.operations.map(operation => operation.clone()),
            this.isNotShownPropertiesExist,
            this.isNotShownOperationsExist,
            this.isAbstract,
            this.stereotype
        );

        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;
        clone.height = this.height;
        clone.width = this.width;

        return clone;
    }

    copy(node: ClassNode) {
        this.name = node.name;
        this.x = node.x;
        this.y = node.y;
        this.properties = node.properties.map(prop => prop.clone());
        this.operations = node.operations.map(operation => operation.clone());
        this.isNotShownPropertiesExist = node.isNotShownPropertiesExist;
        this.isNotShownOperationsExist = node.isNotShownOperationsExist;
        this.hasAbstractFlag = node.isAbstract;
        this.stereotype = node.stereotype;
    }
}