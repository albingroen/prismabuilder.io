import Schemas from "../components/Schemas";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../lib/context";

const Home = () => {
  const { schemas, setSchemas } = useSchemaContext();
  const router = useRouter();

  useEffect(() => {
    const lcSchema = localStorage.getItem("schema");
    const schema = lcSchema && JSON.parse(lcSchema);

    if (schema && !schemas?.length) {
      const newSchema = {
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

  return <Schemas />;
};

export default Home;
