module.exports = {
  'plugins': ['graphql'],
  'parser': 'babel-eslint',
  'rules': {
    'graphql/template-strings': ['error', {
      'env': 'literal',
      'schemaJsonFilepath': 'schema.json'
    }],
  },
}