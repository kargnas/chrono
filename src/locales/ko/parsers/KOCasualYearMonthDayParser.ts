import { ParsingContext } from "../../../chrono";
import { MONTH_DICTIONARY } from "../constants";
import { matchAnyPattern } from "../../../utils/pattern";
import { AbstractParserWithWordBoundaryChecking } from "../../../common/parsers/AbstractParserWithWordBoundary";

/*
    Date format with slash "/" between numbers like ENSlashDateFormatParser,
    but this parser expect year before month and date.
    - YYYY/MM/DD
    - YYYY-MM-DD
    - YYYY.MM.DD
*/
const PATTERN = new RegExp(
    `([1-2][0-9]{3})[년|\\.\\/\\-\\s]{0,2}` +
    `([1][0-2]|0?[1-9])[월\\.\\/\-\\s]{0,2}` +
    `(0?[1-9]|[1-2][0-9]|3[0-1])[일]?` +
    "(?=\\W|$)",
    "i"
);

const YEAR_NUMBER_GROUP = 1;
const MONTH_NUMBER_GROUP = 2;
const DATE_NUMBER_GROUP = 3;

export default class KOCasualYearMonthDayParser extends AbstractParserWithWordBoundaryChecking {
    innerPattern(): RegExp {
        return PATTERN;
    }

    innerExtract(context: ParsingContext, match: RegExpMatchArray) {
        const month = parseInt(match[MONTH_NUMBER_GROUP]);
        const year = parseInt(match[YEAR_NUMBER_GROUP]);
        const day = parseInt(match[DATE_NUMBER_GROUP]);

        return {
            day: day,
            month: month,
            year: year,
        };
    }
}
