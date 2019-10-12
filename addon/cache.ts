import { IJsonApiCache } from './interfaces';
import { 
  JsonApiCacheCommand, 
  JsonApiCacheCommandType, 
  JsonApiCachePushCommand, 
  JsonApiCacheUnloadOneCommand, 
  JsonApiCacheUnloadManyCommand 
} from './commands';
import { 
  JsonApiCacheQuery, 
  JsonApiCacheQueryType,
  JsonApiCacheGetOneQuery,
  JsonApiCacheGetManyQuery,
  JsonApiCacheGetAllOfTypeQuery,
  JsonApiCacheGetRelationshipQuery
} from './queries';
import * as JsonApi from './ed-json-api';

export class JsonApiCache implements IJsonApiCache {

  private typesMap = new Map<string, Map<string, JsonApi.ExistingResourceObject>>();

  public perform(cmd: JsonApiCacheCommand): void {
    switch(cmd.commandType) {
      case JsonApiCacheCommandType.Push: 
        return this.performPush(cmd);
      case JsonApiCacheCommandType.UnloadOne: 
        return this.performUnloadOne(cmd);
      case JsonApiCacheCommandType.UnloadMany: 
        return this.performUnloadMany(cmd);
    }
  }

  public query(query: JsonApiCacheQuery): void {
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

  private findIdentifier(identifier: JsonApi.ExistingResourceIdentifierObject) {
    let typeCache = this.typesMap.get( identifier.type );
    if (!typeCache) {
      return null;
    }
    return typeCache.get( identifier.id );
  }

  private queryGetOne(query: JsonApiCacheGetOneQuery): void {
    query.result = this.findIdentifier( query.identifier ) || null;
  }
  
  private queryGetMany(query: JsonApiCacheGetManyQuery): void {
    let result = [];
    let missing = [];
    for (let identifier of query.identifiers) {
      let found = this.findIdentifier( identifier );
      if (found) {
        result.push(found);
      } else {
        missing.push(identifier);
      }
    }
    query.result = result;
    query.missing = missing;
  }
  
  private queryGetAllOfType(query: JsonApiCacheGetAllOfTypeQuery): void {
    let typeCache = this.typesMap.get( query.type );
    if (!typeCache) {
      query.result = [];
      return;
    }
    query.result = [...typeCache.values()];
  }
  
  private queryGetRelationship(query: JsonApiCacheGetRelationshipQuery): void {
    throw new Error("Method not implemented.");
  }
  
  private performPush(cmd: JsonApiCachePushCommand): void {
    let data = cmd.document.data;
    if (Array.isArray(data)) {
      for (let obj of data) {
        this.pushObject(obj);
      }
    } else if (data) {
      this.pushObject(data);
    }
  }

  private pushObject(obj: JsonApi.ExistingResourceObject) {
    let identifiersMap = this.typesMap.get(obj.type);
    if (!identifiersMap) {
      // add a new one for this type
      identifiersMap = new Map<string, JsonApi.ExistingResourceObject>();
      this.typesMap.set(obj.type, identifiersMap);
    }
    identifiersMap.set(obj.id, obj);
  }

  private unload(identifier: JsonApi.ExistingResourceObject): void {
    let typeCache = this.typesMap.get( identifier.type );
    if (!typeCache) {
      // nothing in the cache for this type
      return;
    }
    if (typeCache.delete( identifier.id )) {
      // delete succeeded so there was something there
      if (typeCache.size == 0) {
        // that was the last identifier of that type
        // so clean up
        this.typesMap.delete( identifier.type );
      }
    }
  }

  private performUnloadOne(cmd: JsonApiCacheUnloadOneCommand): void {
    this.unload(cmd.identifier);
  }

  private performUnloadMany(cmd: JsonApiCacheUnloadManyCommand): void {
    for (var identifier of cmd.identifiers) {
      this.unload(identifier);
    }
  }
}