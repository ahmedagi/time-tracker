import { sql, Expression, SqlBool, expressionBuilder } from 'kysely';
import { db } from '../../db';
import { DB, NewRecord, RecordUpdate } from '../../db/types';
import { QueryParams } from './record.validator';

const recordColumnsToSelect = [
  'record.id as recordId',
  'record.comment as comment',
  'record.started_at as startedAt',
  'record.stopped_at as stoppedAt',
  'record.activity_id as activityId',
  'activity.name as activityName',
  'activity.color as color',
  'activity.day_goal as dayGoal',
  'activity.session_goal as sessionGoal',
] as const;

async function findById(accountId: bigint, recordId: bigint) {
  return db
    .selectFrom('record')
    .innerJoin('activity', 'record.activity_id', 'activity.id')
    .select(recordColumnsToSelect)
    .where('activity.account_id', '=', accountId)
    .where('record.id', '=', recordId)
    .executeTakeFirst();
}

async function find(accountId: bigint, queryParams?: QueryParams) {
  return db
    .selectFrom('record')
    .innerJoin('activity', 'activity.id', 'record.activity_id')
    .select(recordColumnsToSelect)
    .where('activity.account_id', '=', accountId)
    .where((eb) => {
      if (!queryParams) {
        return eb.and([]);
      }

      const filters: Expression<SqlBool>[] = [];
      const { active, activityId, comment, date, dateFrom, dateTo } =
        queryParams;
      const dateTomorrow = getNextDayDate(new Date());

      if (active === true) {
        filters.push(eb('record.stopped_at', 'is', null));
      } else if (active === false) {
        filters.push(eb('record.stopped_at', 'is not', null));
      }

      if (activityId) {
        filters.push(eb('activity.id', '=', activityId));
      }

      if (comment) {
        filters.push(eb('record.comment', 'ilike', `%${comment}%`));
      }

      if (date && !dateFrom && !dateTo) {
        filters.push(filterRecordsBetweenDates(date, date));
      }

      // ugly nesting
      if (dateFrom) {
        if (!dateTo || dateTo >= dateTomorrow) {
          filters.push(filterRecordsBetweenDates(dateFrom, new Date()));
        } else {
          filters.push(filterRecordsBetweenDates(dateFrom, dateTo));
        }
      } else if (dateTo) {
        if (dateTo >= dateTomorrow) {
          filters.push(eb('started_at', '<', getNextDayDate(dateTo)));
        } else {
          filters.push(eb('started_at', '<', dateTo));
        }
      }

      return eb.and(filters);
    })
    .execute();
}

async function remove(accountId: bigint, recordId: bigint) {
  return db
    .deleteFrom('record')
    .where('record.id', '=', recordId)
    .where(({ eb }) =>
      eb(
        'record.activity_id',
        'in',
        eb
          .selectFrom('activity')
          .where('account_id', '=', accountId)
          .select('activity.id')
      )
    )
    .executeTakeFirst();
}

async function create(accountId: bigint, record: NewRecord) {
  return db
    .insertInto('record')
    .columns(['activity_id', 'comment', 'started_at', 'stopped_at'])
    .expression(
      db
        .selectFrom('activity')
        .select([
          sql`${record.activity_id}`.as('activityId'),
          sql`${record.comment}`.as('comment'),
          sql`${record.started_at}`.as('startedAt'),
          sql`${record.stopped_at}`.as('stoppedAt'),
        ])
        .where(belongsActivityToAccount(accountId, record.activity_id))
        .limit(1)
    )
    .returningAll()
    .executeTakeFirst();
}

async function update(
  accountId: bigint,
  record_id: bigint,
  record: RecordUpdate
) {
  return db
    .with('record', (db) =>
      db
        .updateTable('record')
        .set(record)
        .where('id', '=', record_id)
        .where((eb) => {
          if (!record.activity_id) {
            return eb.and([]);
          }
          return belongsActivityToAccount(accountId, record.activity_id);
        })
        .returningAll()
    )
    .selectFrom('record')
    .innerJoin('activity', 'record.activity_id', 'activity.id')
    .select(recordColumnsToSelect)
    .executeTakeFirst();
}

export default {
  findById,
  find,
  remove,
  create,
  update,
};

function filterRecordsBetweenDates(startDate: Date, stopDate: Date) {
  const eb = expressionBuilder<DB, 'record'>();
  const dateTomorrow = getNextDayDate(new Date());

  return eb.or([
    eb.and([
      eb('started_at', '<=', startDate),
      eb.or([
        eb('stopped_at', '>=', startDate),
        eb('stopped_at', 'is', null).and(sql`${startDate}`, '<', dateTomorrow),
      ]),
    ]),
    eb.and([
      eb('started_at', '>=', startDate),
      eb('started_at', '<', getNextDayDate(stopDate)),
      eb.or([
        eb('stopped_at', 'is not', null),
        eb(sql`${startDate}`, '<', dateTomorrow),
      ]),
    ]),
  ]);
}

function belongsActivityToAccount(accountId: bigint, activityId: bigint) {
  const eb = expressionBuilder<DB, 'activity'>();
  return eb.exists((eb) =>
    eb
      .selectFrom('activity')
      .where('account_id', '=', accountId)
      .where('id', '=', activityId)
  );
}

function getNextDayDate(date: Date) {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + 1));
}
