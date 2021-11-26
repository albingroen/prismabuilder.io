# prismabuilder.io

Build your Prisma schema visually in this easy-to-use web based tool.

Try it out at [prismabuilder.io](https://prismabuilder.io)

Schema generator code by [Richard Powell](https://github.com/byrichardpowell/prisma-schema-to-json-to-prisma-schema)

## Documentation

### Generating the schema from JSON

The application uses JSON as the data format, and then generates the Prisma schema string on demand. This is done by sending a `POST` request to this url and passing in the schema.

```javascript
axios.post("https://prismabuilder-io-api.onrender.com/generate", { schema });
```

### Parsing a schema string into JSON

```javascript
axios.post("https://prismabuilder-io-api.onrender.com/parse", { schema });
```

You can find the code for this here: [albingroen/prismabuilder.io-api](https://github.com/albingroen/prismabuilder.io-api)
