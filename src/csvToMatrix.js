import csv from 'fast-csv';

let MATRIX = [];

const populateData = (delimiter = ';') => row => {
  const rowArray = row[0].split(delimiter);
  MATRIX.push(rowArray);
};

const populateEnd = callback => () =>
  callback(MATRIX);

const csvToMatrix = (path, callback, delimiter) =>
  csv
    .fromPath(path)
    .on('data', populateData(delimiter))
    .on('end', populateEnd(callback));

export default csvToMatrix;