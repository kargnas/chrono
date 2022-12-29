import * as chrono from "../../src";
import { testSingleCase, testUnexpectedResult } from "../test_util";
import { Meridiem } from "../../src";

test("Test - Single Expression", () => {
    testSingleCase(chrono.ko.casual, "지금이 데드라인입니다.", new Date(2012, 7, 10, 8, 9, 10, 11), (result) => {
        expect(result.index).toBe(0);
        expect(result.text).toBe("지금");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(8);
        expect(result.start.get("minute")).toBe(9);
        expect(result.start.get("second")).toBe(10);
        expect(result.start.get("millisecond")).toBe(11);
        expect(result.start.get("timezoneOffset")).toBe(result.refDate.getTimezoneOffset() * -1);

        expect(result.start).toBeDate(result.refDate);
        expect(result.start).toBeDate(new Date(2012, 7, 10, 8, 9, 10, 11));
    });

    testSingleCase(
        chrono.ko.casual,
        "딱히 암시된 타임존은 없고, 지금이 데드라인입니다.",
        { instant: new Date(1637674343000), timezone: null },
        (result) => {
            expect(result.text).toBe("지금");
            expect(result.start).toBeDate(new Date(1637674343000));
            expect(result.start.isCertain("timezoneOffset")).toBe(false);
        }
    );

    testSingleCase(chrono.ko.casual, "오늘이 데드라인입니다.", new Date(2012, 7, 10, 14, 12), (result) => {
        expect(result.index).toBe(0);
        expect(result.text).toBe("오늘");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 14, 12));
    });

    testSingleCase(chrono.ko.casual, "내일이 데드라인입니다.", new Date(2012, 7, 10, 17, 10), (result) => {
        expect(result.index).toBe(0);
        expect(result.text).toBe("내일");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(11);

        expect(result.start).toBeDate(new Date(2012, 7, 11, 17, 10));
    });

    testSingleCase(chrono.ko.casual, "내일이 데드라인입니다.", new Date(2012, 7, 10, 1), (result) => {
        expect(result.start).toBeDate(new Date(2012, 7, 11, 1));
    });

    testSingleCase(chrono.ko.casual, "음.. 어제가 데드라인이었습니다.", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(4);
        expect(result.text).toBe("어제");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(9);

        expect(result.start).toBeDate(new Date(2012, 7, 9, 12));
    });

    testSingleCase(chrono.ko.casual, "데드라인은 지난 밤이였죠.", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(6);
        expect(result.text).toBe("지난 밤");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(9);
        expect(result.start.get("hour")).toBe(22);

        expect(result.start).toBeDate(new Date(2012, 7, 9, 22));
    });

    testSingleCase(chrono.ko.casual, "데드라인은 정오였어요.", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(6);
        expect(result.text).toBe("정오");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(12);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 12));
    });

    // "Midnight" at 0~2AM, assume it's the passed midnight
    testSingleCase(chrono.ko.casual, "데드라인은 자정이었어요.", new Date(2012, 8 - 1, 10, 1), (result) => {
        expect(result.text).toBe("자정");
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(0);
        expect(result.start.get("minute")).toBe(0);
        expect(result.start.get("second")).toBe(0);
        expect(result.start.get("millisecond")).toBe(0);
    });

    // "Midnight" at 0~2AM with forwardDate option, should be the next night
    testSingleCase(
        chrono.ko.casual,
        "데드라인은 자정이었어요.",
        new Date(2012, 8 - 1, 10, 1),
        { forwardDate: true },
        (result) => {
            expect(result.text).toBe("자정");
            expect(result.start.get("year")).toBe(2012);
            expect(result.start.get("month")).toBe(8);
            expect(result.start.get("day")).toBe(11);
            expect(result.start.get("hour")).toBe(0);
            expect(result.start.get("minute")).toBe(0);
            expect(result.start.get("second")).toBe(0);
            expect(result.start.get("millisecond")).toBe(0);
        }
    );
});

test("Test - Combined Expression", () => {
    testSingleCase(chrono.ko.casual, "데드라인은 오늘 5PM 입니다.", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(6);
        expect(result.text).toBe("오늘 5PM");

        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(17);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 17));
    });

    testSingleCase(chrono.ko.casual, "데드라인은 오늘 오후 5시입니다.", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(6);
        expect(result.text).toBe("오늘 오후 5시");

        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(17);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 17));
    });

    // 일반적으로 5시라고 하면 새벽이 아니라 오후를 뜻한다.
    testSingleCase(chrono.ko.casual, "데드라인은 오늘 5시입니다.", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(6);
        expect(result.text).toBe("오늘 5시");

        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(17);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 17));
    });

    testSingleCase(chrono.ko.casual, "아, 오늘 5시 정각에 봅시다", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(3);
        expect(result.text).toBe("오늘 5시 정각");

        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(17);
        expect(result.start.get("minute")).toBe(0);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 17, 0));
    });

    testSingleCase(chrono.ko.casual, "아, 오늘 5시 반에 봅시다", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(3);
        expect(result.text).toBe("오늘 5시 반");

        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(17);
        expect(result.start.get("minute")).toBe(30);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 17, 30));
    });

    testSingleCase(chrono.ko.casual, "아, 오늘 5시 20분에 봅시다", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(3);
        expect(result.text).toBe("오늘 5시 20분");

        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(17);
        expect(result.start.get("minute")).toBe(20);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 17, 20));
    });

    testSingleCase(chrono.ko.casual, "데드라인은 오늘 자정입니다.", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(6);
        expect(result.text).toBe("오늘 자정");

        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(0);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 0));
    });

    testSingleCase(chrono.ko.casual, "데드라인은 오늘 정오입니다.", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(6);
        expect(result.text).toBe("오늘 정오");

        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(12);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 12));
    });

    testSingleCase(chrono.ko.casual, "내일 정오에 봅시다.", new Date(2012, 8 - 1, 10, 14), (result) => {
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(11);
        expect(result.start.get("hour")).toBe(12);

        expect(result.start).toBeDate(new Date(2012, 8 - 1, 11, 12));
    });
});

test("Test - Casual date range", () => {
    testSingleCase(chrono.ko.casual, "이벤트는 오늘부터 다음 주 금요일까지에요.", new Date(2012, 7, 4, 12), (result) => {
        expect(result.index).toBe(5);
        expect(result.text).toBe("오늘부터 다음 주 금요일");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(4);
        expect(result.start.get("hour")).toBe(12);

        expect(result.start).toBeDate(new Date(2012, 7, 4, 12));

        expect(result.end).not.toBeNull();
        expect(result.end.get("year")).toBe(2012);
        expect(result.end.get("month")).toBe(8);
        expect(result.end.get("day")).toBe(10);
        expect(result.end.get("hour")).toBe(12);

        expect(result.end).toBeDate(new Date(2012, 7, 10, 12));
    });

    testSingleCase(chrono.ko.casual, "이벤트는 오늘부터 다음주 금욜까지에요.", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(5);
        expect(result.text).toBe("오늘부터 다음주 금욜");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(12);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 12));

        expect(result.end).not.toBeNull();
        expect(result.end.get("year")).toBe(2012);
        expect(result.end.get("month")).toBe(8);
        expect(result.end.get("day")).toBe(17);
        expect(result.end.get("hour")).toBe(12);

        expect(result.end).toBeDate(new Date(2012, 7, 17, 12));
    });

    testSingleCase(chrono.ko.casual, "이벤트는 오늘 - 다음 주 금요일까지", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(5);
        expect(result.text).toBe("오늘 - 다음 주 금요일");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(12);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 12));

        expect(result.end).not.toBeNull();
        expect(result.end.get("year")).toBe(2012);
        expect(result.end.get("month")).toBe(8);
        expect(result.end.get("day")).toBe(17);
        expect(result.end.get("hour")).toBe(12);

        expect(result.end).toBeDate(new Date(2012, 7, 17, 12));
    });
});

test("Test - Casual time implication", () => {
    testSingleCase(
        chrono.ko.casual,
        "오늘 아침부터 내일까지 연말 방학을 떠납니다.",
        new Date(2012, 8 - 1, 4, 12),
        (result) => {
            expect(result.text).toBe("오늘 아침부터 내일");

            expect(result.start.get("month")).toBe(8);
            expect(result.start.get("day")).toBe(4);
            expect(result.start.get("hour")).toBe(6);
            expect(result.start.isCertain("hour")).toBe(false);

            expect(result.end.get("month")).toBe(8);
            expect(result.end.get("day")).toBe(5);
            expect(result.end.get("hour")).toBe(12);
            expect(result.end.isCertain("hour")).toBe(false);
        }
    );

    testSingleCase(
        chrono.ko.casual,
        "오늘 12시 반부터 내일 오후 3시까지 연말 방학을 떠납니다.",
        new Date(2012, 8 - 1, 4, 12),
        (result) => {
            expect(result.text).toBe("오늘 12시 반부터 내일 오후 3시");

            expect(result.start.get("month")).toBe(8);
            expect(result.start.get("day")).toBe(4);
            expect(result.start.get("hour")).toBe(12);
            expect(result.start.get("minute")).toBe(30);
            expect(result.start.isCertain("hour")).toBe(true);

            expect(result.end.get("month")).toBe(8);
            expect(result.end.get("day")).toBe(5);
            expect(result.end.get("hour")).toBe(15);
            expect(result.end.isCertain("hour")).toBe(true);
        }
    );
});

test("Test - Random text", () => {
    testSingleCase(chrono.ko, "오늘 정오", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("hour")).toBe(12);
        expect(result.start.get("meridiem")).toBe(Meridiem.AM);
    });

    testSingleCase(chrono.ko, "오늘 밤 9시", new Date(2012, 1 - 1, 1, 8), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("hour")).toBe(21);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.ko, "내일 밤 9시", new Date(2012, 1 - 1, 1, 8), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(2);
        expect(result.start.get("hour")).toBe(21);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.ko, "오늘 밤 8시 정각", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("hour")).toBe(20);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.ko, "내일 4시", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("hour")).toBe(16);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(2);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.ko, "내일 오후 4시", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("hour")).toBe(16);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(2);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.ko, "내일 4시 전에", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe("내일 4시");
        expect(result.start.get("hour")).toBe(16);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(2);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.ko, "내일 오후 4시 전", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe("내일 오후 4시");
        expect(result.start.get("hour")).toBe(16);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(2);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.ko, "내일 4시 이후", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe("내일 4시");
        expect(result.start.get("hour")).toBe(16);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(2);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.ko, "목욜", (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("weekday")).toBe(4);
    });

    testSingleCase(chrono.ko, "지난 밤", new Date(2016, 10 - 1, 2), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2016);
        expect(result.start.get("month")).toBe(10);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("hour")).toBe(22);
    });

    testSingleCase(chrono.ko, "어제 정오", new Date(2016, 10 - 1, 1), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2016);
        expect(result.start.get("month")).toBe(9);
        expect(result.start.get("day")).toBe(30);
        expect(result.start.get("hour")).toBe(12);
    });

    testSingleCase(chrono.ko, "내일 정오", new Date(2016, 10 - 1, 1, 8), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2016);
        expect(result.start.get("month")).toBe(10);
        expect(result.start.get("day")).toBe(2);
        expect(result.start.get("hour")).toBe(12);
    });

    testSingleCase(chrono.ko, "오늘 오후 3시", new Date(2016, 10 - 1, 1, 8), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2016);
        expect(result.start.get("month")).toBe(10);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("hour")).toBe(15);
    });

    testSingleCase(chrono.ko.casual, "8월 12일 자정", new Date(2012, 8 - 1, 5, 15), (result) => {
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(12);
        expect(result.start.get("hour")).toBe(0);
        expect(result.start.get("minute")).toBe(0);
        expect(result.start.get("second")).toBe(0);
        expect(result.start.get("millisecond")).toBe(0);
    });
});

test("Test - Casual time with timezone", () => {
    testSingleCase(chrono.ko, "2020년 1월 1일 아침 6시 UTC", (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2020);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("hour")).toBe(6);

        expect(result.start.get("timezoneOffset")).toStrictEqual(0);
        expect(result).toBeDate(new Date("2020-01-01T06:00:00.000Z"));
    });

    testSingleCase(chrono.ko, "2020년 1월 1일 저녁 8시 KST", (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2020);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("hour")).toBe(20);

        expect(result.start.get("timezoneOffset")).toStrictEqual(540);
        expect(result).toBeDate(new Date("Wed Jan 01 2020 20:00:00 GMT+0900 (Korean Standard Time)"));
    });

    testSingleCase(chrono.ko, "2020년 1월 1일 자정 KST", (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2020);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("hour")).toBe(0);

        expect(result.start.get("timezoneOffset")).toStrictEqual(540);
        expect(result).toBeDate(new Date("Wed Jan 01 2020 00:00:00 GMT+0900 (Korean Standard Time)"));
    });
});

test("Test - Random negative text", () => {
    testUnexpectedResult(chrono.ko, "오눌");

    testUnexpectedResult(chrono.ko, "tdtmr");

    testUnexpectedResult(chrono.ko, "엊제");
});
