import math from 'mathjs';

export const getSubset = (matrix, selector) =>
  math.eval(`matrix[${selector}]`, { matrix });

export const setVector = (matrix, index, vector) =>
  matrix.map((row, rowKey) => row.map((column, columnKey) => index === columnKey ? vector[rowKey][0] : column));

export const getMeanByVector = (matrix) => {
  const n = getDimension(matrix, 2);
  const vectors = Array(n).fill().map((_, i) => getSubset(matrix, `:, ${i + 1}`));
  return vectors.reduce((result, vector) => result.concat(math.mean(vector)), []);
};

export const getStdByVector = (matrix) => {
  const n = getDimension(matrix, 2);
  const vectors = Array(n).fill().map((_, i) => getSubset(matrix, `:, ${i + 1}`));
  return vectors.reduce((result, vector) => result.concat(math.std(vector)), []);
};

export const getDimension = (matrix, dimension) =>
  dimension === 1
    ? matrix.length
    : matrix[0].length;