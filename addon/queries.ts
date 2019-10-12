import * as JsonApi from './ed-json-api';

export enum JsonApiCacheQueryType {
  GetOne,
  GetMany,
  GetAllOfType,
  GetRelationship
}

export type JsonApiCacheQuery = 
  JsonApiCacheGetOneQuery
  | JsonApiCacheGetManyQuery
  | JsonApiCacheGetAllOfTypeQuery
  | JsonApiCacheGetRelationshipQuery;

export class JsonApiCacheGetOneQuery {
  public readonly queryType = JsonApiCacheQueryType.GetOne;

  constructor(
    public identifier: JsonApi.ExistingResourceIdentifierObject
  ) {};

  public result!: JsonApi.ExistingResourceObject | null;
}

export class JsonApiCacheGetManyQuery {
  public readonly queryType = JsonApiCacheQueryType.GetMany;

  constructor( 
    public identifiers: JsonApi.ExistingResourceIdentifierObject[]
  ) {};

  public result!: JsonApi.ExistingResourceObject[]
  public missing!: JsonApi.ExistingResourceIdentifierObject[]
}

export class JsonApiCacheGetAllOfTypeQuery {
  public readonly queryType = JsonApiCacheQueryType.GetAllOfType;

  constructor( public type: string ) {};
  
  public result!: JsonApi.ExistingResourceObject[];
}

export class JsonApiCacheGetRelationshipQuery {
  public readonly queryType = JsonApiCacheQueryType.GetRelationship;

  constructor(
    public identifier: JsonApi.ExistingResourceIdentifierObject,
    public name: string
  ) {};

  public result!: JsonApi.ExistingResourceIdentifierObject[] | null; 
}