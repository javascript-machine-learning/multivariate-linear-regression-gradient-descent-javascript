import math from 'mathjs';
import csvToMatrix  from 'csv-to-array-matrix';

import {
  getDimension,
  getSubset,
  getMeanByVector,
  getStdByVector,
  setVector,
  pushVector,
} from './util';

csvToMatrix('./src/data.csv', init);

function init(matrix) {

  // Part 0: Preparation
  console.log('Part 0: Preparation ...\n');

  let X = getSubset(matrix, ':, 1:2');
  let y = getSubset(matrix, ':, 3');
  let m = getDimension(y, 1);
  let n = getDimension(y, 2);

  // Part 1: Feature Normalization
  console.log('Part 1: Feature Normalization ...\n');

  let { XNorm, mu, sigma } = featureNormalize(X);

  console.log('X normalized: ', XNorm);
  console.log('\n');
  console.log('mean: ', mu);
  console.log('\n');
  console.log('std: ', sigma);
  console.log('\n');

  // Part 2: Gradient Descent
  console.log('Part 2: Gradient Descent ...\n');

  // Add Intercept Term
  XNorm = pushVector(XNorm, 0, math.ones([m, 1]).valueOf());

  const ALPHA = 0.01;
  const ITERATIONS = 400;

  let theta = math.zeros(3, 1).valueOf();
  theta = gradientDescentMulti(XNorm, y, theta, ALPHA, ITERATIONS);

  console.log('theta: ', theta);
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

function gradientDescentMulti(X, y, theta, ALPHA, ITERATIONS) {
  const m = getDimension(y, 1);

  for (let i = 0; i < ITERATIONS; i++) {
    // Octave:
    // theta = theta - ALPHA / m * ((X * theta - y)' * X)';

    theta = math.subtract(
      theta,
      math.multiply(
        (ALPHA / m),
        math.transpose(
          math.multiply(
            math.transpose(
              math.subtract(
                math.multiply(
                  X,
                  theta
                ),
                y
              )
            ),
            X
          )
        )
      )
    );
  }

  return theta;
}
