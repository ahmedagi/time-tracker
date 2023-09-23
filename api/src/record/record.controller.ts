import { Request, Response } from 'express';

import {
  validateCreatePaylaod,
  validatePathParam,
  validateQueryString,
  validateUpdatePayload,
} from './record.validator';
import recordDAO from './record.dao';
import { NotFoundError } from '../errors/not-found.error';

export async function getRecord(req: Request, res: Response) {
  const recordId = validatePathParam(req.params.recordId);
  const record = await recordDAO.findById(
    req.session.user!.id,
    BigInt(req.params.recordId)
  );
  if (!record) {
    throw new NotFoundError(`Record with id=${recordId} not found`);
  }
  res.send(record);
}

export async function getAllRecords(req: Request, res: Response) {
  console.log(req.query);
  const query = validateQueryString(req.query);
  console.log(query);
  const records = await recordDAO.find(req.session.user!.id);
  res.status(200).json({ records });
}

export async function deleteRecord(req: Request, res: Response) {
  const recordId = validatePathParam(req.params.recordId);
  const result = await recordDAO.remove(req.session.user!.id, recordId);
  if (result.numDeletedRows === 0n) {
    throw new NotFoundError(
      `Failed to delete record. Record with id=${recordId} not found.`
    );
  }
  res.status(204);
}

export async function createRecord(req: Request, res: Response) {
  const record = validateCreatePaylaod(req.body);
  const newRecord = await recordDAO.create(req.session.user!.id, {
    activity_id: record.activityId,
    comment: record.comment,
    started_at: record.startedAt,
    stopped_at: record.stoppedAt,
    active: record.active,
  });
  if (!newRecord) {
    throw new NotFoundError(
      `Failed to create record for specified activity. Activity with id=${record.activityId} not found.`
    );
  }
  res.status(201).json(newRecord);
}

export async function updateRecord(req: Request, res: Response) {
  const recordId = validatePathParam(req.params.recordId);
  const record = validateUpdatePayload(req.body);
  const updatedRecord = await recordDAO.update(req.session.user!.id, recordId, {
    activity_id: record.activityId,
    comment: record.comment,
    started_at: record.startedAt,
    stopped_at: record.stoppedAt,
    active: record.active,
  });
  console.log(updatedRecord);
  if (!updatedRecord) {
    throw new NotFoundError(`Failed to update - some reason`);
  }
  res.json({ updatedRecord });
}
