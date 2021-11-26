import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "@prisma/lens";
import { SchemaContext } from "../lib/context";
import { useContext, useEffect, useState } from "react";

const Schema = () => {
  const { schema } = useContext(SchemaContext);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("");

  useEffect(() => {
    axios
      .post("https://prismabuilder-io-api.onrender.com/generate", { schema })
      .then((res) => {
        setResult(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to generate schema");
        setLoading(false);
      });
  }, [schema]);

  return (
    <div>
      {result ? (
        <pre>{result}</pre>
      ) : (
        loading && (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        )
      )}
    </div>
  );
};

export default Schema;
