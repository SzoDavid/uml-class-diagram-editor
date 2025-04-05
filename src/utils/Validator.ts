export const Validator = {
    isAlphanumeric(value: string): boolean {
        return /^[a-zA-Z0-9_<>]+$/.test(value);
    },

    isAlphanumericWithBrackets(value: string): boolean {
        return /^[a-zA-Z0-9_<>[\]|,.]+$/.test(value);
    },
};
