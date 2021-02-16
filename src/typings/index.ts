import { Got } from 'got/dist/source';

export type WithCursor<T> = T & {
  cursor?: string;
};

export type DeleteObjectIDs = {
  deleted_object_ids: string[];
};

export type HTTPClient = Got;
