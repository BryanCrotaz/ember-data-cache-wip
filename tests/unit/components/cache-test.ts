import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { JsonApiCache } from 'ember-data-cache-wip/cache';
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

module('Unit | Component | cache', function(hooks) {
  setupTest(hooks);

  test('it constructs without error', function(assert) {
    let cache = new JsonApiCache();
    assert.ok(cache);
  });

  test('pushed object can be retrieved', function(assert) {
    let cache = new JsonApiCache();
    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    cache.perform(push);

    let get = new JsonApiCacheGetOneQuery({id: '123', type: 'person'});
    cache.query(get);
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

  test('get object that is not present returns null', function(assert) {
    let cache = new JsonApiCache();
    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    cache.perform(push);

    let get = new JsonApiCacheGetOneQuery({id: 'abc', type: 'person'});
    cache.query(get);
    assert.equal(get.result, null);
  });

  test('get object whose type is not present returns null', function(assert) {
    let cache = new JsonApiCache();
    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    cache.perform(push);

    let get = new JsonApiCacheGetOneQuery({id: '123', type: 'donkey'});
    cache.query(get);
    assert.equal(get.result, null);
  });

  test('pushed object can be retrieved with getMany', function(assert) {
    let cache = new JsonApiCache();
    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    cache.perform(push);

    let get = new JsonApiCacheGetManyQuery(
      [{id: '123', type: 'person'}]);
    cache.query(get);
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

  test('pushed object can be retrieved with getAllOfType', function(assert) {
    let cache = new JsonApiCache();
    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    cache.perform(push);

    let get = new JsonApiCacheGetAllOfTypeQuery('person');
    cache.query(get);
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

  test('getMany returns results and missing objects', function(assert) {
    let cache = new JsonApiCache();
    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    cache.perform(push);

    let get = new JsonApiCacheGetManyQuery(
      [
        {id: '123', type: 'person'},
        {id: 'abc', type: 'person'}
      ]
    );
    cache.query(get);

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

    assert.ok(get.missing);
    assert.equal(get.missing.length, 1);
    let missing = get.missing[0];
    if (missing) {
      assert.equal(missing.id, 'abc');
      assert.equal(missing.type, 'person');
    }
  });

  test('pushed object cannot be retrieved after unload one', function(assert) {
    let cache = new JsonApiCache();
    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    cache.perform(push);

    let unload = new JsonApiCacheUnloadOneCommand({id: '123', type: 'person'});
    cache.perform(unload);

    let get = new JsonApiCacheGetOneQuery({id: '123', type: 'person'});
    cache.query(get);
    assert.equal(get.result, null);
  });

  test('pushed object cannot be retrieved after unload many', function(assert) {
    let cache = new JsonApiCache();
    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    cache.perform(push);

    let unload = new JsonApiCacheUnloadManyCommand(
      [{id: '123', type: 'person'}]
    );
    cache.perform(unload);

    let get = new JsonApiCacheGetOneQuery({id: '123', type: 'person'});
    cache.query(get);
    assert.equal(get.result, null);
  });

  test('getAllOfType returns empty array when none of that type present', function(assert) {
    let cache = new JsonApiCache();
    let push = new JsonApiCachePushCommand({
      data: {
        id: '123',
        type: 'person',
        attributes: {
          name: 'Bryan'
        }
      }
    });
    cache.perform(push);

    let get = new JsonApiCacheGetAllOfTypeQuery('donkey');
    cache.query(get);
    assert.ok(get.result);
    assert.equal(get.result.length, 0);
  });

});
