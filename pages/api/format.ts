import { NextApiRequest, NextApiResponse } from "next";
import { formatSchema } from "@prisma/sdk";
import { jsonToPrismaSchema } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const schema = await formatSchema({ schema: jsonToPrismaSchema(req.body) });
  res.json(schema);
}
