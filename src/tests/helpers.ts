import { InvalidNodeParameterCause } from '../utils/nodes/types.ts';

export const messages = Object.fromEntries(
    Object.entries(
        import.meta.glob('./../locales/*.json', { eager: true }),
    ).map(([key, value]) => {
        const locale = key.match(/\/([a-zA-Z]+)\.json$/i)?.[1];
        return [locale, value];
    }),
);

export function validateStringKeys(
    errors: InvalidNodeParameterCause[],
): boolean {
    let result = true;

    errors.forEach((error) =>
        Object.entries(messages).forEach((localeMessages: any) => {
            if (!result) return;

            const keys = error.message.split('.');
            let current: any = localeMessages[1];

            for (const key of keys) {
                if (current[key] === undefined) {
                    console.error(
                        `Key '${error.message}' not found in '${localeMessages[0]}'`,
                    );
                    result = false;
                    return;
                }
                current = current[key];
            }

            if (current === undefined) {
                result = false;
                return;
            }

            return;
        }),
    );

    return result;
}
