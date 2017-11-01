import math from 'mathjs';
import csvToMatrix  from 'csv-to-array-matrix';

import {
  getDimensionSize,
  getMeanAsRowVector,
  getStdAsRowVector,
  pushVector,
} from 'mathjs-util';

csvToMatrix('./src/data.csv', init);

function init(matrix) {

  // Part 0: Preparation
  console.log('Part 0: Preparation ...\n');

  let X = math.eval('matrix[:, 1:2]', {
    matrix,
  });
  let y = math.eval('matrix[:, 3]', {
    matrix,
  });

  let m = getDimensionSize(y, 1);
  let n = getDimensionSize(y, 2);

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

  let theta = [[0], [0], [0]];
  theta = gradientDescentMulti(XNorm, y, theta, ALPHA, ITERATIONS);

  console.log('theta: ', theta);
  console.log('\n');
}

function featureNormalize(X) {
  const mu = getMeanAsRowVector(X);
  const sigma = getStdAsRowVector(X); // alternative: range

  // n = features
  const n = getDimensionSize(X, 2);
  for (let i = 0; i < n; i++) {

    let featureVector = math.eval(`X[:, ${i + 1}]`, {
      X,
    });

    let featureMeanVector = math.eval('featureVector - mu', {
      featureVector,
      mu: mu[i]
    });

    let normalizedVector = math.eval('featureMeanVector / sigma', {
      featureMeanVector,
      sigma: sigma[i],
    });

    math.eval(`X[:, ${i + 1}] = normalizedVector`, {
      X,
      normalizedVector,
    });
  }

  return { XNorm: X, mu, sigma };
}

function gradientDescentMulti(X, y, theta, ALPHA, ITERATIONS) {
  const m = getDimensionSize(y, 1);

  for (let i = 0; i < ITERATIONS; i++) {
    theta = math.eval(`theta - ALPHA / m * ((X * theta - y)' * X)'`, {
      theta,
      ALPHA,
      m,
      X,
      y,
    });
  }

  return theta;
}