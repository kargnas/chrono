/*
  
*/

import AbstractMergeDateRangeRefiner from "../../../common/refiners/AbstractMergeDateRangeRefiner";

/**
 * Merging before and after results (see. AbstractMergeDateRangeRefiner)
 * This implementation should provide English connecting phases
 * - 2020-02-13 [tot] 2020-02-13
 * - Wednesday [-] Friday
 */
export default class KOMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner {
    patternBetween(): RegExp {
        return /^\s*(부터|-|~)\s*$/i;
    }
}
