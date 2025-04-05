import { beforeEach, describe, expect, test } from 'vitest';
import { Association } from '../../../../utils/nodes/connection/Association.ts';
import { AssociationNavigability } from '../../../../utils/nodes/types.ts';

describe('UCDE-Association', () => {
    let association: Association;

    beforeEach(() => {
        association = new Association([
            { x: 0, y: 0 },
            { x: 0, y: 5 },
            { x: 5, y: 5 },
        ]);
    });

    describe('UCDE-AS-0100-Clone', () => {
        test('UCDE-AS-0101 GIVEN valid association WHEN clone() THEN return a new instance with same values', () => {
            association.associationName = 'associationName';
            association.showOwnership = true;
            association.reversedOwnership = true;

            association.startName = 'startName';
            association.startNavigability = AssociationNavigability.NAVIGABLE;

            association.endName = 'endName';
            association.endNavigability = AssociationNavigability.UNNAVIGABLE;

            const clone = association.clone();
            expect(clone).not.toBe(association);
            expect(clone.parts).toHaveLength(2);
            expect(clone.parts[0].startPoint.x).toBe(0);
            expect(clone.parts[0].startPoint.y).toBe(0);
            expect(clone.parts[0].endPoint).toBe(clone.parts[1].startPoint);
            expect(clone.associationName).toBe('associationName');
            expect(clone.showOwnership).toBe(true);
            expect(clone.reversedOwnership).toBe(true);
            expect(clone.startName).toBe('startName');
            expect(clone.startNavigability).toBe(
                AssociationNavigability.NAVIGABLE,
            );
            expect(clone.endName).toBe('endName');
            expect(clone.endNavigability).toBe(
                AssociationNavigability.UNNAVIGABLE,
            );
        });
    });

    describe('UCDE-AS-0200-Copy', () => {
        test('UCDE-AS-0201 GIVEN another association WHEN copy() THEN copy values correctly', () => {
            const anotherAssociation = new Association([
                { x: 1, y: 1 },
                { x: 1, y: 2 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ]);

            anotherAssociation.associationName = 'associationName';
            anotherAssociation.showOwnership = true;
            anotherAssociation.reversedOwnership = true;

            anotherAssociation.startName = 'startName';
            anotherAssociation.startNavigability =
                AssociationNavigability.NAVIGABLE;

            anotherAssociation.endName = 'endName';
            anotherAssociation.endNavigability =
                AssociationNavigability.UNNAVIGABLE;

            association.copy(anotherAssociation);
            expect(association.parts).toHaveLength(3);
            expect(association.parts[0].startPoint.x).toBe(1);
            expect(association.parts[0].startPoint.y).toBe(1);
            expect(association.parts[0].endPoint).toBe(
                association.parts[1].startPoint,
            );
            expect(association.associationName).toBe('associationName');
            expect(association.showOwnership).toBe(true);
            expect(association.reversedOwnership).toBe(true);
            expect(association.startName).toBe('startName');
            expect(association.startNavigability).toBe(
                AssociationNavigability.NAVIGABLE,
            );
            expect(association.endName).toBe('endName');
            expect(association.endNavigability).toBe(
                AssociationNavigability.UNNAVIGABLE,
            );
        });
    });
});
