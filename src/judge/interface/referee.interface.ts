/**
 * Structure of response returned after evaluation by referee
 *
 * @category Judge
 */

export interface RefereeResponse {
  userSequence: Array<string>;
  actualSequence: Array<string>;
  points: number;
}
