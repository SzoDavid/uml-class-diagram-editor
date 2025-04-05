import { describe, expect, test } from 'vitest';
import { messages } from '../helpers.ts';

function haveSameKeys(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!(key in obj2)) return false;

        if (typeof obj1[key] === 'object' && obj1[key] !== null) {
            if (!haveSameKeys(obj1[key], obj2[key])) {
                return false;
            }
        }
    }

    return true;
}

function checkLocaleKeys(messages: Record<string, any>): string[] {
    const locales = Object.keys(messages);
    const referenceLocale = messages[locales[0]];
    const errors: string[] = [];

    for (const locale of locales) {
        if (!haveSameKeys(referenceLocale, messages[locale])) {
            errors.push(
                `Locale ${locale} has different keys than the reference locale.`,
            );
        }
    }

    return errors;
}

describe('UCDE-i18n', () => {
    test('UCDE-118n-01 GIVEN all locale files are loaded WHEN comparing the keys of each locale THEN all locale files should have matching keys', () => {
        const errors = checkLocaleKeys(messages);

        expect(errors).toHaveLength(0);
    });
});
