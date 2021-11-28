import { Button } from "@prisma/lens";
import Link from "next/link";
import Models from "../components/Models";
import { useSchemaContext } from "../lib/context";

const Home = () => {
  const { schema, schemas, setSchema, setSchemas } = useSchemaContext();

  return (
    <div>
      {schema ? (
        <Models />
      ) : schemas?.length ? (
        <ul>
          {schemas.map((s, i) => (
            <li key={s.name}>
              <Link href={`/schemas/${s.name}`} passHref>
                <a>{s.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex-1"></div>
      <Button
        onClick={() => {
          setSchemas([
            ...schemas,
            {
              name: "New schema",
              models: [],
              enums: [],
            },
          ]);
        }}
      >
        Create a schema
      </Button>
    </div>
  );
};

export default Home;
