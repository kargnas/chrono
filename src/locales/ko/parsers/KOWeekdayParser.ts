import { ParsingContext } from "../../../chrono";
import { ParsingComponents } from "../../../results";
import { WEEKDAY_DICTIONARY } from "../constants";
import { matchAnyPattern } from "../../../utils/pattern";
import { AbstractParserWithWordBoundaryChecking } from "../../../common/parsers/AbstractParserWithWordBoundary";
import { createParsingComponentsAtWeekday } from "../../../common/calculation/weekdays";

const PATTERN = new RegExp(
    "(?:(지난|저번|이번|다음)\\s*주)?" +
    "(?:\\s*)?" +

    "(?:(지난|저번|이번|다음)\\s*)?" +
    `(${matchAnyPattern(WEEKDAY_DICTIONARY)})` +
    "(?=\\W|$)",
    "i"
);

const POSTFIX_GROUP = 1;
const PREFIX_GROUP = 2;
const WEEKDAY_GROUP = 3;

export default class KOWeekdayParser extends AbstractParserWithWordBoundaryChecking {
    innerPattern(): RegExp {
        return PATTERN;
    }

    innerExtract(context: ParsingContext, match: RegExpMatchArray): ParsingComponents {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const weekday = WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();

        let modifier = null;
        if (modifierWord == "지난" || modifierWord == "저번") {
            modifier = "last";
        } else if (modifierWord == "다음") {
            modifier = "next";
        } else if (modifierWord == "이번") {
            modifier = "this";
        }

        return createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    }
}
