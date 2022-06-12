import Schemas from "../components/Schemas";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../lib/context";
import { Schema } from "../lib/types";

const Home = () => {
  const { schemas, setSchemas } = useSchemaContext();
  const router = useRouter();

  useEffect(() => {
    const lcSchema = localStorage.getItem("schema");
    const schema = lcSchema && JSON.parse(lcSchema);

    if (schema && !schemas?.length) {
      const newSchema: Schema = {
        database: "postgresql",
        models: schema.models,
        enums: schema.enums,
        name: "New schema",
      };
      setSchemas([...schemas, newSchema]);
      localStorage.removeItem("schema");
      router.push(`/schemas/${newSchema.name}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemas]);

  return (
    <div className="flex">
      <Schemas />
      <div className="flex justify-center flex-1 items-center p-12">
        <ol className="list-decimal flex flex-col space-y-2 text-gray-700 px-8 py-7 rounded-md border border-dashed list-inside">
          <li>Click &ldquo;New schema&rdquo;</li>
          <li>Name your schema</li>
          <li>Choose a provider</li>
          <li>Create your models</li>
          <li>Click &ldquo;Generate schema&rdquo;</li>
        </ol>
      </div>
    </div>
  );
};

export default Home;
