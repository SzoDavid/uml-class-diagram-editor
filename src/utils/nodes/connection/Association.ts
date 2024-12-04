import {Connection} from './Connection.ts';
import {Point} from '../../types.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {MultiplicityRange} from '../features/MultiplicityRange.ts';
import {AssociationNavigability} from '../types.ts';

export class Association extends Connection {
    NODE_TYPE= 'Association';

    public associationName: string = '';
    public showOwnership: boolean = false;
    public reversedOwnership: boolean = false;

    public startName: string = '';
    public startMultiplicity: MultiplicityRange = new MultiplicityRange(null);
    public startNavigability: AssociationNavigability = AssociationNavigability.UNSPECIFIED;

    public endName: string = '';
    public endMultiplicity: MultiplicityRange = new MultiplicityRange(null);
    public endNavigability: AssociationNavigability = AssociationNavigability.UNSPECIFIED;

    constructor(points: (Point | PositionalNode)[]) {
        super(points);
    }

    clone(): Association {
        const clone = new Association([]);
        this.basicClone(clone);

        clone.associationName = this.associationName;
        clone.showOwnership = this.showOwnership;
        clone.reversedOwnership = this.reversedOwnership;

        clone.startName = this.startName;
        clone.startMultiplicity = this.startMultiplicity;
        clone.startNavigability = this.startNavigability;

        clone.endName = this.endName;
        clone.endMultiplicity = this.endMultiplicity;
        clone.endNavigability = this.endNavigability;

        return clone;
    }

    copy(node: Association): void {
        super.copy(node);

        this.associationName = node.associationName;
        this.showOwnership = node.showOwnership;
        this.reversedOwnership = node.reversedOwnership;

        this.startName = node.startName;
        this.startMultiplicity = node.startMultiplicity;
        this.startNavigability = node.startNavigability;

        this.endName = node.endName;
        this.endMultiplicity = node.endMultiplicity;
        this.endNavigability = node.endNavigability;
    }
}