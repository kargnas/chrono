import { ParsingContext } from "../../../chrono";
import { AbstractParserWithWordBoundaryChecking } from "../../../common/parsers/AbstractParserWithWordBoundary";
import * as casualReferences from "../../../common/casualReferences";

const PATTERN = /(새벽중|이른아침|점심시간|정오|이른저녁|늦은저녁|밤늦게)(?=\W|$)/i;

export default class KOCasualTimeParser extends AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context: ParsingContext, match: RegExpMatchArray) {
        switch (match[1].toLowerCase()) {
            case "새벽중":
                return casualReferences.midnight(context.reference);
            case "이른아침":
                return casualReferences.morning(context.reference);
            case "점심시간":
            case "정오":
                return casualReferences.noon(context.reference);
            case "이른저녁":
                return casualReferences.afternoon(context.reference);
            case "늦은저녁":
            case "밤늦게":
                return casualReferences.evening(context.reference);
        }
        return null;
    }
}
