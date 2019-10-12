import * as JsonApi from "./types/ed-json-api";
import { JsonApiLocalCache } from "./local-cache";
import { JsonApiCacheCommand, JsonApiCachePushCommand } from "./commands";
import { 
  JsonApiCacheQuery,
  JsonApiCacheQueryType,
  JsonApiCacheGetOneQuery,
  JsonApiCacheGetManyQuery,
  JsonApiCacheGetAllOfTypeQuery,
  JsonApiCacheGetRelationshipQuery
} from "./queries";

export type FetchJsonApiObjectFn = 
  (identifier: JsonApi.ExistingResourceIdentifierObject) => Promise<JsonApi.JsonApiDocument>; 
export type FetchJsonApiObjectsFn = 
  (identifiers: JsonApi.ExistingResourceIdentifierObject[]) => Promise<JsonApi.JsonApiDocument>; 

export class JsonApiFetchingCache {
  constructor(
    private localCache: JsonApiLocalCache,
    private fetchObject: FetchJsonApiObjectFn,
    private fetchObjects: FetchJsonApiObjectsFn
  ) {}

  public async perform(cmd: JsonApiCacheCommand): Promise<void> {
    this.localCache.perform(cmd);
  }

  public async query(query: JsonApiCacheQuery): Promise<void> {
    switch(query.queryType) {
      case JsonApiCacheQueryType.GetOne: 
        return this.queryGetOne(query);
      case JsonApiCacheQueryType.GetMany: 
        return this.queryGetMany(query);
      case JsonApiCacheQueryType.GetAllOfType: 
        return this.queryGetAllOfType(query);
      case JsonApiCacheQueryType.GetRelationship: 
        return this.queryGetRelationship(query);
    }
  }
  
  private async queryGetOne(query: JsonApiCacheGetOneQuery): Promise<void> {
    this.localCache.query(query);
    if (!query.result) {
      try {
        // not present in local cache so fetch from remote
        let remoteDocument = await this.fetchObject(query.identifier);
        if (remoteDocument) {
          // push it into the local cache
          this.localCache.perform(
            new JsonApiCachePushCommand(remoteDocument)
          );
        }
        // rerun the query
        this.localCache.query(query);
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  private async queryGetMany(query: JsonApiCacheGetManyQuery): Promise<void> {
    this.localCache.query(query);
    if (query.missing) {
      try {
        // missing identifiers are not present in 
        // local cache so fetch from remote
        let remoteDocument = await this.fetchObjects(query.missing);
        if (remoteDocument) {
          // push it into the local cache
          this.localCache.perform(
            new JsonApiCachePushCommand(remoteDocument)
          );
        }
        // rerun the query
        this.localCache.query(query);
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  private async queryGetAllOfType(query: JsonApiCacheGetAllOfTypeQuery): Promise<void> {
    this.localCache.query(query);
    // local query only so no fetch required  
  }

  private async queryGetRelationship(query: JsonApiCacheGetRelationshipQuery): Promise<void> {
    throw new Error("Method not implemented.");
  }
}