import { ParsingContext } from "../../../chrono";
import { ParsingComponents, ParsingResult } from "../../../results";
import dayjs from "dayjs";
import { AbstractParserWithWordBoundaryChecking } from "../../../common/parsers/AbstractParserWithWordBoundary";
import { assignSimilarDate } from "../../../utils/dayjs";
import * as references from "../../../common/casualReferences";

export default class KOCasualDateParser extends AbstractParserWithWordBoundaryChecking {
    innerPattern(context: ParsingContext): RegExp {
        return /(지금|금일|오늘|명일|낼|내일|어제|모레|이틀\s?(후|뒤)|지난\s?밤)(?=\W|$)/i;
    }

    innerExtract(context: ParsingContext, match: RegExpMatchArray): ParsingComponents | ParsingResult {
        let targetDate = dayjs(context.refDate);
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();

        switch (lowerText) {
            case "지금":
                return references.now(context.reference);

            case "금일":
            case "오늘":
                return references.today(context.reference);

            case "명일":
            case "낼":
            case "내일":
                return references.tomorrow(context.reference);

            case "어제":
                return references.yesterday(context.reference);

            case "모레":
                return references.theDayAfter(context.reference, 2);

            default:
                if (lowerText.match(/이틀\s?(후|뒤)/)) {
                    return references.theDayAfter(context.reference, 2);
                } else if (lowerText.match(/지난\s?밤/)) {
                    if (targetDate.hour() > 6) {
                        targetDate = targetDate.add(-1, "day");
                    }

                    assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }
        }

        return component;
    }
}
