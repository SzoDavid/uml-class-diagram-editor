import { beforeEach, describe, expect, test } from 'vitest';
import { validateStringKeys } from '../../helpers.ts';
import { CommentNode } from '../../../utils/nodes/CommentNode.ts';

describe('UCDE-CommentNode', () => {
    let commentNode: CommentNode;

    beforeEach(() => {
        commentNode = new CommentNode('Comment', 10, 20);
    });

    describe('UCDE-CON-0100-Constructor', () => {
        test('UCDE-CON-0101 GIVEN valid inputs WHEN creating CommentNode THEN properties should be set correctly', () => {
            expect(commentNode.text).toBe('Comment');
            expect(commentNode.x).toBe(10);
            expect(commentNode.y).toBe(20);
        });
    });

    describe('UCDE-CON-0200-clone', () => {
        test('UCDE-CON-0201 GIVEN valid CommentNode WHEN clone() THEN return a new instance with same values', () => {
            const clone = commentNode.clone();
            expect(clone).not.toBe(commentNode); // Ensure it's a new instance
            expect(clone.text).toBe(commentNode.text);
            expect(clone.x).toBe(commentNode.x);
            expect(clone.y).toBe(commentNode.y);
            expect(clone.width).toBe(commentNode.width);
            expect(clone.height).toBe(commentNode.height);
        });
    });

    describe('UCDE-CON-0300-copy', () => {
        test('UCDE-CON-0301 GIVEN another CommentNode WHEN copy() THEN copy values correctly', () => {
            const anotherNode = new CommentNode('Another comment', 30, 40);
            commentNode.copy(anotherNode);
            expect(commentNode.text).toBe('Another comment');
            expect(commentNode.x).toBe(30);
            expect(commentNode.y).toBe(40);
        });
    });

    describe('UCDE-CON-0400-validate', () => {
        test('UCDE-CON-0401 GIVEN valid CommentNode WHEN validate() THEN no validation error should be returned', () => {
            expect(commentNode.validate()).toHaveLength(0);
        });

        describe('UCDE-CON-0402 GIVEN invalid name WHEN validate() THEN expected valid error should be returned', () => {
            test.each([
                {
                    text: '',
                    expectedErrors: [
                        { parameter: 'text', message: 'error.comment_empty' },
                    ],
                },
            ])('UCDE-CON-0402 {text: $text}', ({ text, expectedErrors }) => {
                expect(validateStringKeys(expectedErrors)).toBe(true);

                commentNode.text = text;
                expect(commentNode.validate()).toEqual(expectedErrors);
            });
        });
    });
});
