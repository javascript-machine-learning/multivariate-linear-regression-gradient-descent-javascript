import math from 'mathjs';
import csvToMatrix  from 'csv-to-array-matrix';

import {
  getDimension,
  getSubset,
  getMeanByVector,
  getStdByVector,
  setVector,
} from './util';

csvToMatrix('./src/data.csv', init);

function init(matrix) {

  // Part 0: Preparation
  console.log('Part 0: Preparation ...\n');

  let X = getSubset(matrix, ':, 1:2');
  let y = getSubset(matrix, ':, 3');
  let m = getDimension(y, 1);

  // Part 1: Feature Normalization
  console.log('Part 1: Feature Normalization ...\n');

  let { XNorm, mu, sigma } = featureNormalize(X);

  console.log('XNorm: ', XNorm);
  console.log('\n');
  console.log('Mean: ', mu);
  console.log('\n');
  console.log('Std: ', sigma);
  console.log('\n');
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
