import { DriveFile, DriveResponse } from '../types';

const API_KEY = 'AIzaSyAM5ilqBXb62X4MN-ZM83NpQtOaK_5-9jQ'; 
const BASE_URL = 'https://www.googleapis.com/drive/v3/files';

export const extractFolderId = (url: string): string | null => {
  // Pattern 1: folders/FOLDER_ID
  const matchFolder = url.match(/folders\/([a-zA-Z0-9-_]+)/);
  if (matchFolder) return matchFolder[1];

  // Pattern 2: id=FOLDER_ID
  const matchId = url.match(/id=([a-zA-Z0-9-_]+)/);
  if (matchId) return matchId[1];

  // If the user just pasted the ID
  if (url.length > 20 && !url.includes('/')) return url;

  return null;
};

export const fetchDriveFiles = async (folderId: string): Promise<DriveFile[]> => {
  if (!folderId) return [];

  // Query: files inside the folder, not trashed, is an image
  const q = `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`;
  const fields = 'files(id, name, mimeType, thumbnailLink, webContentLink)';
  const orderBy = 'createdTime desc';
  
  const url = `${BASE_URL}?q=${encodeURIComponent(q)}&key=${API_KEY}&fields=${encodeURIComponent(fields)}&orderBy=${encodeURIComponent(orderBy)}&pageSize=50`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Drive API Error:", errorData);
      throw new Error("Gagal mengambil data. Pastikan folder 'Public' (Anyone with link).");
    }
    const data: DriveResponse = await response.json();
    return data.files || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

// Helper to get a high-res image from the thumbnail link
export const getHighResImageUrl = (thumbnailLink?: string): string => {
  if (!thumbnailLink) return 'https://picsum.photos/400/400'; // Fallback
  // Replace standard size param (e.g., =s220) with a larger one (=s1200)
  return thumbnailLink.replace(/=s\d+/, '=s1200');
};
