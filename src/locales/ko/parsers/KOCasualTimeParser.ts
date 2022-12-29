import { ParsingContext } from "../../../chrono";
import dayjs from "dayjs";
import { AbstractParserWithWordBoundaryChecking } from "../../../common/parsers/AbstractParserWithWordBoundary";
import * as casualReferences from "../../../common/casualReferences";

// (?!\s*\d) 는 "오후 3시"라는게 있을 때 거기 잡히지 않도록 한다. (이 파일은 오후, 밤등이 단독으로 쓰이는 것을 바람)
// 위에꺼 삭제하고, KOTimeExpressionParser 랑 겹치지 않는 단어만 한다. 오류가 너무 많아서
const PATTERN = /(자정|정오)(?!\s*\d)(?=\W|$)/i;

export default class KOCasualTimeParser extends AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context: ParsingContext, match: RegExpMatchArray) {
        let targetDate = dayjs(context.refDate);
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();

        if (!match[1]) {
            return null;
        }

        switch (match[1].toLowerCase()) {
            case "자정":
                return casualReferences.midnight(context.reference);

            case "정오":
                return casualReferences.noon(context.reference);
        }
        return null;
    }
}
