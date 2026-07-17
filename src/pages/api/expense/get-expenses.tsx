import { expenses } from "data/expense";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    return res.status(200).json(expenses[0])
}