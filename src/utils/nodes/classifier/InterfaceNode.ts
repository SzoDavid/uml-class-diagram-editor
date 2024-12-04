import {ClassifierNode} from './ClassifierNode.ts';
import {Property} from '../features/Property.ts';
import {Operation} from '../features/Operation.ts';

export class InterfaceNode extends ClassifierNode {
    NODE_TYPE= 'Interface';

    constructor(name: string,
                x: number,
                y: number,
                properties: Property[]=[],
                operations: Operation[]=[],
                isNotShownPropertiesExist: boolean=false,
                isNotShownOperationsExist: boolean=false) {
        super(name, x, y, properties, operations, isNotShownPropertiesExist, isNotShownOperationsExist);
    }

    public clone(): InterfaceNode {
        const clone = new InterfaceNode(
            this.name,
            this.x,
            this.y,
            this.properties.map(prop => prop.clone()),
            this.operations.map(operation => operation.clone()),
            this.isNotShownPropertiesExist,
            this.isNotShownOperationsExist
        );

        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;
        clone.height = this.height;
        clone.width = this.width;

        return clone;
    }

    public copy(node: InterfaceNode) {
        super.copy(node);
    }

    public get header(): string {
        return 'Interface';
    }
}