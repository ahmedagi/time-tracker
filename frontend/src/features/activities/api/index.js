const BASE_URL = import.meta.env.VITE_API_URL;

async function deleteActivity(activityName) {
  const response = await fetch(BASE_URL + `/activities/${activityName}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  // return data = null because the status code is 204 - No Content
  return { response, data: null };
}

async function restoreActivity(activityName) {
  const response = await fetch(BASE_URL + `/activities/${activityName}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ archived: false }),
  });
  const data = await response.json();
  return { response, data };
}

async function createRecord(activityId, startedAt) {
  const response = await fetch(BASE_URL + '/records', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      activityId: activityId,
      startedAt: startedAt,
    }),
  });

  const data = await response.json();
  return { response, data };
}

async function stopRecord(recordId, stoppedAt) {
  const response = await fetch(`http://localhost:8000/api/v1/records/${recordId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      stoppedAt: stoppedAt.toISOString(),
    }),
  });
  const data = await response.json();
  return { response, data };
}

async function getActivities() {
  const response = await fetch(BASE_URL + '/activities', {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json();
  return { response, data };
}

async function getActiveRecords() {
  const response = await fetch(BASE_URL + '/records?active=true', {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json();
  return { response, data };
}

async function createActivity(activityData) {
  const response = await fetch(BASE_URL + '/activities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(activityData),
  });
  const data = await response.json();
  return { response, data };
}

async function updateActivity(activityName, activityData) {
  const response = await fetch(BASE_URL + `/activities/${activityName}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(activityData),
  });
  const data = await response.json();
  return { response, data };
}

async function getactivity(activityName) {
  const response = await fetch(BASE_URL + `/activities/${activityName}`, {
    credentials: 'include',
  });
  const data = await response.json();
  return { response, data };
}

export {
  getactivity,
  createActivity,
  updateActivity,
  deleteActivity,
  restoreActivity,
  createRecord,
  stopRecord,
  getActivities,
  getActiveRecords,
};
