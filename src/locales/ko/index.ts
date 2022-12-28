/**
 * Chrono components for Dutch support (*parsers*, *refiners*, and *configuration*)
 *
 * @module
 */

import { includeCommonConfiguration } from "../../configurations";
import { ParsedResult, ParsingOption } from "../../index";
import { Chrono, Configuration } from "../../chrono";
import KOMergeDateRangeRefiner from "./refiners/KOMergeDateRangeRefiner";
import KOMergeDateTimeRefiner from "./refiners/KOMergeDateTimeRefiner";
import KOCasualDateParser from "./parsers/KOCasualDateParser";
import KOCasualTimeParser from "./parsers/KOCasualTimeParser";
import SlashDateFormatParser from "../../common/parsers/SlashDateFormatParser";
import KOTimeUnitWithinFormatParser from "./parsers/KOTimeUnitWithinFormatParser";
import KOWeekdayParser from "./parsers/KOWeekdayParser";
import KOMonthNameLittleEndianParser from "./parsers/KOMonthNameLittleEndianParser";
import KOMonthNameParser from "./parsers/KOMonthNameParser";
import KOSlashMonthFormatParser from "./parsers/KOSlashMonthFormatParser";
import KOTimeExpressionParser from "./parsers/KOTimeExpressionParser";
import KOCasualYearMonthDayParser from "./parsers/KOCasualYearMonthDayParser";
import KOTimeUnitCasualRelativeFormatParser from "./parsers/KOTimeUnitCasualRelativeFormatParser";
import KORelativeDateFormatParser from "./parsers/KORelativeDateFormatParser";
import KOTimeUnitAgoFormatParser from "./parsers/KOTimeUnitAgoFormatParser";
import KOTimeUnitLaterFormatParser from "./parsers/KOTimeUnitLaterFormatParser";

// Shortcuts
export const casual = new Chrono(createCasualConfiguration());
export const strict = new Chrono(createConfiguration(true));

export function parse(text: string, ref?: Date, option?: ParsingOption): ParsedResult[] {
    return casual.parse(text, ref, option);
}

export function parseDate(text: string, ref?: Date, option?: ParsingOption): Date {
    return casual.parseDate(text, ref, option);
}

export function createCasualConfiguration(littleEndian = true): Configuration {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new KOCasualDateParser());
    option.parsers.unshift(new KOCasualTimeParser());
    option.parsers.unshift(new KOMonthNameParser());
    option.parsers.unshift(new KORelativeDateFormatParser());
    option.parsers.unshift(new KOTimeUnitCasualRelativeFormatParser());
    return option;
}

/**
 * @ignore (to be documented later)
 */
export function createConfiguration(strictMode = true, littleEndian = true): Configuration {
    return includeCommonConfiguration(
        {
            parsers: [
                new SlashDateFormatParser(littleEndian),
                new KOTimeUnitWithinFormatParser(),
                new KOMonthNameLittleEndianParser(),
                new KOMonthNameParser(),
                new KOWeekdayParser(),
                new KOCasualYearMonthDayParser(),
                new KOSlashMonthFormatParser(),
                new KOTimeExpressionParser(strictMode),
                new KOTimeUnitAgoFormatParser(strictMode),
                new KOTimeUnitLaterFormatParser(strictMode),
            ],
            refiners: [new KOMergeDateTimeRefiner(), new KOMergeDateRangeRefiner()],
        },
        strictMode
    );
}
