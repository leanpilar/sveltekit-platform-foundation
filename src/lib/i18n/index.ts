import en from '$lib/mocks/i18n.en.json';
import de from '$lib/mocks/i18n.de.json';

export const LOCALES = ['en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

type Dictionary = Record<string, string>;

const dictionaries: Record<Locale, Dictionary> = {
	en: en as Dictionary,
	de: de as Dictionary
};

/**
 * Narrows an arbitrary string to a supported application Locale.
 */
export function isLocale(value: string | undefined): value is Locale {
	return value !== undefined && (LOCALES as readonly string[]).includes(value);
}

/**
 * Coerces any value to a supported Locale, falling back to the default.
 */
export function toLocale(value: string | undefined): Locale {
	return isLocale(value) ? value : DEFAULT_LOCALE;
}

export type Translator = (key: string, params?: Record<string, string | number>) => string;

/**
 * Builds a translation function bound to a locale. Missing keys return the key
 * itself so gaps are visible rather than silently empty. Supports {placeholder}
 * interpolation against the provided dictionary strings.
 */
export function createTranslator(locale: Locale): Translator {
	const dict = dictionaries[locale];
	return (key, params) => {
		let value = dict[key] ?? key;
		if (params) {
			for (const [name, replacement] of Object.entries(params)) {
				value = value.replace(`{${name}}`, String(replacement));
			}
		}
		return value;
	};
}
