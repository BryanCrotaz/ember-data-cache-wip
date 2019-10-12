import * as JsonApi from './ed-json-api';
import { JsonApiCacheCommand } from './commands';
import { JsonApiCacheQuery } from './queries';

export interface IJsonApiCache {
  query(q: JsonApiCacheQuery): void;
  perform(p: JsonApiCacheCommand): void;
}

// unload
export interface IJsonApiCacheUnloadOneCommand {
  identifier: JsonApi.ExistingResourceIdentifierObject;
};

export interface IJsonApiCacheUnloadManyCommand {
  identifiers: JsonApi.ExistingResourceIdentifierObject[];
};

// Queries
export interface IJsonApiCacheGetOneQuery {
  identifier: JsonApi.ExistingResourceIdentifierObject;
  result?: JsonApi.ExistingResourceObject | null;
};

export interface IJsonApiCacheGetManyQuery {
  identifiers: JsonApi.ExistingResourceIdentifierObject[];
  result: JsonApi.ExistingResourceObject[];
  missing: JsonApi.ExistingResourceIdentifierObject[];
};

// get all of type
export interface IJsonApiCacheGetAllOfTypeQuery {
  type: string;
  result?: JsonApi.ExistingResourceIdentifierObject[];
};

// get a relationship
export interface IJsonApiCacheGetRelationshipQuery {
  identifier: JsonApi.ExistingResourceIdentifierObject;
  name: string;
  result?: JsonApi.ExistingResourceIdentifierObject[] | null;
};
