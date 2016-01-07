import fs from 'fs';
import path from 'path';
import _ from 'lodash';

export default class FlowGraphQLPlugin {
  schemaPath = null;
  outputPath = null;
  fileName = 'enums.js';
  toTypes = 'data.__schema.types';
  enumTypeKind = 'ENUM';
  enumTemplate = (enumType) => {
    const values = enumType.enumValues.map(({ name, description }) => {
      return { name, description };
    });

    return `export const ${enumType.name} = ${JSON.stringify(values, null, 2)};\n`;
  };

  constructor(options) {
    if (options.schemaPath === undefined) {
      throw new Error('Must provide a path to schema.');
    }

    if (options.outputPath === undefined) {
      throw new Error('Must provide an output path.');
    }

    for (const key in options) {
      if (!this.hasOwnProperty(key)) { continue; }
      this[key] = options[key];
    }
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const schema = this._readSchema(this.schemaPath);
      const types = _.get(schema, this.toTypes);

      const output = types
        .filter((type) => type.kind === this.enumTypeKind)
        .map(this.enumTemplate)
        .join('\n');

      this._checkOutputPath(this.outputPath);

      const filePath = path.join(this.outputPath, this.fileName);

      //compilation.fileDependencies.push(filePath);
      //compilation.assets[filePath] = {
      //  source: () => output,
      //  size: () => output.length
      //};

      callback();
    });
  }

  _readSchema(path) {
    const stats = fs.statSync(path);

    if (!stats) {
      throw new Error(`Couldn't find schema at ${path}`);
    }

    if (!stats.isFile()) {
      throw new Error('Schema path isn\'t a file.');
    }

    try {
      return JSON.parse(fs.readFileSync(path));
    } catch (e) {
      console.error(`Error reading schema at ${path}`, e);
    }
  }

  _checkOutputPath(outputPath) {
    const stats = fs.statSync(outputPath);

    if (!stats) {
      throw new Error('Output path doesn\'t exist.');
    }

    if (!stats.isDirectory()) {
      throw new Error('Output path isn\'t a directory.');
    }
  }
}
