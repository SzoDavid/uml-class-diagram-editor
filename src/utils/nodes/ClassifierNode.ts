import {Node} from './Node.ts';
import {Property} from './features/Property.ts';
import {Operation} from './features/Operation.ts';
import {InvalidNodeParameterCause} from './types.ts';
import {Validator} from '../Validator.ts';

export abstract class ClassifierNode extends Node {
    name: string;
    properties: Property[];
    operations: Operation[];
    isNotShownPropertiesExist: boolean;
    isNotShownOperationsExist: boolean;

    protected constructor(name: string,
                          x: number,
                          y: number,
                          properties: Property[],
                          operations: Operation[],
                          isNotShownPropertiesExist: boolean,
                          isNotShownOperationsExist: boolean) {
        super(x, y);
        this.name = name;
        this.properties = properties;
        this.operations = operations;
        this.isNotShownPropertiesExist = isNotShownPropertiesExist;
        this.isNotShownOperationsExist = isNotShownOperationsExist;
    }

    public abstract get header(): string;

    public validate(): InvalidNodeParameterCause[] {
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

    public copy(node: ClassifierNode) {
        this.name = node.name;
        this.x = node.x;
        this.y = node.y;
        this.properties = node.properties.map(prop => prop.clone());
        this.operations = node.operations.map(operation => operation.clone());
        this.isNotShownPropertiesExist = node.isNotShownPropertiesExist;
        this.isNotShownOperationsExist = node.isNotShownOperationsExist;
    }
}