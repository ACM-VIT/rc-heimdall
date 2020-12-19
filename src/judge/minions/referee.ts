import { RefereeResponse } from '../interface/referee.interface';

/**
 * **Referee**
 *
 * As the name suggests, referee is responsible for evaluating responses and assigning marks/points to teams.
 * One of the core feature of assigning points is partial marking, for which the following formula is used.
 *
 * ```
 * individualSubmissionValue = totalPoints / totalTestCases
 * ```
 *
 * - For every correct match, individualSubmissionValue is added.
 * - For every wrong match, no points are deducted.
 * - If there is an offset in the outputs, i.e. user printed `[1,3,4,5,6,7]` instead of `[1,2,3,4,5,6]`, then only one test case would pass.
 *
 * @param {string} userOutput - output from user's code
 * @param {string} actualOutput - output form correct code
 * @param {number }maxPoints  - max points possible for problem, used for partial marking

 * @category Judge
 */
export const referee = (
  userOutput: string,
  actualOutput: string,
  maxPoints: number,
  multiplier: number,
): RefereeResponse => {
  const oneToN = worker(userOutput, actualOutput, maxPoints, multiplier, false);
  const NToOne = worker(userOutput, actualOutput, maxPoints, multiplier, true);

  if (oneToN.points > NToOne.points) {
    return oneToN;
  }
  return NToOne;
};

const worker = (
  userOutput: string,
  actualOutput: string,
  maxPoints: number,
  multiplier: number,
  reverse: boolean,
): RefereeResponse => {
  const userSequence = userOutput
    .trim()
    .replace(/\r/g, '\n')
    .trim()
    .split('\n')
    .reverse()
    .map((x) => x.trim());

  if (reverse) {
    userSequence.reverse();
  }

  const actualSequence = actualOutput
    .trim()
    .replace(/\r/g, '\n')
    .trim()
    .split('\n')
    .map((x) => x.trim());

  let actualCounter = 0;
  let userCounter = 0;
  let points = 0;
  while (true) {
    if (actualCounter == actualSequence.length) break;
    if (userCounter == userSequence.length) break;

    if (actualSequence[actualCounter++] === userSequence[userCounter++]) {
      points += maxPoints / actualSequence.length;
    }
  }

  if (isNaN(multiplier)) {
    multiplier = 1;
  }

  points *= multiplier;
  points = Math.ceil(points);
  if (points > maxPoints * multiplier) {
    points = maxPoints * multiplier;
  }
  return { userSequence, actualSequence, points };
};
