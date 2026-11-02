import { SHEETDB_API } from '../constants';
import { UserSubmission } from '../types';

export const saveToSheet = async (data: UserSubmission): Promise<boolean> => {
  try {
    const response = await fetch(SHEETDB_API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [
          {
            date: new Date().toLocaleDateString(), // Auto-generate date
            ...data
          }
        ]
      })
    });

    const result = await response.json();
    return !!(result && result.created);
  } catch (error) {
    console.error("SheetDB Error:", error);
    return false;
  }
};