import { 
  IJsonApiCacheGetOneQuery,
  IJsonApiCacheGetManyQuery, 
  IJsonApiCacheGetAllOfTypeQuery,
  IJsonApiCacheGetRelationshipQuery
} from "./interfaces";
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

export class JsonApiCacheGetOneQuery implements IJsonApiCacheGetOneQuery {
  public readonly queryType = JsonApiCacheQueryType.GetOne;

  constructor(
    public identifier: JsonApi.ExistingResourceIdentifierObject
  ) {};

  public result!: JsonApi.ExistingResourceObject | null;
}

export class JsonApiCacheGetManyQuery implements IJsonApiCacheGetManyQuery {
  public readonly queryType = JsonApiCacheQueryType.GetMany;

  constructor( 
    public identifiers: JsonApi.ExistingResourceIdentifierObject[]
  ) {};

  public result!: JsonApi.ExistingResourceObject[]
  public missing!: JsonApi.ExistingResourceIdentifierObject[]
}

export class JsonApiCacheGetAllOfTypeQuery implements IJsonApiCacheGetAllOfTypeQuery {
  public readonly queryType = JsonApiCacheQueryType.GetAllOfType;

  constructor( public type: string ) {};
  
  public result!: JsonApi.ExistingResourceObject[];
}

export class JsonApiCacheGetRelationshipQuery implements IJsonApiCacheGetRelationshipQuery {
  public readonly queryType = JsonApiCacheQueryType.GetRelationship;

  constructor(
    public identifier: JsonApi.ExistingResourceIdentifierObject,
    public name: string
  ) {};

  public result!: JsonApi.ExistingResourceIdentifierObject[] | null; 
}