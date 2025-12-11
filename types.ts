export interface Memory {
  id: number;
  title: string;
  theme: 'art' | 'books' | 'movie' | 'love';
  imagePlaceholder: string; // URL for the image
  defaultPoem: string;
  generatedPoem?: string;
}

export interface GenerationResponse {
  poems: string[];
}