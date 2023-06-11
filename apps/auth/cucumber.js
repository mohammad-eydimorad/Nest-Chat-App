module.exports = {
  default: [
    '--format progress',
    '--publish-quiet',
    '--require-module ts-node/register',
    '--require ./features/**/*.ts',
    '--require ./features/*.ts',
    '--exit',
  ].join(' '),
};
