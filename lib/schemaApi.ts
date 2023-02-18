import axios from "axios";
import { apiUrl } from "./config";
import { Schema } from "./types";

export const parseSchema = async (schema: string): Promise<Schema> => {
  const parseResponse = await axios.post<Schema>(`${apiUrl}/parse`, { schema });
  return parseResponse.data;
};
