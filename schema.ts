import { gql } from 'apollo-server-express';
import { readFileSync } from 'fs';
const typeDefs = readFileSync(require.resolve('./schema.gql')).toString(
  'utf-8'
);
const schema = gql`
  ${typeDefs}
`;

export default schema;
