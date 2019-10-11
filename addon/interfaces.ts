import * as JsonApi from 'jsonapi-typescript';
import { XOR } from 'ts-xor';


export type JsonApiCacheQuery = 
  JsonApiCacheGetQuery
  | JsonApiCacheGetAllOfTypeQuery
  | JsonApiCacheGetRelationshipQuery;

export type JsonApiCacheCommand = 
  JsonApiCachePushCommand 
  | JsonApiCacheUnloadCommand;

export interface IJsonApiCache {
  query(q: JsonApiCacheQuery): void;
  perform(p: JsonApiCacheCommand): void;
}

type Id = JsonApi.ResourceIdentifierObject;

// push

export interface JsonApiCachePushCommand {
  document: JsonApi.Document;
};

// unload

export type JsonApiCacheUnloadCommand = XOR<JsonApiCacheUnloadOneCommand, JsonApiCacheUnloadManyCommand>;

export interface JsonApiCacheUnloadOneCommand {
  identifier: Id;
};

export interface JsonApiCacheUnloadManyCommand {
  identifiers: Id[];
};

// get object
export type JsonApiCacheGetQuery = XOR<JsonApiCacheGetOneQuery,JsonApiCacheGetManyQuery>;

export interface JsonApiCacheGetOneQuery {
  identifier: Id;
  result: JsonApi.ResourceObject;
};

export interface JsonApiCacheGetManyQuery {
  identifiers: Id[];
  result: JsonApi.ResourceObject[];
};

// get all of type
export interface JsonApiCacheGetAllOfTypeQuery {
  type: string;
  result: JsonApi.ResourceObject[];
};

// get a relationship
export interface JsonApiCacheGetRelationshipQuery {
  identifier: Id;
  name: string;
  result: JsonApi.RelationshipObject;
};
