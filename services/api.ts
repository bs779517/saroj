import { SHEETDB_API } from '../constants';
import { UserSubmission } from '../types';

const LOCAL_LEADS_KEY = 'sarojfit_client_submissions';

export const saveToSheet = async (data: UserSubmission): Promise<boolean> => {
  const payload: UserSubmission = {
    ...data,
    date: data.date || new Date().toLocaleDateString('en-IN'),
  };

  try {
    const existingRaw = localStorage.getItem(LOCAL_LEADS_KEY);
    const existing: UserSubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.unshift(payload);
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch {
    // Ignore storage quota or private-mode restrictions
  }

  if (!SHEETDB_API || !SHEETDB_API.startsWith('http')) {
    return true;
  }

  try {
    const response = await fetch(SHEETDB_API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [payload]
      })
    });

    if (!response.ok) return false;
    const result = await response.json();
    return !!(result && result.created);
  } catch {
    return false;
  }
};