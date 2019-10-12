import * as JsonApi from './ed-json-api';

export type JsonApiCacheCommand =
  JsonApiCachePushCommand 
  | JsonApiCacheUnloadOneCommand
  | JsonApiCacheUnloadManyCommand;

export enum JsonApiCacheCommandType {
  Push,
  UnloadOne,
  UnloadMany
}
  
export class JsonApiCachePushCommand {
  public readonly commandType = JsonApiCacheCommandType.Push;

  constructor(
    public document: JsonApi.JsonApiDocument
  ) {};
}

export class JsonApiCacheUnloadOneCommand {
  public readonly commandType = JsonApiCacheCommandType.UnloadOne;
  
  constructor( 
    public identifier: JsonApi.ExistingResourceIdentifierObject
  ) {};
}

export class JsonApiCacheUnloadManyCommand {
  public readonly commandType = JsonApiCacheCommandType.UnloadMany;
  
  constructor( 
    public identifiers: JsonApi.ExistingResourceIdentifierObject[]
  ) {};
}