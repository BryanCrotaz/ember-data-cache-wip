import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { JsonApiLocalCache } from 'ember-data-cache-wip/local-cache';
import { JsonApiFetchingCache } from 'ember-data-cache-wip/fetching-cache';
import { 
  JsonApiCachePushCommand,
  JsonApiCacheUnloadOneCommand,
  JsonApiCacheUnloadManyCommand
} from 'ember-data-cache-wip/commands';
import { 
  JsonApiCacheGetOneQuery, 
  JsonApiCacheGetManyQuery, 
  JsonApiCacheGetAllOfTypeQuery
} from 'ember-data-cache-wip/queries';
import sinon from 'sinon';

module('Unit | fetching cache', function(hooks) {
  setupTest(hooks);

  test('it constructs without error', function(assert) {
    let localCache = new JsonApiLocalCache();
    let fetchObject = sinon.stub();
    let fetchObjects = sinon.stub();
    let cache = new JsonApiFetchingCache(localCache, fetchObject, fetchObjects);
    assert.ok(cache);
  });

  test('pushed object can be retrieved without fetching', async function(assert) {
    let localCache = new JsonApiLocalCache();
    let fetchObject = sinon.stub();
    let fetchObjects = sinon.stub();
    let cache = new JsonApiFetchingCache(localCache, fetchObject, fetchObjects);

    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    await cache.perform(push);

    let get = new JsonApiCacheGetOneQuery({id: '123', type: 'person'});
    await cache.query(get);
    assert.ok(get.result);
    if (get.result) {
      assert.equal(get.result.id, '123');
      assert.equal(get.result.type, 'person');
      assert.ok(get.result.attributes);
      if (get.result.attributes) {
        assert.equal(get.result.attributes.name, 'Bryan');
      }
    }
    assert.notOk(fetchObject.called);
    assert.notOk(fetchObjects.called);
  });

  test('get object that is not present fetches it', async function(assert) {
    let localCache = new JsonApiLocalCache();
    let fetchObject = sinon.stub().returns({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    let fetchObjects = sinon.stub();
    let cache = new JsonApiFetchingCache(localCache, fetchObject, fetchObjects);

    let get = new JsonApiCacheGetOneQuery({id: '123', type: 'person'});
    await cache.query(get);
    
    assert.ok(fetchObject.calledOnceWith({id: '123', type: 'person'}));
    assert.notOk(fetchObjects.called);

    // check the object is returned
    assert.ok(get.result);
    if (get.result) {
      assert.equal(get.result.id, '123');
      assert.equal(get.result.type, 'person');
      assert.ok(get.result.attributes);
      if (get.result.attributes) {
        assert.equal(get.result.attributes.name, 'Bryan');
      }
    }
  });

  test('get object that is not present on server returns null', async function(assert) {
    let localCache = new JsonApiLocalCache();
    let fetchObject = sinon.stub().throws("404 Not Found");
    let fetchObjects = sinon.stub();
    let cache = new JsonApiFetchingCache(localCache, fetchObject, fetchObjects);

    let get = new JsonApiCacheGetOneQuery({id: '123', type: 'person'});
    await cache.query(get);
    assert.equal(get.result, null);
  });

  test('getMany fetches missing objects', async function(assert) {
    let localCache = new JsonApiLocalCache();
    let fetchObject = sinon.stub();
    let fetchObjects = sinon.stub().returns({
      data: [
        {
          id: 'abc',
          type: 'person',
          attributes: {
            name: 'Steve'
          }
        },
        {
          id: 'def',
          type: 'person',
          attributes: {
            name: 'Susan'
          }
        }
      ]
    });
    let cache = new JsonApiFetchingCache(localCache, fetchObject, fetchObjects);

    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    await cache.perform(push);

    let get = new JsonApiCacheGetManyQuery(
      [
        {id: '123', type: 'person'},
        {id: 'abc', type: 'person'},
        {id: 'def', type: 'person'}
      ]
    );
    await cache.query(get);
    assert.ok(get.result);
    assert.equal(get.result.length, 3);
    let first = get.result[0];
    if (first) {
      assert.equal(first.id, '123');
      assert.equal(first.type, 'person');
      assert.ok(first.attributes);
      if (first.attributes) {
        assert.equal(first.attributes.name, 'Bryan');
      }
    }
    let second = get.result[1];
    if (second) {
      assert.equal(second.id, 'abc');
      assert.equal(second.type, 'person');
      assert.ok(second.attributes);
      if (second.attributes) {
        assert.equal(second.attributes.name, 'Steve');
      }
    }
    let third = get.result[2];
    if (third) {
      assert.equal(third.id, 'def');
      assert.equal(third.type, 'person');
      assert.ok(third.attributes);
      if (third.attributes) {
        assert.equal(third.attributes.name, 'Susan');
      }
    }

    assert.notOk(fetchObject.called);
    assert.ok(fetchObjects.calledOnceWith([
      {id: 'abc', type: 'person'},
      {id: 'def', type: 'person'},
    ]));
  });

  test('pushed object can be retrieved with getAllOfType', async function(assert) {
    let localCache = new JsonApiLocalCache();
    let fetchObject = sinon.stub();
    let fetchObjects = sinon.stub();
    let cache = new JsonApiFetchingCache(localCache, fetchObject, fetchObjects);

    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    await cache.perform(push);

    let get = new JsonApiCacheGetAllOfTypeQuery('person');
    await cache.query(get);
    assert.ok(get.result);
    assert.equal(get.result.length, 1);
    let first = get.result[0];
    if (first) {
      assert.equal(first.id, '123');
      assert.equal(first.type, 'person');
      assert.ok(first.attributes);
      if (first.attributes) {
        assert.equal(first.attributes.name, 'Bryan');
      }
    }
  });

  test('get fetches after unload', async function(assert) {
    let localCache = new JsonApiLocalCache();
    let fetchObject = sinon.stub().returns({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    let fetchObjects = sinon.stub();
    let cache = new JsonApiFetchingCache(localCache, fetchObject, fetchObjects);

    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    await cache.perform(push);

    let unload = new JsonApiCacheUnloadOneCommand({id: '123', type: 'person'});
    await cache.perform(unload);

    let get = new JsonApiCacheGetOneQuery({id: '123', type: 'person'});
    await cache.query(get);
    assert.ok(get.result);

    assert.ok(fetchObject.calledOnceWith({id: '123', type: 'person'}));
  });

});
