import {Property} from './features/Property.ts';
import {Operation} from './features/Operation.ts';
import {ClassifierNode} from './ClassifierNode.ts';

export enum ClassStereotype {
    AUXILIARY = 'Auxiliary', //TODO: validate when connections are implemented
    FOCUS = 'Focus',
    IMPLEMENTATION_CLASS = 'ImplementationClass',
    METACLASS = 'Metaclass',
    TYPE = 'Type',
    UTILITY = 'Utility'
}

export class ClassNode extends ClassifierNode {
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
        super(name, x, y, properties, operations, isNotShownPropertiesExist, isNotShownOperationsExist);
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

    public get header(): string {
        return this._stereotype ?? '';
    }

    public get isAbstract(): boolean {
        if (this.hasAbstractFlag) return true;

        for (const operation of this.operations) {
            if (operation.isAbstract) return true;
        }
        return false;
    }

    public clone(): ClassNode {
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

    public copy(node: ClassNode) {
        super.copy(node);
        this.hasAbstractFlag = node.isAbstract;
        this.stereotype = node.stereotype;
    }
}