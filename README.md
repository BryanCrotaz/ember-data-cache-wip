ember-data-cache-wip
==============================================================================

Experimental cache for the new look ember-data


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-data-cache-wip
```


Usage
------------------------------------------------------------------------------

Create a cache and use command and query objects to communicate with it.

**LocalCache**

A synchronous cache that stores objects in memory

**FetchingCache**

Wraps a `LocalCache` to add fetching from a remote source when objects are not present in the cache. Fetching is implemented by callbacks, so the cache is backend-agnostic. Fetched objects are pushed to the cache automatically.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
