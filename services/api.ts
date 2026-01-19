import { SearchResponse, Video, SearchFilters } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Upload a video file to the backend
 */
export const uploadVideo = async (file: File): Promise<Video> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upload failed');
  }

  return response.json();
};

/**
 * Search for video clips using semantic search
 */
export const searchClips = async (
  query: string,
  filters: SearchFilters
): Promise<SearchResponse> => {
  const params = new URLSearchParams({
    query,
    minScore: filters.minScore.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/api/search?${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Search failed');
  }

  return response.json();
};

/**
 * Get the status of all uploaded videos
 */
export const getVideosStatus = async (): Promise<Video[]> => {
  const response = await fetch(`${API_BASE_URL}/api/videos`);

  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }

  return response.json();
};

/**
 * Health check
 */
export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};
