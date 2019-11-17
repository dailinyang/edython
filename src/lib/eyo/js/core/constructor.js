/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Utility to make a constructor with some edython specific data storage and methods.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.require('eYo.Do')

goog.provide('eYo.Constructor')

/**
 * Make a constructor with an 'eyo__' property.
 * Caveat, constructors must have the same arguments.
 * Use a key->value design if you do not want that.
 * The `params` object has template: `{key: String, f: function, owner: Object, super: superClass}`
 * @param {!Object} model,  The dictionary of parameters.
 * @return {Object} the created constructor.
 * 
 */
eYo.Constructor.make = (model) => {
  model.owner || (model.owner = model.super) || eYo.throw('Missing `super` property.')
  var ctor
  if (eYo.isF(model.init)) {
    var endInit = model.init
  } else if (model.init) {
    var beginInit = model.init.begin
    endInit = model.init.end
  }
  if (model.super === null) {
    ctor = model.owner[model.key] = function () {
      beginInit && beginInit.apply(this, arguments)
      ctor.eyo__.init(this)
      endInit && endInit.apply(this, arguments)
    }
  } else {
    ctor = model.owner[model.key] = function () {
      ctor.superClass_.constructor.apply(this, arguments)
      beginInit && beginInit.apply(this, arguments)
      ctor.eyo__.init(this)
      endInit && endInit.apply(this, arguments)
    }
    eYo.Do.inherits(ctor, model.super || model.owner)
  }
  ctor.eyo__ = new eYo.Constructor.Dlgt(ctor, model)
  ctor.eyo__.makeDispose = (f) => {
    ctor.prototype.dispose = function () {
      try {
        this.dispose = eYo.Do.nothing
        f && f.apply(this, arguments)
        ctor.eyo__.dispose(this)
        var super_ = ctor.superClass_
        !!super_ && !!super_.dispose && !!super_.dispose.apply(this, arguments)
      } finally {
        delete this.dispose
      }
    }
  }
  ctor.eyo__.makeDispose()
  Object.defineProperty(ctor.prototype, 'eyo', {
    get () {
      return ctor.eyo__
    },
    set () {
      throw 'Forbidden setter'
    }
  })
  Object.defineProperties(ctor, {
    eyo: {
      get () {
        return this.eyo__
      },
      set () {
        throw 'Forbidden setter'
      }
    },
    eyo_: {
      get () {
        return this.eyo__
      },
      set () {
        throw 'Forbidden setter'
      }
    },
  })
  ;['owned', 'clonable', 'link', 'cached'].forEach(k => {
    var K = k[0].toUpperCase() + k.substring(1)
    var name = 'forEach' + K
    ctor.prototype[name] = function (f) {
      ctor.eyo[name].call(ctor.eyo, f)
    }
    name = 'some' + K
    ctor.prototype[name] = function (f) {
      return ctor.eyo[name].call(ctor.eyo, (k) => {
      })
    }
  })
  return ctor
}

/**
 * Object adding data to a constructor in a safe way.
 * @param {!Object} ctor,  the object to which this instance is attached.
 * @param {!String} name,  the key used when the constructor was created.
 * @constructor
 * @readonly
 * @property {Set<String>} link_ - Set of link identifiers. Lazy initializer.
 * @readonly
 * @property {Set<String>} owned_ - Set of link identifiers. Lazy initializer.
 * @readonly
 * @property {Set<String>} clonable_ - Set of link identifiers. Lazy initializer.
 * @readonly
 * @property {Set<String>} cached_ - Set of cached identifiers. Lazy initializer.
 */
eYo.Constructor.Dlgt = function (ctor, model) {
  this.ctor_ = ctor
  this.name_ = model.key
  var props = model.props
  if (props) {
    this.props_ = new Set()
    props.link && this.declareLink(props.link)
    props.owned && this.declareOwned(props.owned)
    props.cached && this.declareCached(props.cached)
    props.clonable && this.declareClonable(props.clonable)
    props.computed && this.declareComputed(props.computed)
  }
}

Object.defineProperties(eYo.Constructor.Dlgt.prototype, {
  ctor: {
    get () {
      return this.ctor_
    },
    set () {
      throw 'Forbidden setter'
    }
  },
  name: {
    get () {
      return this.name_
    },
    set () {
      throw 'Forbidden setter'
    }
  },
  super: {
    get () {
      var ctor = this.ctor_.superClass_
      return ctor && ctor.constructor.eyo
    }
  },
})

;['owned', 'clonable', 'link', 'cached'].forEach(k => {
  var k_ = k + '_'
  var k__ = k + '__'
  Object.defineProperty(eYo.Constructor.Dlgt.prototype, k_, {
    get () {
      return this[k__] || (this[k__] = new Set())
    }
  })
  /**
   * Owned enumerating loop.
   * @param {Function} helper,  signature (name) => {...}
   */
  var K = k[0].toUpperCase() + k.substring(1)
  var name = 'forEach' + K
  eYo.Constructor.Dlgt.prototype[name] = function (f) {
    this[k__] && this[k__].forEach(f)
  }
  name = 'some' + K
  eYo.Constructor.Dlgt.prototype[name] = function (f) {
    return this[k__] && this[k__].some(f)
  }
})

/**
 * Initialize an instance with link, cached, owned and clonable properties.
 * Default implementation forwards to super.
 * @param {Object} instance,  instance is an instance of a subclass of the `ctor_` of the receiver
 */
eYo.Constructor.Dlgt.prototype.init = function (object) {
  var suffix = '__'
  var f = k => {
    Object.defineProperty(object, k, {
      get () {
        return this[k + suffix]
      },
      set() {
        throw "Forbidden setter"
      },
    })
  }
  this.forEachLink(f)
  this.forEachOwned(f)
  this.forEachClonable(f)
  suffix = '_'
  this.forEachCached(f)
  this.forEachClonable(k => {
    var k__ = k + '__'
    object[k__] = this.initClonable_[k].call(this)
  })
}

/**
 * Dispose of the resources declared at that level.
 * @param {Object} instance,  instance is an instance of a subclass of the `ctor_` of the receiver
 */
eYo.Constructor.Dlgt.prototype.dispose = function (object) {
  this.clearLink_(object)
  this.forgetCached_(object)
  this.disposeOwned_(object)
  this.disposeClonable_(object)
}

/**
 * Add a link property.
 * The receiver is not the owner.
 * @param {String} k name of the link to add
 * @param {Object} model Object with `willChange` and `didChange` keys,
 * f any.
 */
eYo.Constructor.Dlgt.prototype.declareLink_ = function (k, model) {
  eYo.parameterAssert(!this.props_.has(k))
  this.link_.add(k)
  const proto = this.ctor_.prototype
  var k_ = k + '_'
  var k__ = k + '__'
  Object.defineProperties(
    proto, 
    {
      [k__]: {value: eYo.NA, writable: true},
      [k_]: {
        get () {
          return this[k__]
        },
        set (after) {
          var before = this[k__]
          if (before !== after) {
            var f = model && model.willChange
            if (!f || (f = f.call(this, before, after))) {
              var ff = this[k + 'WillChange']
              ff && ff.call(this, before, after)
              this[k__] = after
              f && f.call(this, before, after)
              f = model && model.didChange
              f && f.call(this, before, after)
              ff && ff.call(this, before, after)
              ff = this[k + 'DidChange']
              ff && ff.call(this, before, after)
            }
          }
        },
      },
    }
  )
}

/**
 * Add a link properties.
 * The receiver is not the owner.
 * @param {Object} constructor,  Its prototype object gains a storage named `foo__` and both getters and setters for `foo_`.
 * The initial value is `eYo.NA`.
 * @param {Array<String>} names names of the link to add
 */
eYo.Constructor.Dlgt.prototype.declareLink = function (model) {
  if (model.forEach) {
    model.forEach(k => {
      this.declareLink_(k)
    })
  } else {
    Object.keys(model).forEach(k => {
      this.declareLink_(k, model[k])
    })
  }
}

/**
 * Dispose in the given object, the link given by the constructor.
 * @param {Object} object,  an instance of the receiver's constructor,
 * or one of its subclasses.
 */
eYo.Constructor.Dlgt.prototype.clearLink_ = function (object) {
  this.forEachLink(k => {
    var k_ = k + '_'
    var x = object[k_]
    if (x) {
      object[k_] = eYo.NA
    }
  })
}

//// Properties

/**
 * Add a 3 levels property to a prototype.
 * `key__` is the basic private recorder.
 * `key_` is the basic private setter/getter.
 * Changing this property is encapsulated between `willChange` and `didChange` methods.
 * `k` is the public getter.
 * In the setter, we arrange things such that the new value
 * and the receiver have the same status with respoct to UI. 
 * The `get` and `set` keys allow to provide a getter and a setter.
 * In that case, the setter should manage ownership if required.
 * Add an owned object.
 * The receiver is not the owner.
 * @param {String} k name of the owned to add
 * @param {Object} data,  the object used to define the property: key `value` for the initial value, key `willChange` to be called when the property is about to change (signature (before, after) => function, truthy when the change should take place). The returned value is a function called after the change has been made in memory.
 */
eYo.Constructor.Dlgt.prototype.declareOwned_ = function (k, model = {}) {
  eYo.parameterAssert(!this.props_.has(k))
  this.owned_.add(k)
  const proto = this.ctor_.prototype
  var k_ = k + '_'
  var k__ = k + '__'
  Object.defineProperties(proto, {
    [k__]: {value: model.value || eYo.NA, writable: true},
    [k_]: {
      get: model.get || function () {
        return this[k__]
      },
      set: model.set
      ? function (after) {
        var before = this[k__]
        if(before !== after) {
          var f = model.willChange
          if (!f || (f = f.call(this, before, after))) {
            model.set.call(this, after)
            f && f(before, after)
          }
        }
      }
      : function (after) {
        var before = this[k__]
        if(before !== after) {
          var f = model.willChange
          if (!f || (f = f.call(this, before, after))) {
            var ff = this[k + 'WillChange']
            ff && ff.call(this, before, after)
            if (!!before && before.owner_) {
              before.owner_ = before.ownerKey_ = eYo.NA
            }
            this[k__] = after
            if (after) {
              if (after.owner_) {
                after.owner_[after.ownerKey_] = eYo.NA
              }
              after.ownerKey_ = k_
              after.owner_ = this
            } else if (typeof after === "object") {
              after.ownerKey_ = k_
              after.owner_ = this
            }
            f && f.call(this, before, after)
            f = model.didChange
            f && f.call(this, before, after)
            ff && ff.call(this, before, after)
            ff = this[k + 'DidChange']
            ff && ff.call(this, before, after)
            if (!!after && this.hasUI && after.initUI) {
              after.initUI()
            }
          }
        }
      },
    }
  })
}

/**
 * Add an owned property.
 * The receiver is the owner.
 * @param {Object} many  key -> data map.
 */
eYo.Constructor.Dlgt.prototype.declareOwned = function (many) {
  if (many.forEach) {
    many.forEach(k => {
      this.declareOwned_(k)
    })
  } else {
    Object.keys(many).forEach(k => {
      this.declareOwned_(k, many[k])
    })  
  }
}

/**
 * Add a 2 levels cached property to the receiver's constructor's prototype.
 * @param {String} key,  the key
 * @param {Object} model,  the model object, must have a `init` key and
 * may have a `forget` or an `update` key.
 * Both are functions called in the contect of the owner
 * (`this` is the owner). `init` takes no arguments.
 * `forget` takes only one argument: the concrete forgetter.
 * `update` arguments are the value before, the value after
 * (computed from the `init`) and the updater which is the function
 * that effectively set the new value.
 * It may take one argument to override the proposed after value.
 */
eYo.Constructor.Dlgt.prototype.declareCached_ = function (k, model) {
  eYo.parameterAssert(!this.props_.has(k))
  this.cached_.add(k)
  var proto = this.ctor_.prototype
  var k_ = k + '_'
  var k__ = k + '__'
  if (eYo.isF(model)) {
    var init = model
    model = Object.create(null)
  } else {
    init = model.init
  }
  Object.defineProperties(proto, {
    [k__]: {value: eYo.NA, writable: true},
    [k_]: {
      get () {
        var before = this[k__]
        if (eYo.isDef(before)) {
          return before
        }
        var after = init.call(this)
        return (this[k_] = after)
      },
      set (after) {
        var before = this[k__]
        if (before !== after) {
          var f = model && model.willChange
          if (!f || (f = f.call(this, before, after))) {
            var ff = this[k + 'WillChange']
            ff && ff.call(this, before, after)
            this[k__] = after
            f && f.call(this, before, after)
            f = model && model.didChange
            f && f.call(this, before, after)
            ff && ff.call(this, before, after)
            ff = this[k + 'DidChange']
            ff && ff.call(this, before, after)
          }
        }
      }
    }
  })
  this.forget_ || (this.forget_ = Object.create(null))
  proto[k+'Forget'] = this.forget_[k] = model.forget
  ? function () {
    model.forget.call(this, () => {
      this[k_] = eYo.NA
    })
  } : function () {
    this[k_] = eYo.NA
  }
  this.update_ || (this.update_ = Object.create(null))
  proto[k+'Update'] = this.update_[k] = model.update
  ? function (after) {
    var before = this[k__]
    eYo.isDef(after) || (after = init.call(this))
    if (before !== after) {
      model.update.call(this, before, after, (x) => {
        this[k_] = eYo.isDef(x)? x : after
      })
    }
  } : function (after) {
    var before = this[k__]
    eYo.isDef(after) || (after = init.call(this))
    if (before !== after) {
      this[k_] = after
    }
  }
}

/**
 * Add 3 levels cached properties to a prototype.
 * @param {Object} many,  the K => V mapping to which we apply `declareCached_(K, V)`.
 */
eYo.Constructor.Dlgt.prototype.declareCached = function (many) {
  Object.keys(many).forEach(n => {
    this.declareCached_(n, many[n])
  })
}

/**
 * Forget all the cached values.
 */
eYo.Constructor.Dlgt.prototype.forgetCached_ = function () {
  this.forEachCached(n => {
    this.forget_[n].call(this)
  })
}

/**
 * Add computed properties to a prototype.
 * @param {Map<String, Function>} models,  the key => Function mapping.
 */
eYo.Constructor.Dlgt.prototype.declareComputed = function (models) {
  var proto = this.ctor_.prototype
  var params = {
    get () {
      throw 'Forbidden getter'
    },
    set (after) {
      throw 'Forbidden setter'
    }
  }
  Object.keys(models).forEach(k => {
    eYo.parameterAssert(!this.props_.has(k))
    var k_ = k + '_'
    var k__ = k + '__'
    Object.defineProperties(proto, {
      [k]: {
        get () {
          return models[k].call(this)
        },
        set (after) {
          throw 'Forbidden setter'
        }
      },
      [k_]: params,
      [k__]: params,
    })
  })
}

/**
 * Add a 3 levels clonable property to a prototype.
 * `foo` is a clonable object means that `foo.clone` is a clone of `foo`
 * and `foo.set(bar)` will set `foo` properties according to `bar`.
 * @param {Map<String, Function|Object>} models,  the key => Function mapping.
 */
eYo.Constructor.Dlgt.prototype.declareClonable = function (models) {
  this.initClonable_ || (this.initClonable_ = Object.create(null))
  var proto = this.ctor_.prototype
  Object.keys(models).forEach(k => {
    eYo.parameterAssert(!this.props_.has(k))
    this.clonable_.add(k)
    var model = models[k]
    if (eYo.isF(model)) {
      var init = model
      model = {}
    } else {
      init = model.init
    }
    this.initClonable_[k] = init
    var k_ = k + '_'
    var k__ = k + '__'
    Object.defineProperties(proto, {
      [k__]: {value: eYo.KeyHandler, writable: true},
      [k_]: {
        get() {
          return this[k__].clone
        },
        set (after) {
          var before = this[k__]
          if (!before) {
            if (!after) {
              return
            }
            var setter = () => {
              this[k__] = after.clone
            }
            var f = model.willChange
            if (!f || (f = f.call(this, before, after))) {
              var ff = this[k + 'WillChange']
              ff && ff.call(this, before, after)
              this.wrapUpdate && this.wrapUpdate(setter) || setter()
              if (after.owner_) {
                after.owner_[after.ownerKey_] = eYo.NA
              }
              after.ownerKey_ = k_
              after.owner_ = this
              f && f.call(this, before, after)
              f = model.didChange
              f && f.call(this, before, after)
              ff && ff.call(this, before, after)
              ff = this[k + 'DidChange']
              ff && ff.call(this, before, after)
              if (!!after && this.hasUI && after.initUI) {
                after.initUI()
              }
            }
          } else if (before.equals(after)) {
            return
          }
          var f = model.willChange
          if (!f || (f = f(before, after))) {
            var ff = this[k + 'WillChange']
            ff && ff.call(this, before, after)
            if (!after) {
              before.owner_ = before.ownerKey_ = eYo.NA
            }
            var setter = () => {
              this[k__].set(after)
            }
            if (!!after && !!after.ownerKey_) {
              after.owner_[after.ownerKey_] = eYo.NA
            }
            this.wrapUpdate && this.wrapUpdate(setter) || setter()
            if (typeof after === "object") {
              after.ownerKey_ = k_
              after.owner_ = this
            }
            f && f(before, after)
            f = model.didChange
            f && f(before, after)
            ff && ff.call(this, before, after)
            ff = this[k + 'DidChange']
            ff && ff.call(this, before, after)
            if (!!after && this.hasUI && after.initUI) {
              after.initUI()
            }
          }
        },
      },
    })
  })
}

/**
 * Dispose in the given object, the properties given by their main name.
 * @param {Object} object, the object that owns the property
 * @param {Array<string>} names,  a list of names
 */
eYo.Constructor.Dlgt.prototype.disposeOwned_ = function (object) {
  this.forEachOwned(k => {
    var k_ = k + '_'
    var k__ = k + '__'
    var x = object[k__]
    if (x) {
      object[k_] = eYo.NA
      x.dispose()
    }
  })
}

/**
 * Dispose in the given object, the properties given by their main name.
 * @param {Object} object, the object that owns the property
 * @param {Array<string>} names,  a list of names
 */
eYo.Constructor.Dlgt.prototype.disposeClonable_ = function (object) {
  this.forEachClonable(k => {
    var k__ = k + '__'
    var x = object[k__]
    if (x) {
      object[k__] = eYo.NA
      x.dispose()
    }
  })
}

/**
 * Add the cached `app` property to the given prototype.
 * @param {Object} proto
 */
eYo.Constructor.Dlgt.prototype.addApp = function () {
  this.declareCached_('app', {
    get () {
      return this.owner__.app
    },
    forget () {
      this.forEachOwned(k => {
        var x = this[k]
        x && x.appForget && x.appForget()
      })
      this.ui_driverForget && this.ui_driverForget()
    }
  })
}

