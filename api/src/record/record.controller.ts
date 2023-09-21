import { Request, Response } from 'express';

import recordDAO from './record.dao';

export async function getRecord(req: Request, res: Response) {
  res.send(await recordDAO.findById());
}

export async function getAllRecords(req: Request, res: Response) {
  const records = await recordDAO.find(req.session.user!.id);
  res.status(200).json({ records });
}

export async function deleteRecord(req: Request, res: Response) {
  res.send(await recordDAO.remove());
}

export async function createRecord(req: Request, res: Response) {
  res.send(await recordDAO.create());
}

export async function updateRecord(req: Request, res: Response) {
  const record = await recordDAO.update(BigInt(req.params.recordId), {
    ...req.body,
    started_at: new Date(req.body.started_at),
    stopped_at: new Date(req.body.stopped_at),
  });
  console.log(record);
  res.json({ record });
}
