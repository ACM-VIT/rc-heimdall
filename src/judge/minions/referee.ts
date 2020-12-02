interface refereeResponse {
  userSequence: Array<string>;
  actualSequence: Array<string>;
  points: number;
}

export const referee = (userOutput: string, actualOutput: string, maxPoints: number): refereeResponse => {
  const userSequence = userOutput
    .replace(/\n/g, ' ')
    .trim()
    .split(' ');
  const actualSequence = actualOutput
    .replace(/\n/g, ' ')
    .trim()
    .split(' ');

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

  return { userSequence, actualSequence, points };
};
