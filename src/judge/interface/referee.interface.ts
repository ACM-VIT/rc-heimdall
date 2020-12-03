/**
 * Structure of response returned after evaluation by referee
 *
 * @category Judge
 */
export interface RefereeResponse {
  /** array of individual outputs obtained from submitted code */
  userSequence: Array<string>;

  /** array of actual / correct output  */
  actualSequence: Array<string>;

  /** points assigned to submission */
  points: number;
}
