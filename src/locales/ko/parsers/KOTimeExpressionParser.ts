import { ParsingContext } from "../../../chrono";
import { ParsingComponents } from "../../../results";
import { Meridiem } from "../../../index";
import { AbstractTimeExpressionParser } from "../../../common/parsers/AbstractTimeExpressionParser";

export default class KOTimeExpressionParser extends AbstractTimeExpressionParser {
    constructor(strictMode) {
        super(strictMode);
    }

    // don't grep anything
    followingPhase(): string {
        return "\\s*(?:\\-|–|~|〜|부터)\\s*";
    }

    // don't grep anything
    // 이 파일은 밤, 새벽, 아침, 오전, 오후를 단독으로 쓰지 않기 때문에 ?? 를 해줘야함.
    primaryPrefix(): string {
        return "(?:(?:밤|저녁|새벽|아침|오전|점심|오후)\\s*)??";
    }

    // don't grep anything
    // prettier-ignore
    primarySuffix(): string {
        return `` +
            `(?:시(\\s*(?:정각|반|[0-9]{1,2}분))?)?` +
            `(?!/)(?=\\W|$)`;
    }

    extractPrimaryTimeComponents(context: ParsingContext, match: RegExpMatchArray): null | ParsingComponents {
        const components = super.extractPrimaryTimeComponents(context, match);
        if (components) {
            const matchPrimaryPrefix = match[0].match(/(?:밤|저녁|새벽|아침|오전|점심|오후)/);
            const matchPrimarySuffix = match[0].match(/(?:시(?:\s*(정각|반|([0-9]{1,2})분))?)/);

            const hour = components.get("hour");
            const refHour = context.refDate.getHours();

            if (matchPrimaryPrefix) {
                switch (matchPrimaryPrefix[0]) {
                    case "밤":
                    case "저녁":
                        // 아침 6시 ~ 낮 12시면, 저녁을 만들기 위해 12시간 해줌
                        if (hour >= 6 && hour < 12) {
                            components.assign("hour", components.get("hour") + 12);
                            components.assign("meridiem", Meridiem.PM);
                        } else if (hour < 6) { // 아침 6시 전이면, 새벽이니까 AM 처리 해줌
                            components.assign("meridiem", Meridiem.AM);
                        }
                        break;

                    case "새벽":
                        if (hour >= 10) {
                            components.assign("hour", components.get("hour") + 12);
                            components.assign("meridiem", Meridiem.PM);
                        } else {
                            components.assign("meridiem", Meridiem.AM);
                        }
                        break;

                    case "아침":
                    case "오전":
                        components.assign("meridiem", Meridiem.AM);
                        if (hour < 12) {
                            components.assign("hour", components.get("hour"));
                        }
                        break;

                    case "점심":
                        if (hour <= 4) {
                            components.assign("meridiem", Meridiem.PM);
                        } else if (hour >= 10) {
                            components.assign("meridiem", Meridiem.AM);
                        }
                        break;

                    case "오후":
                        components.assign("meridiem", Meridiem.PM);
                        if (hour >= 0 && hour <= 6) {
                            components.assign("hour", components.get("hour") + 12);
                        }
                        break;
                }
            } else {
                // 0시-10시는 보통 오후로 취급
                // 10-12시는 보통 오전으로 취급
                if (hour >= 0 && hour < 10) {
                    components.imply("meridiem", Meridiem.PM);
                } else {
                    components.imply("meridiem", Meridiem.AM);
                }
            }

            if (matchPrimarySuffix) {
                if (matchPrimarySuffix[0].match(/시 정각/)) {
                    components.assign("minute", 0);
                } else if (matchPrimarySuffix[0].match(/시\s*반/)) {
                    components.assign("minute", 30);
                } else if (matchPrimarySuffix[0].match(/시\s*(?:[0-9]{1,2})분/)) {
                    components.assign("minute", parseInt(matchPrimarySuffix[1]));
                } else if (matchPrimarySuffix[0].match(/시/)) {
                    components.assign("minute", 0);
                }
            }
        }

        return components;
    }
}
