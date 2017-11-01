import math from 'mathjs';

export const pushVector = (matrix, index, vector) => {
  const extendedMatrix = math
    .ones([
      getDimensionSize(matrix, 1),
      getDimensionSize(matrix, 2) + 1
    ])
    .valueOf();

  return extendedMatrix.map((row, rowKey) => row.map((column, columnKey) => {
    if (index === columnKey) {
      return vector[rowKey][0];
    }
    if (columnKey < index) {
      return matrix[rowKey][columnKey];
    }
    if (columnKey > index) {
      return matrix[rowKey][columnKey - 1];
    }
  }));
};

export const getMeanAsRowVector = (matrix) => {
  const n = getDimensionSize(matrix, 2);
  const vectors = Array(n).fill().map((_, i) => math.eval(`matrix[:, ${i + 1}]`, { matrix }));
  return vectors.reduce((result, vector) => result.concat(math.mean(vector)), []);
};

export const getStdAsRowVector = (matrix) => {
  const n = getDimensionSize(matrix, 2);
  const vectors = Array(n).fill().map((_, i) => math.eval(`matrix[:, ${i + 1}]`, { matrix }));
  return vectors.reduce((result, vector) => result.concat(math.std(vector)), []);
};

export const getDimensionSize = (matrix, dimension) =>
  dimension === 1
    ? matrix.length
    : matrix[0].length;