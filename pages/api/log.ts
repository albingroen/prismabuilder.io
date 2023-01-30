import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.post(
      "https://api.logsnag.com/v1/log",
      {
        project: "prisma-schema-builder",
        channel: req.body.channel,
        event: req.body.event,
        icon: req.body.icon,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LOGSNAG_API_TOKEN}`,
        },
      }
    );

    res.send(response?.data);
  } catch (e) {
    console.log((e as AxiosError).response?.data.validation);
    res.status(500).send("Failed to send log");
  }
}
