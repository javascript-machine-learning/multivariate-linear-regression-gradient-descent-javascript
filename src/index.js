import math from 'mathjs';
import csvToMatrix  from 'csv-to-array-matrix';

csvToMatrix('./src/data.csv', init, ';');

const getSubset = (matrix, selector) =>
  math.eval(`matrix[${selector}]`, { matrix });

const setVector = (matrix, index, vector) =>
  matrix.map((row, rowKey) => row.map((column, columnKey) => index === columnKey ? vector[rowKey][0] : column));

const getMeanByVector = (matrix) => {
  const n = getDimension(matrix, 2);
  const vectors = Array(n).fill().map((_, i) => getSubset(matrix, `:, ${i + 1}`));
  return vectors.reduce((result, vector) => result.concat(math.mean(vector)), []);
};

const getStdByVector = (matrix) => {
  const n = getDimension(matrix, 2);
  const vectors = Array(n).fill().map((_, i) => getSubset(matrix, `:, ${i + 1}`));
  return vectors.reduce((result, vector) => result.concat(math.std(vector)), []);
};

const getDimension = (matrix, dimension) =>
  dimension === 1
    ? matrix.length
    : matrix[0].length

function init(matrix) {
  // Part 0: Preparation

  let X = getSubset(matrix, ':, 1:2');
  let y = getSubset(matrix, ':, 3');
  let m = getDimension(y, 1);

  // Part 1: Feature Normalization

  let { XNorm, mu, sigma } = featureNormalize(X);
}

function featureNormalize(X) {
  const mu = getMeanByVector(X);
  const sigma = getStdByVector(X); // alternative: range

  // n = features
  const n = getDimension(X, 2);
  for (let i = 0; i < n; i++) {

    // take feature column by index i and subtract with mean with index i from mean vector
    let xMinusMean = math.subtract(getSubset(X, `:, ${i + 1}`), mu[i]);
    // put normalized feature column by dividing the meaned vector with the standard deviation
    let normalizedVector = math.divide(xMinusMean, sigma[i]);

    X = setVector(X, i, normalizedVector);
  }

  return { XNorm: X, mu, sigma };
}
