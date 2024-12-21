import { PWCResult } from "@/types";

export const createPWCMatrix = (
  imageIds: number[],
  pwcResults: PWCResult[]
) => {
  const matrix = new Array(imageIds.length)
    .fill(null)
    .map(() => new Array(imageIds.length).fill(0));

  // matrix is a pairwise comparison matrix (NxN), with each element matrix[i][j] indicates
  // the number of times image i was selected over image j in comparisons performed so far.
  for (const entry of pwcResults) {
    const i = imageIds.indexOf(entry.choice);
    const j = imageIds.indexOf(
      entry.choice === entry.image_1 ? entry.image_2 : entry.image_1
    );
    matrix[i][j] += 1;
  }

  return matrix;
};

export const convertToPwcObjects = (
  imageIds: number[],
  asapPairs: number[][]
) => {
  const newPairs = [];
  for (const pair of asapPairs) {
    const imageId1 = imageIds[pair[0]];
    const imageId2 = imageIds[pair[1]];
    newPairs.push([imageId1, imageId2]);
  }

  return newPairs;
};
