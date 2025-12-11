export interface VideoConfig {
  id: string;
  title: string;
  url: string;
}

export interface EventConfig {
  day1FolderUrl: string;
  day2FolderUrl: string;
  afterMovies?: VideoConfig[];
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