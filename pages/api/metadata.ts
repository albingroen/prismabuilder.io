import { NextApiRequest, NextApiResponse } from "next";
import { parser } from "html-metadata-parser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url: rawUrl } = req.query;
  const url = decodeURIComponent(rawUrl as string);

  const metadata = await parser(url);

  res.json(metadata);
}
