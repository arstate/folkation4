export interface EventConfig {
  day1FolderUrl: string;
  day2FolderUrl: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string; // For download/full view
}

export interface DriveResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

export type TabType = 'day1' | 'day2';
