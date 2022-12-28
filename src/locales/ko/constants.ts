import { OpUnitType, QUnitType } from "dayjs";
import { matchAnyPattern, repeatedTimeunitPattern } from "../../utils/pattern";
import { findMostLikelyADYear } from "../../calculation/years";
import { TimeUnits } from "../../utils/timeunits";
import { Weekday } from "../../index";

export const WEEKDAY_DICTIONARY: { [word: string]: Weekday } = {
    "일요일": 0,
    "(일)": 0,
    "월요일": 1,
    "(월)": 1,
    "화요일": 2,
    "(화)": 2,
    "수요일": 3,
    "(수)": 3,
    "목요일": 4,
    "(목)": 4,
    "금요일": 5,
    "(금)": 5,
    "토요일": 6,
    "(토)": 6,
};

export const FULL_MONTH_NAME_DICTIONARY: { [word: string]: number } = {
    "1월": 1,
    "2월": 2,
    "3월": 3,
    "4월": 4,
    "5월": 5,
    "6월": 6,
    "7월": 7,
    "8월": 8,
    "9월": 9,
    "10월": 10,
    "11월": 11,
    "12월": 12,
};

export const MONTH_DICTIONARY: { [word: string]: number } = {
    ...FULL_MONTH_NAME_DICTIONARY,
};

export const INTEGER_WORD_DICTIONARY: { [word: string]: number } = {
    "한": 1,
    "두": 2,
    "세": 3,
    "네": 4,
    "다섯": 5,
    "여섯": 6,
    "일곱": 7,
    "여덟": 8,
    "아홉": 9,
    "열": 10,
    "열한": 11,
    "열두": 12,
};

export const ORDINAL_WORD_DICTIONARY: { [word: string]: number } = {
    "일": 1,
    "이": 2,
    "삼": 3,
    "사": 4,
    "오": 5,
    "육": 6,
    "칠": 7,
    "팔": 8,
    "구": 9,
    "십": 10,
    "십일": 11,
    "십이": 12,
    "십삼": 13,
    "십사": 14,
    "십오": 15,
    "십육": 16,
    "십칠": 17,
    "십팔": 18,
    "십구": 19,
    "이십": 20,
    "이십일": 21,
    "이십이": 22,
    "이십삼": 23,
    "이십사": 24,
    "이십오": 25,
    "이십육": 26,
    "이십칠": 27,
    "이십팔": 28,
    "이십구": 29,
    "삼십": 30,
    "삽십일": 31,
};

export const TIME_UNIT_DICTIONARY: { [word: string]: OpUnitType | QUnitType } = {
    "초": "second",
    "분": "minute",
    "시": "hour",
    "시간": "hours",
    "일": "day",
    "주": "week",
    "달": "month",
    "개월": "months",
    "분기": "quarter",
    "년": "year",
};

//-----------------------------

export const NUMBER_PATTERN = `(?:${matchAnyPattern(
    INTEGER_WORD_DICTIONARY
)}|[0-9]+|[0-9]+\\.[0-9]+|몇)`;

export function parseNumberPattern(match: string): number {
    const num = match.toLowerCase();
    if (INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return INTEGER_WORD_DICTIONARY[num];
    } else if (num.match(/몇/)) {
        return 3;
    }

    return parseFloat(num);
}

//-----------------------------

export const ORDINAL_NUMBER_PATTERN = `(?:0?[1-9]|[1-2][0-9]|3[0-1]일?)`;
export function parseOrdinalNumberPattern(match: string): number {
    let num = match.toLowerCase();
    num = num.replace(/(?:일)$/i, "");
    return parseInt(num);
}

//-----------------------------

export const YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s{0,2}(?:기원전)|[1-2][0-9]{3}|[5-9][0-9])`;
export function parseYear(match: string): number {
    if (/기원전?/i.test(match)) {
        // Before Christ, Before Common Era
        match = match.replace(/기원전?/i, "");
        return -parseInt(match);
    }

    const rawYearNumber = parseInt(match);
    return findMostLikelyADYear(rawYearNumber);
}

//-----------------------------

const SINGLE_TIME_UNIT_PATTERN = `(${NUMBER_PATTERN})\\s{0,3}(${matchAnyPattern(TIME_UNIT_DICTIONARY)})`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");

export const TIME_UNITS_PATTERN = repeatedTimeunitPattern(`(?:(?:약)\\s{0,3})?`, SINGLE_TIME_UNIT_PATTERN);

export function parseTimeUnits(timeunitText): TimeUnits {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length).trim();
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}

function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
