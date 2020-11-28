export enum CodeStates {
  IN_QUEUE = 1,
  PROCESSING,
  ACCEPTED,
  WRONG,
  TLE,
  COMPILATION_ERROR,
  RUNTIME_ERROR,
  INTERNAL_ERROR,
  CODE_ERROR,
}

export const CODE_STATES = [
  CodeStates.IN_QUEUE,
  CodeStates.PROCESSING,
  CodeStates.ACCEPTED,
  CodeStates.WRONG,
  CodeStates.TLE,
  CodeStates.COMPILATION_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.INTERNAL_ERROR,
  CodeStates.CODE_ERROR,
];
