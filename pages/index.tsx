import Schemas from "../components/Schemas";
import toast from "react-hot-toast";
import { Schema } from "../lib/types";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../lib/context";

const Home = () => {
  const { setSchemas } = useSchemaContext();
  const router = useRouter();

  // URL state
  const importSchema = router.query.importSchema as string;

  // Side-effects
  const importSharedSchema = useCallback(() => {
    if (importSchema) {
      try {
        const parsedImportSchema = JSON.parse(
          decodeURIComponent(importSchema)
        ) as Schema;

        if (!parsedImportSchema?.name) {
          toast.error("Failed to import schema");

          router.push("/");

          return;
        }

        new Promise((res) => {
          setSchemas((schemas = []) => {
            if (schemas.some(({ name }) => name === parsedImportSchema.name)) {
              toast.error(
                `You already have a schema called ${parsedImportSchema.name}`
              );

              return schemas;
            }

            res(true);

            return [...schemas, parsedImportSchema];
          });
        }).then(() => {
          router.push(`/schemas/${parsedImportSchema.name}`);
        });
      } catch {
        toast.error("Failed to import schema");
        router.push("/");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importSchema]);

  useEffect(() => {
    importSharedSchema();
  }, [importSharedSchema]);

  return <Schemas />;
};

export default Home;
