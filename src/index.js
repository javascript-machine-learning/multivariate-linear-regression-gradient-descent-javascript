import math from 'mathjs';
import csvToMatrix  from 'csv-to-array-matrix';

import {
  getMeanAsRowVector,
  getStdAsRowVector,
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

  let m = y.length;

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
  XNorm = X = math.concat(math.ones([m, 1]).valueOf(), XNorm);

  const ALPHA = 0.01;
  const ITERATIONS = 400;

  let theta = [[0], [0], [0]];
  theta = gradientDescentMulti(XNorm, y, theta, ALPHA, ITERATIONS);

  console.log('theta: ', theta);
  console.log('\n');

  // Part 3: Predict Price of 1650 square meter and 3 bedroom house
  console.log('Part 3: Price Prediction ...\n');

  let normalizedHouseVector = [1, ((1650 - mu[0]) / sigma[0]), ((3 - mu[1]) / sigma[1])];
  let price = math.eval('normalizedHouseVector * theta', {
    normalizedHouseVector,
    theta,
  });

  console.log('Predicted price for a 1650 square meter and 3 bedroom house: ', price);
}

function featureNormalize(X) {
  const mu = getMeanAsRowVector(X);
  const sigma = getStdAsRowVector(X); // alternative: range

  // n = features
  const n = X[0].length;
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
  const m = y.length;

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