import axios from "axios";
import { SchemaContext } from "../lib/context";
import { useContext, useEffect, useState } from "react";

const Schema = () => {
  const { schema } = useContext(SchemaContext);
  const [result, setResult] = useState("");

  useEffect(() => {
    axios
      .post("https://prismabuilder-io-api.onrender.com/format", { schema })
      .then((res) => {
        setResult(res.data);
      });
  }, [schema]);

  return <pre>{result}</pre>;
};

export default Schema;
