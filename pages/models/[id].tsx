import Link from "next/link";
import { Button } from "@prisma/lens";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../../lib/context";

const Model = () => {
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

  return (
    <div className="p-8 space-y-4 flex flex-col">
      <p className="text-lg">This page is deprecated</p>
      <Link href="/" passHref>
        <a>
          <Button>Go home</Button>
        </a>
      </Link>
    </div>
  );
};

export default Model;
