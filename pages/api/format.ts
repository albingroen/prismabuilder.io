import { NextApiRequest, NextApiResponse } from "next";
import { jsonToPrismaSchema } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const schema = jsonToPrismaSchema(req.body);
  res.json(schema);
}
