## flow-graphql-webpack-plugin

A webpack plugin that takes a GraphQL schema and generates useful things from it.

Currently it only searches types for enums and generates constants from it. In
the future, I'd like it to output flow type annotations as well.

### Usage

Add it to your webpack config as per usual for a plugin:

```
plugins: [
  new FlowGraphQLPlugin(options)
]
```

The options object takes the following shape:

| Key          | Required | Description                                                | Default                   |
|--------------|----------|------------------------------------------------------------|---------------------------|
| schemaPath   | Yes      | Path to your GraphQL schema.json file.                     | n/a                       |
| outputPath   | Yes      | Path where you want the generated constants to go.         | n/a                       |
| fileName     | No       | Name of the constants file.                                | enum.js                   |
| toTypes      | No       | Dot-notation path to the location of types in your schema. | data.__schema.types       |
| enumTypeKind | No       | Type kind for enums                                        | ENUM                      |
| enumTemplate | No       | Output template format for each enum.                      | Function (look in source) |
