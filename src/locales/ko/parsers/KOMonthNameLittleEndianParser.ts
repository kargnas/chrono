import { ParsingContext } from "../../../chrono";
import { ParsingResult } from "../../../results";
import { findYearClosestToRef } from "../../../calculation/years";
import { MONTH_DICTIONARY } from "../constants";
import { YEAR_PATTERN, parseYear } from "../constants";
import { ORDINAL_NUMBER_PATTERN, parseOrdinalNumberPattern } from "../constants";
import { matchAnyPattern } from "../../../utils/pattern";
import { AbstractParserWithWordBoundaryChecking } from "../../../common/parsers/AbstractParserWithWordBoundary";

// prettier-ignore
const PATTERN = new RegExp(
    // 월
    "(?:" +
        `(${matchAnyPattern(MONTH_DICTIONARY)})` +
    ")?" +

    // '8월' 다음에는 무조건 공백류임, 특수문자는 없음
    `(?:\\s*)?` +
    // 31일
    `(${ORDINAL_NUMBER_PATTERN})` +

    // 31일 to 1일
    `(?:` +
        `\\s{0,3}(?:\\-|부터)?\\s{0,3}` +
        `(${ORDINAL_NUMBER_PATTERN})` +
    ")?" +

    "(?=\\W|$)",
    "i"
);

const MONTH_NAME_GROUP = 1;
const DATE_GROUP = 2;
const DATE_TO_GROUP = 3;

export default class KOMonthNameLittleEndianParser extends AbstractParserWithWordBoundaryChecking {
    innerPattern(): RegExp {
        return PATTERN;
    }

    innerExtract(context: ParsingContext, match: RegExpMatchArray): ParsingResult {
        const result = context.createParsingResult(match.index, match[0]);

        if (match[MONTH_NAME_GROUP]) {
            const month = MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
            result.start.assign("month", month);
        }

        const day = parseOrdinalNumberPattern(match[DATE_GROUP]);
        result.start.assign("day", day);

        if (match[DATE_TO_GROUP]) {
            const endDate = parseOrdinalNumberPattern(match[DATE_TO_GROUP]);

            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }

        return result;
    }
}
