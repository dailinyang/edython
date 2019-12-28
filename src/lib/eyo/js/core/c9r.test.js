'use strict';

const NS = Object.create(null)

NS.test_valued = (x, foo, bar) => {
  const foo_ = foo + '_'
  const foo__ = foo + '__'
  const bar_ = bar + '_'
  const bar__ = bar + '__'
  chai.assert(x[foo__] === eYo.NA && x[foo_] === eYo.NA && x[foo] === eYo.NA)
  chai.assert(x[bar__] === eYo.NA && x[bar_] === eYo.NA && x[bar] === eYo.NA)
  x[foo__] = 421
  chai.assert(x[foo__] === 421 && x[foo_] === 421 && x[foo] === 421)
  chai.assert(x[bar__] === eYo.NA && x[bar_] === eYo.NA && x[bar] === eYo.NA)
  x[bar__] = 123
  chai.assert(x[foo__] === 421 && x[foo_] === 421 && x[foo] === 421)
  chai.assert(x[bar__] === 123 && x[bar_] === 123 && x[bar] === 123)
  chai.expect(() => {x[bar] = 421}).to.throw()
  var eyo = x.constructor.eyo
  while (eyo) {
    eyo.valuedClear_(x)
    eyo = eyo.super
  }
  chai.assert(x[foo__] === eYo.NA && x[foo_] === eYo.NA && x[foo] === eYo.NA)
  chai.assert(x[bar__] === eYo.NA && x[bar_] === eYo.NA && x[bar] === eYo.NA)
}
describe ('POC', function () {
  this.timeout(10000)
  it ('initer', function () {
    var flag = 123
    var model = {
      foo (initer) {
        initer()
      },
      bar (initializer) {
        initializer || (flag = 321)
      }
    }
    var str = model.foo.toString()
    chai.assert(XRegExp.match(str, /^function \S*\([^,]*initer/))
    var str = model.bar.toString()
    chai.assert(!XRegExp.match(str, /^function \S*\([^,]*initer/))
  })
  it ('delete', function () {
    var ns = eYo.makeNS()
    chai.assert(!ns.Foo)
    ns.Foo = 123
    chai.assert(ns.Foo)
    delete ns.Foo
    chai.assert(!ns.Foo)
  })
})
describe ('Tests: C9r', function () {
  it ('C9r: basic', function () {
    chai.assert(eYo.makeClass)
    chai.assert(eYo.makeNS)
    chai.assert(eYo.Dlgt)
    chai.assert(eYo.Dflt)
  })
  describe('C9r: makeNS', function () {
    if ('makeNS: Basics', function () {
      var ns = eYo.makeNS()
      chai.assert(eYo.isNS(ns))
      chai.assert(eYo.isF(ns.Dlgt))
      chai.assert(eYo.isF(ns.Dflt))
      chai.assert(eYo.isSubclass(ns.Dflt, eYo.Dflt))
      chai.assert(eYo.isSubclass(ns.Dlgt, eYo.Dlgt))
      chai.assert(ns.Dlft.eyo.constructor === ns.Dlgt)
      chai.assert(ns.Dlgt.eyo.constructor === ns.Dlgt)  
    })
    it ('makeNS(...)', function () {
      var Foo = eYo.makeNS('___Foo')
      chai.assert(Foo && Foo === eYo.___Foo)
      chai.assert(Foo.makeNS)
      chai.assert(Foo.makeClass)
      chai.assert(Foo.super === eYo)
      chai.assert(Foo.name === 'eYo.___Foo')
      var ns = eYo.makeNS()
      chai.assert(ns.makeNS)
      chai.assert(ns.makeClass)
      chai.assert(ns.super === eYo)
      eYo.makeNS(ns, 'Foo')
      chai.assert(ns.Foo)
      chai.assert(ns.Foo.makeNS)
      chai.assert(ns.Foo.makeClass)
      chai.assert(ns.Foo.super === eYo)
      chai.assert(ns.Foo.name.endsWith('.Foo'))
    })
    it ('ns.makeNS(...)', function () {
      var ns = eYo.makeNS()
      chai.expect(() => { ns.makeNS() }).not.to.throw()
      ns.makeNS('Foo')
      chai.assert(ns.Foo)
      chai.assert(ns.Foo.makeNS)
      chai.assert(ns.Foo.makeClass)
      chai.assert(ns.Foo.super === ns)
      chai.assert(ns.Foo.name.endsWith('.Foo'))
      chai.assert(!ns.Bar)
      ns.Bar = 123
      chai.assert(ns.Bar)
      chai.expect(() => { ns.makeNS('Bar') }).to.throw()
      chai.expect(() => { eYo.makeNS(ns, 'Bar') }).to.throw()
      delete ns.Bar
      chai.expect(() => { eYo.makeNS(ns, 'Bar') }).not.to.throw()
      var nsbis = eYo.makeNS()
      nsbis.Bar = 123
      chai.expect(() => { nsbis.makeNS('Bar') }).to.throw()
      chai.expect(() => { eYo.makeNS(nsbis, 'Bar') }).to.throw()
      delete nsbis.Bar
      chai.expect(() => { nsbis.makeNS('Bar') }).not.to.throw()
    })
  })
  describe('C9r: makeClass', function () {
    this.timeout(10000)
    it ("ns.makeClass('Dlgt')", function () {
      var ns = eYo.makeNS()
      chai.assert(ns.Dlgt === eYo.Dlgt)
      ns.makeClass('Dlgt')
      chai.assert(ns.Dlgt && ns.Dlgt !== eYo.Dlgt)
      chai.assert(eYo.isSubclass(ns.Dlgt, eYo.Dlgt))
      chai.assert(ns.Dlgt.eyo.constructor === eYo.Dlgt)
      chai.assert(ns.Dlgt.eyo.ns === ns)
      chai.assert(ns.Dlgt.eyo.name.endsWith('.Dlgt'))
    })
    it ("eYo.Dlgt.makeSubclass(ns)", function () {
      var ns = eYo.makeNS()
      chai.assert(ns.Dlgt === eYo.Dlgt)
      eYo.Dlgt.makeSubclass(ns)
      chai.assert(ns.Dlgt && ns.Dlgt !== eYo.Dlgt)
      chai.assert(eYo.isSubclass(ns.Dlgt, eYo.Dlgt))
      chai.assert(ns.Dlgt.eyo.constructor === eYo.Dlgt)
      chai.assert(ns.Dlgt.eyo.ns === ns)
      chai.assert(ns.Dlgt.eyo.name.endsWith('.Dlgt'))
    })
    it ("ns.makeDlgt()", function () {
      var ns = eYo.makeNS()
      chai.assert(ns.Dlgt === eYo.Dlgt)
      ns.makeDlgt()
      chai.assert(ns.Dlgt !== eYo.Dlgt)
      chai.assert(eYo.isSubclass(ns.Dlgt, eYo.Dlgt))
      chai.assert(ns.Dlgt.eyo.constructor === eYo.Dlgt)
      chai.assert(ns.Dlgt.eyo.ns === ns)
      chai.assert(ns.Dlgt.eyo.name.endsWith('Dlgt'))
    })
    it ("makeDlgt throws", function () {
      var ns = eYo.makeNS()
      chai.assert(ns.Dlgt === eYo.Dlgt)
      Object.defineProperty(ns, 'Dlgt', {
        value: 123
      })
      chai.assert(ns.Dlgt === 123)
      chai.expect(() => {
        ns.makeClass('Dlgt')
      }).to.throw()
      chai.expect(() => {
        ns.makeDlgt()
      }).to.throw()
      chai.expect(() => {
        eYo.Dlgt.makeSubclass(ns)
      }).to.throw()
    })
    it ("eYo.Dflt.makeSubclass(ns)", function () {
      var ns = eYo.makeNS()
      chai.assert(ns.Dflt === eYo.Dflt)
      eYo.Dflt.makeSubclass(ns)
      chai.assert(ns.Dflt !== eYo.Dflt)
      chai.assert(eYo.isSubclass(ns.Dflt, eYo.Dflt))
      chai.assert(ns.Dflt.eyo.constructor === ns.Dlgt)
      chai.assert(ns.Dflt.eyo.ns === ns)
    })
    it ("ns.makeClass('Dflt')", function () {
      var ns = eYo.makeNS()
      chai.assert(ns.Dflt === eYo.Dflt)
      ns.makeClass('Dflt')
      chai.assert(ns.Dflt !== eYo.Dflt)
      chai.assert(eYo.isSubclass(ns.Dflt, eYo.Dflt))
      chai.assert(ns.Dflt.eyo.constructor === ns.Dlgt)
      chai.assert(ns.Dflt.eyo.ns === ns)
    })
    it ("eYo.makeClass(ns, 'Dflt')", function () {
      var ns = eYo.makeNS()
      chai.assert(ns.Dflt === eYo.Dflt)
      eYo.makeClass(ns, 'Dflt')
      chai.assert(ns.Dflt !== eYo.Dflt)
      chai.assert(eYo.isSubclass(ns.Dflt, eYo.Dflt))
      chai.assert(ns.Dflt.eyo.constructor === ns.Dlgt)
    })
    it ("ns.makeDflt()", function () {
      chai.assert(eYo.Dflt)
      var ns = eYo.makeNS()
      chai.assert(ns.Dflt === eYo.Dflt)
      ns.makeDflt()
      chai.assert(ns.Dflt && ns.Dflt !== eYo.Dflt)
      chai.assert(ns.Dflt.eyo.ns === ns)
      chai.assert(eYo.isSubclass(ns.Dflt, eYo.Dflt))
      chai.assert(ns.Dflt.eyo.constructor === ns.Dlgt)
      var ns = eYo.makeNS()
      Object.defineProperty(ns, 'Dflt', {
        value: 421
      })
      chai.expect(() => { ns.makeDflt() }).to.throw()
      chai.expect(() => { eYo.Dflt.makeSubclass(ns) }).to.throw()
      chai.expect(() => { eYo.makeClass(ns, 'Dflt') }).to.throw()
      chai.expect(() => { ns.makeClass('Dflt') }).to.throw()
    })
    it('eYo.makeClassDecorate', function () {
      return
      var ns0 = eYo.makeNS()
      ns0.makeDflt()
      ns0.makeClass('A')
      ns0.makeDlgt('DlgtA')
      ns0.makeClass('DfltA', ns0.DlgtA)
      var ns1 = ns0.makeNS()
      var nsX // the expected namespace
      var keyX // the expected namespace
      var SuperX // the expected Super
      var DlgtX // the expected Dlgt
      var modelX // the expected Dlgt
      var f = eYo.makeClassDecorate(function (ns, key, Super, Dlgt, model) {
        var msg = `{ns: ${ns.name}, key: ${key}, Super: ${Super.eyo.name}, Dlgt: ${Dlgt.eyo.name}, model: ${model.foo_}}`
        chai.assert(ns === nsX, msg)
        chai.assert(key === keyX, msg)
        chai.assert(Super === SuperX, msg)
        chai.assert(Dlgt === DlgtX, msg)
        chai.assert(model === modelX, msg)
      })
      ;[eYo.NA, ns1].forEach(ns => {
        nsX = ns || eYo
        ;[eYo.NA, 'A', 'B'].forEach(key => {
          ;[eYo.NA, null, eYo.Dflt, ns0.Dflt, ns0.A, ns0.DfltA].forEach(Super => {
            keyX = key || Super && Super.eyo.key
            ;[eYo.NA, eYo.Dlgt, ns0.Dlgt, ns0.DlgtA].forEach(Dlgt => {
              DlgtX = eYo.DlgtX
              eYo.isSubclass(nsX.Dlgt, DlgtX) && (DlgtX = nsX.Dlgt)
              Super && eYo.isSubclass(Super.eyo.constructor, DlgtX) && (DlgtX = Super.eyo.constructor)
              ;[eYo.NA, {foo: 'bar'}].forEach(model => {
                modelX = model || {}
                var args = [ns, key, Super, Dlgt, model].filter(x => !eYo.isNA(x))
                if (['Dflt', 'Dlgt'].includes(keyX)) {
                  chai.expect(() => {
                    f.apply(eYo, args)
                  }).to.throw()
                } else if (!keyX || eYo.hasOwnProperty(nsX, keyX)) {
                  chai.expect(() => {
                    f.apply(eYo, args)
                  }).to.throw()
                } else {
                  chai.expect(() => {
                    f.apply(eYo, args)
                  }).not.to.throw()
                }
              })              
            })              
          })
        })
      })
    })
    it ("eYo.makeClass(ns, 'A')", function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      chai.expect(()=>{ eYo.makeClass() }).to.throw()
      eYo.makeClass(ns, 'A')
      chai.assert(ns.A_s === ns.Dflt_p)
      chai.assert(ns.A.eyo.constructor === ns.Dlgt)
      chai.expect(()=>{ eYo.makeClass(ns, 'A') }).to.throw()
    })
    it ("eYo.makeClass(ns, 'A', Super, Dlgt, model)", function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      var Super = ns.Dflt
      var Dlgt = ns.Dlgt
      eYo.makeClass(ns, 'A', Super, Dlgt, {
        init (x) {
          flag += x
        }
      })
      chai.assert(ns.A)
      chai.assert(eYo.isSubclass(ns.A, ns.Dflt))
      chai.assert(ns.A_s === ns.Dflt.prototype)
      chai.assert(ns.A.eyo.constructor === ns.Dlgt)
      var flag = 0
      new ns.A(123)
      chai.assert(flag === 123)
    })
    it ("eYo.makeClass('_A')", function () {
      if (!eYo._A) {
        var A = eYo.makeClass('_A')
        chai.assert(A)
        chai.assert(!A.constructor.superProto_)
        chai.assert(A.eyo.constructor === eYo.Dlgt)
        chai.assert(eYo.isF(A.makeSubclass))
      }
    })
    it ("NO eYo.makeClass('_A')", function () {
      if (eYo._A) {
        chai.expect(() => {eYo.makeClass('_A')}).to.throw()
      }
    })
    it ("ns.makeClass('A')", function () {
      var ns = eYo.makeNS()
      ns.makeClass('A')
      chai.assert(eYo.isF(ns.A))
      chai.assert(ns.A.eyo.name.endsWith('.A'))
      chai.assert(ns.A.eyo.ns === ns)
      chai.assert(ns.A.eyo.constructor === ns.Dlgt)
      chai.assert(ns.A_p === ns.A.prototype)
      chai.assert(ns.A_s === ns.Dflt.prototype)
    })
    it ('makeClassDecorate', function () {
      return
      var n = 0
      var getKey = () => {
        ++n
        return `A_${n}`
      }
      var getArgs = (ns, Super, Dlgt, withModel) => {
        // console.warn('makeClass:', [ns && ns.k__ || 'NA', "'A'", Super && Super.k__ || 'NA', Dlgt && Dlgt.k__ || 'NA', withModel ? 'model' : 'NA'])
        var args = []
        ns && args.push(ns)
        args.push(getKey())
        Super && args.push(Super)
        Dlgt && args.push(Dlgt)
        withModel && args.push(model(421))
        return args
      }
      var ns0 = eYo.makeNS()
      ns0.makeDflt()
      ns0.Dlgt.makeSubclass('Dlgt0')
      ns0.Dflt.makeSubclass('Super0', ns0.Dlgt0)
      var ns1 = ns0.makeNS()
      ns1.makeDflt()
      ns1.Dlgt.makeSubclass('Dlgt1')
      ns1.Dflt.makeSubclass('Super1', ns1.Dlgt1)
      var A_X, SuperX, DlgtX, modelX
      ;[eYo.NA, ns0, ns1].forEach(ns => {
        ;[eYo.NA, 'A'].forEach(key => {
          ;[eYo.NA, ns0.Dflt, ns0.Super0, ns1.Dflt, ns1.Super1].forEach(Super => {
            ;[eYo.NA, ns0.Dlgt, ns0.Dlgt0, ns1.Dlgt, ns1.Dlgt1].forEach(Dlgt => {
              DlgtX = getDlgtX(SuperX, Dlgt)
              ;[false, true].forEach(withModel => {
                var args = getArgs(ns, Super, Dlgt, withModel)
                eYo.makeClassDecorate((nsX, keyX, SuperX, DlgtX, modelX) => {
                  console.warn(`ns: ${ns && ns.name}, key: ${key}, Super: ${Super && Super.eyo.name}, Dlgt: ${Dlgt && Dlgt.eyo.name}, model: ${model}`)
                  console.warn(`nsX: ${nsX.name}, keyX: ${keyX}, SuperX: ${SuperX && SuperX.eyo.name}, DlgtX: ${DlgtX.eyo.name}, modelX: ${modelX}`)
                }).apply(null, args)
              })
            })
          })
        })
      })
    })
    it ("eYo...makeSubclass('AB')", function () {
      var ns = eYo.makeNS()
      var A = ns.makeClass('A')
      var AB = A.makeSubclass('AB')
      chai.assert(AB)
      chai.assert(AB.prototype.constructor === AB)
    })
    it ("ns.A.makeSubclass('AB')", function () {
      var ns = eYo.makeNS()
      ns.makeClass('A')
      ns.A.makeSubclass('AB')
      chai.assert(eYo.isF(ns.AB))
      chai.assert(ns.AB.eyo.name.endsWith('.AB'))
      chai.assert(ns.AB.eyo.ns === ns)
      chai.assert(ns.AB_p === ns.AB.prototype)
      chai.assert(ns.AB_s === ns.A.prototype)
      chai.assert(eYo.isSubclass(ns.AB, ns.A))
      chai.assert(eYo.isSubclass(ns.AB.eyo.constructor, ns.A.eyo.constructor))
    })
  })
})
describe('C9r.Model', function () {
  this.timeout(10000); 
  it ('C9r.Model: POC', function () {
    chai.assert(XRegExp.match('abc', /abc/))
    var x = {
      ['abc']: ''
    }
    for (var k in x) {
      chai.assert(XRegExp.match('abc', XRegExp(k)))
      chai.assert(XRegExp(k).test('abc'))
    }
  })
  it ('eYo.C9r.Model.isAllowed(path, k)', function () {
    chai.assert(eYo.C9r.Model.isAllowed('', 'init'))
    chai.assert(eYo.C9r.Model.isAllowed('owned', 'abc'))
    chai.assert(eYo.C9r.Model.isAllowed('owned.abc', 'validate'))
  })
  it ('Inheritance 1', function () {
    var base = {init: 421}
    var model = {}
    eYo.C9r.Model.extends(model, base)
    chai.assert(model.init === 421)
  })
  it ('Inheritance 2', function () {
    var base = {xml: {attr: 421}}
    var model = {}
    eYo.C9r.Model.extends(model, base)
    chai.assert(model.xml.attr === 421)
  })
  it ('Inheritance 3', function () {
    var base = {
      xml: {
        attr: 421
      }
    }
    var model = {
      xml: {
        types: 123
      }
    }
    eYo.C9r.Model.extends(model, base)
    chai.assert(model.xml.attr === 421)
    chai.assert(model.xml.types === 123)
  })
  it ('Inheritance 4', function () {
    var base = {
      data: {
        aa: 421
      }
    }
    var model = {
      data: {
        aa: {
          xml: 421
        },
        ab: 123
      },
      owned: 421,
    }
    var submodel = {
      data: {
        ab: 421
      }
    }
    eYo.C9r.Model.extends(model, base)
    eYo.C9r.Model.extends(submodel, model)
    chai.assert(submodel.data.aa.xml === 421)
    chai.assert(submodel.data.ab === 421)
    chai.assert(submodel.owned === 421)
  })
})
describe ('Dlgt', function () {
  this.timeout(10000)
  describe ('make', function () {
    it ('Make: Missing', function () {
      chai.assert(eYo.Dlgt)
      chai.assert(eYo.makeClass)
    })
    it ('Make: super: implicit', function () {
      var ns = eYo.makeNS()
      eYo.makeClass(ns, 'A', {
         valued: ['foo', 'bar'],
      })
      chai.assert(ns.A)
      const a = new ns.A()
      NS.test_valued(a, 'foo', 'bar')
    })  
    it ('Make: constructor call', function () {
      var ns = eYo.makeNS()
      var flag = 0
      eYo.makeClass(ns, 'A', null, {
        init (x) {
          flag += x
        }
      })
      chai.assert(!ns.A_s)
      var a = new ns.A(1)
      chai.assert(flag === 1)
      a = new ns.A(2)
      chai.assert(flag === 3)
    })
    it ('Make: super !== null', function () {
      var ns = eYo.makeNS()
      var flag_A = 0
      eYo.makeClass(ns, 'A', null, {
        init (x) {
          flag_A += x
        },
        valued: ['foo'],
      })
      chai.assert(ns.A.eyo.valued_.has('foo'))
      chai.assert(!ns.A.eyo.valued_.has('bar'))
      var flag_AB = 0
      ns.makeClass('AB', ns.A, {
        init (x) {
          flag_AB += x
        },
        valued: ['bar'],
      })
      chai.assert(ns.A.eyo.valued_.has('foo'))
      chai.assert(!ns.A.eyo.valued_.has('bar'))
      chai.assert(ns.AB.eyo.valued_.has('foo'))
      chai.assert(ns.AB.eyo.valued_.has('bar'))
      var ab = new ns.AB(1)
      chai.assert(flag_A === 1)
      chai.assert(flag_AB === 1)
      NS.test_valued(ab, 'foo', 'bar')
    })  
    it ('Make: multi super !== null', function () {
      var ns = eYo.makeNS()
      var flag_A = 0
      eYo.makeClass(ns, 'A', null, {
        init (x) {
          flag_A += x
        },
        valued: ['foo'],
      })
      var flag_B = 0
      eYo.makeClass(ns, 'B', null, {
        init (x) {
          flag_B += 10 * x
        },
        valued: ['foo'],
      })
      var flag_AA = 0
      eYo.makeClass(ns, 'AA', ns.A, {
        init (x) {
          flag_AA += 100 * x
        },
        valued: ['bar'],
      })
      var flag_AB = 0
      eYo.makeClass(ns, 'AB', ns.A, {
        init (x) {
          flag_AB += 1000 * x
        },
        valued: ['bar'],
      })
      var flag_BA = 0
      eYo.makeClass(ns, 'BA', ns.B, {
        init (x) {
          flag_BA += 10000 * x
        },
        valued: ['bar'],
      })
      var flag_BB = 0
      eYo.makeClass(ns, 'BB', ns.B, {
        init (x) {
          flag_BB += 100000 * x
        },
        valued: ['bar'],
      })
      flag_A = flag_B = flag_AA = flag_AB = flag_BA = flag_BB = 0
      var aa = new ns.AA(3)
      chai.assert(flag_A === 3)
      chai.assert(flag_AA === 300)
      NS.test_valued(aa, 'foo', 'bar')
      flag_A = flag_B = flag_AA = flag_AB = flag_BA = flag_BB = 0
      var ab = new ns.AB(4)
      chai.assert(flag_A === 4)
      chai.assert(flag_AB === 4000)
      NS.test_valued(ab, 'foo', 'bar')
      flag_A = flag_B = flag_AA = flag_AB = flag_BA = flag_BB = 0
      var ba = new ns.BA(5)
      chai.assert(flag_B === 50)
      chai.assert(flag_BA === 50000)
      NS.test_valued(ba, 'foo', 'bar')
      flag_A = flag_B = flag_AB = flag_BA = flag_BB = 0
      var bb = new ns.BB(6)
      chai.assert(flag_B === 60)
      chai.assert(flag_BB === 600000)
      NS.test_valued(bb, 'foo', 'bar')
    })
    it ('Make: undefined owner xor super', function () {
      var ns = eYo.makeNS()
      var flag_A = 0
      eYo.makeClass(ns, 'A', null, {
        init (x) {
          flag_A += x
        }
      })
      var flag_B = 0
      eYo.makeClass(ns, 'B', ns.A, {
        init (x) {
          flag_B += 10 * x
        },
         valued: ['foo', 'bar'],
      })
      chai.assert(ns.B_s.constructor === ns.A)
      var ab = new ns.B(1)
      chai.assert(flag_A === 1)
      chai.assert(flag_B === 10)
      NS.test_valued(ab, 'foo', 'bar')
    })
    it ('Make: initer shortcuts 1', function () {
      var ns = eYo.makeNS()
      var flag = 0
      var make = (init) => {
        ns = eYo.makeNS()
        eYo.makeClass(ns, 'A', null, {
          init: init
        })
        return new ns.A()
      }
      make(function () {
        flag = 421
      })
      chai.assert(flag === 421)
      make(function (initer) {
        flag = 123
        initer ()
        flag += 421
      })
      chai.assert(flag === 544)
    })
    it ('Make: initer shortcuts 2', function () {
      var ns = eYo.makeNS()
      var flag = 0
      eYo.makeClass(ns, 'A', null, {
        init () {
          flag += 123
        }
      })
      new ns.A()
      chai.assert(flag === 123)
      ns.A.makeSubclass('AB', {
        init ( initer) {
          flag *= 1000
          initer ()
          flag += 421
        }
      })
      new ns.AB()
      chai.assert(flag === 123544)
    })
    it ('Make: dispose', function () {
      var ns = eYo.makeNS()
      var flag = 0
      eYo.makeClass(ns, 'A', null, {
        dispose(x) {
          flag += x
        }
      })
      eYo.makeClass(ns, 'AB', ns.A, {
        dispose(x) {
          flag += x * 10
        }
      })
      flag = 0
      chai.expect(() => {
        new ns.A().dispose(1)
      }).to.throw()
      ns.A_p.ui_driver = {
        doDisposeUI: eYo.Do.nothing
      }
      new ns.A().dispose(1)
      chai.assert(flag === 1)
      flag = 0
      new ns.AB().dispose(1)
      chai.assert(flag === 11)
    })
  })
  describe ('makeClass', function () {
    var testX = (X, Super, Dlgt) => {
      chai.assert(X)
      chai.assert(eYo.isSubclass(X, Super))
      chai.assert(X.eyo)
      chai.assert(!Dlgt || X.eyo.constructor === Dlgt)
      chai.assert(!Super || X.eyo.super === Super.eyo)
      chai.assert(!Super || X.superProto_ === Super.prototype)
      chai.assert(!Super || X.superProto_.constructor === Super)
      chai.expect(() => {
        new X()
      }).not.to.throw()
    }
    it (`eYo.makeClass('...')`, function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      eYo.makeClass(ns, 'A')
      testX(ns.A, ns.Dflt, ns.Dlgt)
    })
    it (`eYo.makeClass('...', {...})`, function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
        var flag_A = 0
      eYo.makeClass(ns, 'A', {
        init () {
          flag_A += 1
        }
      })
      testX(ns.A, ns.Dflt, ns.Dlgt)
      chai.assert(flag_A === 1)
    })
    it (`eYo.makeClass(NS, '...')`, function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      eYo.makeClass(ns, 'A')
      testX(ns.A, ns.Dflt, ns.Dlgt)
    })
    it (`eYo.makeClass(ns, '...', {...})`, function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      var flag_A = 0
      eYo.makeClass(ns, 'A', {
        init () {
          flag_A += 1
        }
      })
      testX(ns.A, ns.Dflt, ns.Dlgt)
      chai.assert(flag_A===1)
    })
    it (`eYo.makeClass('...', Super = eYo.Dflt)`, function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      eYo.makeClass(ns, 'A', ns.Dflt)
      testX(ns.A, ns.Dflt, ns.Dlgt)
    })
    it (`eYo.makeClass('...', Super = eYo.Dflt, {...})`, function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      var flag_A = 0
      ns.makeClass('A', ns.Dflt, {
        init () {
          flag_A += 1
        }
      })
      testX(ns.A, ns.Dflt, ns.Dlgt)
      chai.assert(flag_A===1)
    })
    it (`eYo.makeClass(NS, '...', Super = eYo.Dflt)`, function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      eYo.makeClass(ns, 'A', ns.Dflt)
      testX(ns.A, ns.Dflt, ns.Dlgt)
    })
    it (`eYo.makeClass(NS, '...', Super = eYo.Dflt, {...})`, function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      var flag_A = 0
      eYo.makeClass(ns, 'A', eYo.Dflt, {
        init () {
          flag_A += 1
        }
      })
      chai.assert(ns.A)
      chai.assert(ns.A.superProto_ === ns.Dflt.prototype)
      chai.assert(ns.A.superProto_.constructor === ns.Dflt)
      chai.expect(() => {
        new ns.A()
      }).not.to.throw()
      chai.assert(flag_A===1)
    })
    it (`eYo.makeClass('...', eYo.Dflt, {...}?)`, function () {
      var Super = eYo.Dflt
      var ns = eYo.makeNS()
      ns.makeDflt()
      eYo.makeClass(ns, 'A', Super)
      chai.assert(ns.A.eyo.super === ns.Dflt.eyo)
      testX(ns.A, ns.Dflt, ns.Dlgt)
      var ns = eYo.makeNS()
      ns.makeDflt()
      var flag_A = 0
      eYo.makeClass(ns, 'A', ns.Dflt, ns.Dlgt, {
        init () {
          flag_A += 1
        }
      })
      testX(ns.A, ns.Dflt, ns.Dlgt)
      chai.assert(flag_A===1)
    })
    it (`eYo.makeClass('...', Super|eYo.Dflt, {...}?)`, function () {
      var Super = function () {}
      Super.eyo = new eYo.Dlgt(eYo, Super, {})
      var ns = eYo.makeNS()
      ns.makeDflt()
      eYo.makeClass(ns, 'A', Super)
      chai.assert(ns.A.eyo.super === Super.eyo)
      testX(ns.A, Super, ns.Dlgt)
    })
    it (`eYo.makeClass('...', Super = eYo.Dflt, {...})`, function () {
      var flag_A = 0
      var A = eYo.makeClass('___A', eYo.Dflt, {
        init () {
          flag_A += 1
        }
      })
      chai.assert(A)
      chai.assert(A.eyo)
      chai.assert(A.eyo.super === eYo.Dflt.eyo)
      chai.assert(A.superProto_ === eYo.Dflt.prototype)
      chai.assert(A.superProto_.constructor === eYo.Dflt)
      chai.expect(() => {
        new A()
      }).not.to.throw()
      chai.assert(flag_A===1)
    })
    it (`eYo.makeClass(NS, '...', Super = eYo.Dflt)`, function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      eYo.makeClass(ns, 'A', eYo.Dflt)
      chai.assert(ns.A)
      chai.assert(ns.A.eyo)
      chai.assert(ns.A.eyo.super === ns.Dflt.eyo)
      chai.assert(ns.A.superProto_ === ns.Dflt.prototype)
      chai.assert(ns.A.superProto_.constructor === ns.Dflt)
      chai.expect(() => {
        new ns.A()
      }).not.to.throw()
    })
    it (`eYo.makeClass(NS, '...', Super = eYo.Dflt, {...})`, function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      var flag_A = 0
      eYo.makeClass(ns, 'A', eYo.Dflt, {
        init () {
          flag_A += 1
        }
      })
      chai.assert(ns.A)
      chai.assert(ns.A.superProto_ === ns.Dflt.prototype)
      chai.assert(ns.A.superProto_.constructor === ns.Dflt)
      chai.expect(() => {
        new ns.A()
      }).not.to.throw()
      chai.assert(flag_A===1)
    })
    it (`?eYo.makeClass(NS, '...', Super, Dlgt, {...})`, function () {
      var ns = eYo.makeNS()
      ns.makeDflt()
      var flag_A = 0
      var flag_AB = 0
      eYo.makeClass(ns, 'A', {
        init () {
          flag_A += 1
        }
      })
      eYo.makeClass(ns, 'AB', ns.A, {
        init () {
          flag_AB += 1
        }
      })
      chai.assert(ns.AB.eyo.super === ns.A.eyo)
      chai.assert(ns.A.eyo.super === ns.Dflt.eyo)
      new ns.AB()
      chai.assert(flag_A === 1)
      chai.assert(flag_AB === 1)
    })
  })
  describe ('Valued', function () {
    it ("Valued: declare 'foo' and 'bar' then clear", function () {
      var ns = eYo.makeNS()
      ns.makeClass('A', null, {
        valued: ['foo', 'bar'],
      })
      console.error('Generalize the C9r test')
      chai.assert(ns.A.eyo.C9r === ns.A)
      chai.expect(() => {
        Object.defineProperties(ns.A.prototype, {
          foo_: {
            set (after) {
            }
          }
        })
      }).to.throw()
      chai.assert(ns.A.eyo.valued_.has('foo'))
      chai.assert(ns.A.eyo.valued_.has('bar'))
      const a = new ns.A()
      NS.test_valued(a, 'foo', 'bar')
    })
    it ('Valued: hooks', function () {
      var ns = eYo.makeNS()
      var flag = 0
      var foo_before = 421
      var foo_after = 123
      var test = function (before, after) {
        chai.assert(this === a)
        chai.assert(before === foo_before)
        chai.assert(after === foo_after)
      }
      eYo.makeClass(ns, 'A', null, {
        init (value) {
          this.foo__ = value
        },
        valued: {
          foo: {
            willChange (before, after) {
              eYo.isNA(before) || test.call(this, before, after)
              return () => {
                flag = 421
              }
            },
            didChange: test
          }
        },
      })
      ns.A.prototype.fooWillChange = ns.A.prototype.fooDidChange = test
      var a = new ns.A(foo_before)
      chai.assert(a.foo === foo_before)
      a.foo_ = foo_after
      chai.assert(flag === 421)
    })
  })
  describe('Cached property', function () {
    it ('Cached: Basic', function () {
      var ns = eYo.makeNS()
      var flag = 0
      eYo.makeClass(ns, 'A', null, {
        cached: {
          foo: {
            init () {
              return flag
            }
          }
        },
      })
      var a1 = new ns.A()
      var a2 = new ns.A()
      chai.assert(a1.foo === 0)
      flag = 1
      chai.assert(a1.foo === 0)
      chai.assert(a2.foo === 1)
      a1.fooForget()
      chai.assert(a1.foo === 1)
    })
    it ('Cached: Shortcut', function () {
      var ns = eYo.makeNS()
      var flag = 0
      eYo.makeClass(ns, 'A', null, {
        cached: {
          foo () {
            return flag
          }
        },
      })
      var a1 = new ns.A()
      var a2 = new ns.A()
      chai.assert(a1.foo === 0)
      flag = 1
      chai.assert(a1.foo === 0)
      chai.assert(a2.foo === 1)
      a1.fooForget()
      chai.assert(a1.foo === 1)
    })
    it ('Cached: Two objects', function () {
      var ns = eYo.makeNS()
      var flag_A1 = 0
      var flag_A2 = 1
      var flag_B1 = 2
      var flag_B2 = 3
      eYo.makeClass(ns, 'A', null, {
        cached: {
          foo1: {
            init () {
              return flag_A1
            }
          },
          foo2: {
            init () {
              return flag_A2
            }
          }
        },
      })
      eYo.makeClass(ns, 'B', null, {
        cached: {
          foo1: {
            init () {
              return flag_B1
            }
          },
          foo2: {
            init () {
              return flag_B2
            }
          }
        },
      })
      var a = new ns.A()
      var b = new ns.B()
      var test = (a1, a2, b1, b2) => {
        chai.assert(a.foo1 === a1)
        chai.assert(a.foo2 === a2)
        chai.assert(b.foo1 === b1)
        chai.assert(b.foo2 === b2)
      }
      test(0, 1, 2, 3)
      flag_A1 = 10
      test(0, 1, 2, 3)
      a.foo1Forget()
      test(10, 1, 2, 3)
      flag_A2 = 11
      test(10, 1, 2, 3)
      a.foo2Forget()
      test(10, 11, 2, 3)
      flag_B1 = 12
      test(10, 11, 2, 3)
      b.foo1Forget()
      test(10, 11, 12, 3)
      flag_B2 = 13
      test(10, 11, 12, 3)
      b.foo2Forget()
      test(10, 11, 12, 13)
    })
    it ('Cached: Inherit cached', function () {
      var ns = eYo.makeNS()
      var flag_1 = 0
      var flag_2 = 1
      eYo.makeClass(ns, 'A', null, {
        cached: {
          foo1: {
            init () {
              return flag_1
            }
          }
        },
      })
      eYo.makeClass(ns, 'AB', ns.A, {
        cached: {
          foo2: {
            init () {
              return flag_2
            }
          }
        },
      })
      var ab = new ns.AB()
      var test = (f1, f2) => {
        chai.assert(ab.foo1 === f1)
        chai.assert(ab.foo2 === f2)
      }
      test(0, 1)
      flag_1 = 10
      test(0, 1)
      ab.foo1Forget()
      test(10, 1)
      flag_2 = 11
      test(10, 1)
      ab.foo2Forget()
      test(10, 11)
    })
    it ('Cached: forget', function () {
      var ns = eYo.makeNS()
      var flag = 123
      eYo.makeClass(ns, 'A', null, {
        cached: {
          foo: {
            init () {
              return flag
            },
            forget (forgetter) {
              flag += 100
              forgetter()
            },
          }
        },
      })
      var a = new ns.A()
      chai.assert(a.foo === 123)
      flag = 421
      a.fooForget()
      chai.assert(a.foo === 521)
    })
    it ('Cached: updater basic', function () {
      var ns = eYo.makeNS()
      var flag = 421
      eYo.makeClass(ns, 'A', null, {
        cached: {
          foo: {
            init () {
              return flag
            }
          }
        },
      })
      var a = new ns.A()
      chai.assert(a.foo === 421)
      flag = 521
      a.fooUpdate()
      chai.assert(a.foo === 521)
    })
    it ('Cached: updater no override', function () {
      var ns = eYo.makeNS()
      var flag = 421
      eYo.makeClass(ns, 'A', null, {
        cached: {
          foo: {
            init () {
              return flag
            },
            update (before, after, updater) {
              flag = 0
              if (before === 421) {
                flag += 1
              }
              if (after === 123) {
                flag += 10
              }
              updater()
            }
          }
        },
      })
      var a = new ns.A()
      chai.assert(a.foo === 421)
      flag = 123
      a.fooUpdate()
      chai.assert(flag === 11)
      chai.assert(a.foo === 123)
    })
    it ('Cached: updater with override', function () {
      var ns = eYo.makeNS()
      var flag = 421
      eYo.makeClass(ns, 'A', null, {
        cached: {
          foo: {
            init () {
              return flag
            },
            update (before, after, updater) {
              updater(flag+100)
            }
          }
        },
      })
      var a = new ns.A()
      chai.assert(a.foo === 421)
      flag = 123
      a.fooUpdate()
      chai.assert(a.foo === 223)
    })
  })
  describe('Owned', function () {
    it ('Owned: Basic', function () {
      var ns = eYo.makeNS()
      eYo.makeClass(ns, 'A', null, {
        owned: ['foo']
      })
      ns.A_p.ui_driver = {
        doDisposeUI: eYo.Do.nothing
      }
      var a = new ns.A()
      chai.expect(() => {a.foo = 1}).to.throw()
      var B = function () {}
      B.prototype.dispose = function () {
        this.disposed_ = true
      }
      var b = new B()
      chai.assert(b.owner_ === eYo.NA)
      chai.assert(b.ownerKey_ === eYo.NA)
      chai.assert(!b.disposed_)
      a.foo_ = b
      chai.assert(b.owner_ === a)
      chai.assert(b.ownerKey_ === 'foo_')
      chai.assert(a.foo === b)
      chai.assert(a.foo_ === b)
      chai.assert(a.foo__ === b)
      a.dispose()
      chai.assert(a.foo === eYo.NA)
      chai.assert(a.foo_ === eYo.NA)
      chai.assert(a.foo__ === eYo.NA)
      chai.assert(b.owner_ === eYo.NA)
      chai.assert(b.ownerKey_ === eYo.NA)
      chai.assert(b.disposed_)
    })
    it ('Owned: Two instances', function () {
      var ns = eYo.makeNS()
      eYo.makeClass(ns, 'A', null, {
        owned: ['foo']
      })
      var a1 = new ns.A()
      var a2 = new ns.A()
      var B = function () {}
      var b1 = new B()
      a1.foo_ = b1
      var b2 = new B()
      a2.foo_ = b2
      var test1 = (a,b) => {
        chai.assert(a.foo === b)
        chai.assert(b.owner_ === a)
        chai.assert(b.ownerKey_ === 'foo_')
      }
      test1(a1, b1)
      test1(a2, b2)
      a1.foo_ = eYo.NA
      var test2 = (a, b) => {
        chai.assert(a.foo === eYo.NA)
        chai.assert(b.owner_ === eYo.NA)
        chai.assert(b.ownerKey_ === eYo.NA)
      }
      test2(a1, b1)
      test1(a2, b2)
      a2.foo_ = b1
      test2(a1, b2)
      test1(a2, b1)
      a1.foo_ = b2
      test1(a1, b2)
      test1(a2, b1)
      a1.foo_ = b1
      test2(a2, b2)
      test1(a1, b1)
      a2.foo_ = b2
      test1(a2, b2)
      test1(a1, b1)
    })
    it ('Owned: Two keys', function () {
      var ns = eYo.makeNS()
      eYo.makeClass(ns, 'A', null, {
        owned: ['foo1', 'foo2']
      })
      var a = new ns.A()
      var B = function () {}
      B.prototype.dispose = function () {
        this.disposed_ = true
      }
      var b1 = new B()
      var b2 = new B()
      var test = (foo1, foo2, bb1, bb2) => {
        chai.assert(a.foo1 === foo1)
        chai.assert(a.foo2 === foo2)
        foo1 && chai.assert(foo1.owner_ === a)
        foo1 && chai.assert(foo1.ownerKey_ === 'foo1_')
        foo2 && chai.assert(foo2.owner_ === a)
        foo2 && chai.assert(foo2.ownerKey_ === 'foo2_')
        bb1 && chai.assert(bb1.owner_ === eYo.NA)
        bb1 && chai.assert(bb1.ownerKey_ === eYo.NA)
        bb2 && chai.assert(bb2.owner_ === eYo.NA)
        bb2 && chai.assert(bb2.ownerKey_ === eYo.NA)
      }
      test()
      a.foo1_ = b1
      test(b1)
      a.foo2_ = b2
      test(b1, b2)
      a.foo1_ = b2
      test(b2, eYo.NA, b1)
      a.foo2_ = b2
      test(eYo.NA, b2, b1)
      a.foo2_ = b1
      test(eYo.NA, b1, b2)
      a.foo1_ = b1
      test(b1, eYo.NA, b2)
      a.foo2_ = b2
      test(b1, b2)
      a.foo2_ = eYo.NA
      test(b1, eYo.NA, b2)
      a.foo1_ = eYo.NA
      test(eYo.NA, eYo.NA, b1, b2)
    })
    it ('Owned: Inherit', function () {
      var ns = eYo.makeNS()
      eYo.makeClass(ns, 'A', null, {
        owned: ['foo']
      })
      eYo.makeClass(ns, 'AB', ns.A, {
        owned: ['bar']
      })
      var a = new ns.A()
      var ab = new ns.AB()
      var B = function () {}
      B.prototype.dispose = function () {
        this.disposed_ = true
      }
      var foo = new B()
      var bar = new B()
      var test = (af, abf, abb, f, b) => {
        chai.assert(a.foo === af)
        af && chai.assert(af.owner_ === a)
        af && chai.assert(af.ownerKey_ === 'foo_')
        chai.assert(ab.foo === abf)
        chai.assert(ab.bar === abb)
        abf && chai.assert(abf.owner_ === ab)
        abf && chai.assert(abf.ownerKey_ === 'foo_')
        abb && chai.assert(abb.owner_ === ab)
        abb && chai.assert(abb.ownerKey_ === 'bar_')
        f && chai.assert(f.owner_ === eYo.NA)
        f && chai.assert(f.ownerKey_ === eYo.NA)
        b && chai.assert(b.owner_ === eYo.NA)
        b && chai.assert(b.ownerKey_ === eYo.NA)
      }
      test(eYo.NA, eYo.NA, eYo.NA, foo, bar)
      ab.foo_ = foo
      test(eYo.NA, foo, eYo.NA, bar)
      ab.bar_ = bar
      test(eYo.NA, foo, bar)
      ab.bar_ = eYo.NA
      test(eYo.NA, foo, eYo.NA, bar)
      ab.foo_ = eYo.NA
      test(eYo.NA, eYo.NA, eYo.NA, foo, bar)
      ab.bar_ = bar
      test(eYo.NA, eYo.NA, bar, foo)
      ab.foo_ = foo
      test(eYo.NA, foo, bar)
      a.foo_ = foo
      test(foo, eYo.NA, bar)
      ab.foo_ = foo
      test(eYo.NA, foo, bar)
      a.foo_ = bar
      test(bar, foo)
      ab.bar_ = bar
      test(eYo.NA, foo, bar)
      ab.foo_ = bar
      test(eYo.NA, bar, eYo.NA, foo)
      ab.bar_ = foo
      test(eYo.NA, bar, foo)
      ab.foo_ = foo
      test(eYo.NA, foo, eYo.NA, bar)
    })
    it ('Owned: hooks', function () {
      var ns = eYo.makeNS()
      var flag = 0
      var B = function (value) {
        this.value_ = value
      }
      var foo_before = new B(421)
      var foo_after = new B(123)
      var test = function (before, after) {
        chai.assert(this === a)
        chai.assert(before === foo_before, `Unexpected ${before} !=== ${foo_before}`)
        chai.assert(after === foo_after)
      }
      eYo.makeClass(ns, 'A', null, {
        init (value) {
          this.foo__ = value
        },
        owned: {
          foo: {
            willChange (before, after) {
              console.warn
              after && test.call(this, before, after)
              return () => {
                flag += 100
              }
            },
            didChange: test,
            dispose (foo) {
              console.warn("HERE")
              flag += foo
            }
          }
        },
      })
      ns.A_p.ui_driver = {
        doDisposeUI: eYo.Do.nothing
      }
      ns.A.prototype.fooWillChange = ns.A.prototype.fooDidChange = test
      var a = new ns.A(foo_before)
      chai.assert(a.foo === foo_before)
      flag = 0
      a.foo_ = foo_after
      chai.assert(flag === 100)
      // Dispose
      B.prototype.dispose = function (what) {
        flag += 1000
      }
      foo_before = foo_after
      foo_after = eYo.NA
      flag = 0
      a.dispose(123)
//      console.warn(flag)
      chai.assert(flag === 1100)
    })
  })
  describe ('Clonable', function () {
    it ('Clonable: Basic', function () {
      var ns = eYo.makeNS()
      var B = function (value) {
        this.value_ = value
      }
      eYo.makeClass(ns, 'A', null, {
        cloned: {
          foo () {
            return new B()
          }
        }
      })
      ns.A_p.ui_driver = {
        doDisposeUI: eYo.Do.nothing
      }
      B.prototype.dispose = function () {
        this.disposed_ = true
      }
      B.prototype.set = function (other) {
        this.value_ = other.value_
      }
      B.prototype.equals = function (other) {
        return this.value_ === other.value_
      }
      Object.defineProperty(B.prototype, 'clone', {
        get () {
          return new B(this.value_)
        }
      })
      var a = new ns.A()
      chai.expect(() => {a.foo = 1}).to.throw()
      var b = new B(421)
      var bb = new B(123)
      chai.assert(a.foo !== eYo.NA)
      chai.assert(a.foo.value_ === eYo.NA)
      a.foo_ = b
      chai.assert(a.foo.value_ === b.value_)
      chai.assert(a.foo.value_ === 421)
      a.foo_ = bb
      chai.assert(a.foo.value_ === bb.value_)
      chai.assert(a.foo.value_ === 123)
      b = a.foo__
      a.dispose()
      chai.assert(a.foo__ === eYo.NA)
      chai.expect(() => {
        a.foo_ === eYo.NA
      }).to.throw()
      chai.expect(() => {
        a.foo === eYo.NA
      }).to.throw()
      chai.assert(b.disposed_)
    })
    it ('Clonable: hooks', function () {
      var ns = eYo.makeNS()
      var flag = 0
      var B = function (owner, value) {
        this.value_ = value
      }
      B.prototype.dispose = function () {
        this.disposed_ = true
      }
      B.prototype.set = function (other) {
        this.value_ = other.value_
      }
      B.prototype.equals = function (other) {
        return this.value_ === other.value_
      }
      Object.defineProperty(B.prototype, 'clone', {
        get () {
          return new B(this.value_)
        }
      })
      var foo_before = new B(421)
      var foo_after = new B(123)
      var test = function (before, after) {
        chai.assert(this === a)
        chai.assert(before === foo_before)
        chai.assert(after === foo_after)
      }
      eYo.makeClass(ns, 'A', null, {
        cloned: {
          foo: {
            init () {
              return foo_before
            },
            willChange (before, after) {
              test.call(this, before, after)
              return () => {
                flag = 421
              }
            },
            didChange: test
          }
        },
      })
      ns.A.prototype.fooWillChange = ns.A.prototype.fooDidChange = test
      var a = new ns.A(foo_before)
      chai.assert(a.foo__ === foo_before)
      chai.assert(a.foo.equals(foo_before))
      a.foo_ = foo_after
      chai.assert(a.foo__ === foo_before)
      chai.assert(a.foo.equals(foo_after))
    })
  })
  describe ('No collision', function () {
    it ('No collision: valued + cached', function () {
      var ns = eYo.makeNS()
      chai.expect(() => {
        eYo.makeClass(ns, 'A', null, {
          valued: ['foo'],
          cached: {
            foo () {}
          }
        }).to.throw()
      })
    })
    it ('No collision: valued + owned', function () {
      var ns = eYo.makeNS()
      chai.expect(() => {
        eYo.makeClass(ns, 'A', null, {
          valued: ['foo'],
          owned: ['foo'],
        })
      }).to.throw()
    })
    it ('No collision: valued + cloned', function () {
      var ns = eYo.makeNS()
      chai.expect(() => {
        eYo.makeClass(ns, 'A', null, {
          valued: ['foo'],
          cloned: {
            foo () {}
          },
        })
      }).to.throw()
    })
    it ('No collision: cached + owned', function () {
      var ns = eYo.makeNS()
      chai.expect(() => {
        eYo.makeClass(ns, 'A', null, {
          cached: {
            foo () {}
          },
          owned: ['foo'],
        })
      }).to.throw()
    })
    it ('No collision: cached + cloned', function () {
      var ns = eYo.makeNS()
      chai.expect(() => {
        eYo.makeClass(ns, 'A', null, {
          cached: {
            foo () {}
          },
          cloned: {
            foo () {}
          },
        })
      }).to.throw()
    })
    it ('No collision: owned + cloned', function () {
      var ns = eYo.makeNS()
      chai.expect(() => {
        eYo.makeClass(ns, 'A', null, {
          owned: ['foo'],
          cloned: {
            foo () {}
          },
        })
      }).to.throw()
    })
  })
  it ('No setter', function () {
    var ns = eYo.makeNS()
    ns.makeDflt()
    var A = ns.Dflt.makeSubclass('A', {
      owned: 'foo'
    })
    chai.expect(() => {
      var a = new ns.A()
      a.foo = 421
    }).to.throw()
  })
  it ('POC Override rules for properties', function () {
    var ns = eYo.makeNS()
    ns.makeDflt()
    chai.assert(ns === ns.Dflt.eyo.ns)
    ns.Dflt.makeSubclass('A', {
      owned: 'foo'
    })
    ns.A.makeSubclass('AA', {
      owned: 'foo'
    })
    chai.expect(() => {
      new ns.AA()
    }).not.to.throw()
  })
  it ('Override rules for properties', function () {
    var ns = eYo.makeNS()
    var makeA = (model) => {
      ns.makeClass('A', model)
    }
    var makeAB = (model) => {
      ns.makeClass('AB', ns.A, model)
    }
    var props = {
      owned: ['foo'],
      cached: {
        foo () {}
      },
      cloned: {
        foo () {}
      },
      valued: ['foo'],
    }
    var ok = () => {
      new ns.AB()
    }
    var okThrow = () => {
      chai.expect(ok()).to.throw()
    }
    var expect = {
      owned: {
        owned: ok,
        cached: ok,
        cloned: ok,
        valued: ok,
      },
      cached: {
        owned: ok,
        cached: ok,
        cloned: ok,
        valued: ok,
      },
      cloned: {
        owned: ok,
        cached: ok,
        cloned: ok,
        valued: ok,
      },
      valued: {
        owned: ok,
        cached: ok,
        cloned: ok,
        valued: ok,
      },
    }
    Object.keys(props).forEach(a => {
//      console.warn(`TEST a: ${a}...`)
      Object.keys(props).forEach(ab => {
//        console.warn(`TEST ab: ${ab}...`)
        ns = eYo.makeNS()
        makeA({
          [a]: props[a]
        })
        makeAB({
          [ab]: props[ab]
        })
        expect[a][ab]()
//        console.warn(`TEST ab: ${ab}... DONE`)
      })
    })
  })
  it ('Computed', function () {
    var ns = eYo.makeNS()
    var flag = 123
    ns.makeClass('C', {
      computed: {
        foo () {
          return 10 * flag + 1
        },
      },
      cached: {
        bar () {
          return flag
        }
      },
    })
    flag = 421
    var a = new ns.C()
    chai.assert(a.bar === 421)
    chai.assert(a.foo === 4211)
    chai.expect(() => {
      a.foo = 421
    }).to.throw()
    chai.expect(() => {
      a.foo_ = 421
    }).to.throw()
    chai.expect(() => {
      a.foo__ = 421
    }).to.throw()
    chai.expect(() => {
      a.foo_
    }).to.throw()
    chai.expect(() => {
      a.foo__
    }).to.throw()
  })
  it ('Constructor: ownedForEach', function () {
    var ns = eYo.makeNS()
    eYo.makeClass(ns, 'A', null, {
      owned: {
        foo () {}
      }
    })
    chai.assert(ns.A.eyo.owned__.size === 1)
    eYo.makeClass(ns, 'AB', ns.A, {
      owned: {
        bar () {}
      }
    })
    chai.assert(ns.AB.eyo.owned__.size === 2)
    var a = new ns.A()
    a.foo_ = {value: 1}
    var ab = new ns.AB()
    ab.foo_ = {value: 1}
    ab.bar_ = {value: 10}
    var flag = 0
    a.ownedForEach(x => flag += x.value)
    chai.assert(flag === 1)
    flag = 0
//    ab.ownedForEach(x => console.warn(x.value))
    ab.ownedForEach(x => flag += x.value)
//    console.warn(flag)
    chai.assert(flag === 11)
  })
  it ('Constructor: cachedForEach', function () {
    var ns = eYo.makeNS()
    eYo.makeClass(ns, 'A', null, {
      cached: {
        foo () {return 1}
      }
    })
    eYo.makeClass(ns, 'AB', ns.A, {
      cached: {
        bar () {return 10}
      }
    })
    var a = new ns.A()
    var ab = new ns.AB()
    var flag = 0
    a.cachedForEach(x => flag += x)
    chai.assert(flag === 1)
    flag = 0
    ab.cachedForEach(x => flag += x)
    chai.assert(flag === 11)
  })
  it ('Constructor: valuedForEach', function () {
    var ns = eYo.makeNS()
    eYo.makeClass(ns, 'A', null, {
      valued: ['foo']
    })
    eYo.makeClass(ns, 'AB', ns.A, {
      valued: ['bar']
    })
    var a = new ns.A()
    a.foo_ = 1
    var flag = 0
    a.valuedForEach(x => flag += x)
    chai.assert(flag === 1)
    var ab = new ns.AB()
    ab.foo_ = 1
    ab.bar_ = 10
    flag = 0
    ab.valuedForEach(x => flag += x)
    chai.assert(flag === 11)
  })
  it ('Constructor: clonedForEach', function () {
    var ns = eYo.makeNS()
    eYo.makeClass(ns, 'A', null, {
      cloned: {
        foo () {
          return new B()
        }
      }
    })
    eYo.makeClass(ns, 'AB', ns.A, {
      cloned: {
        bar () {
          return new B()
        }
      }
    })
    var B = function (value) {
      this.value_ = value
    }
    B.prototype.dispose = function () {
      this.disposed_ = true
    }
    B.prototype.set = function (other) {
      this.value_ = other && other.value_
    }
    B.prototype.equals = function (other) {
      return other && (this.value_ === other.value_)
    }
    Object.defineProperty(B.prototype, 'clone', {
      get () {
        return new B(this.value_)
      }
    })
    var a = new ns.A()
    a.foo_ = new B(1)
    chai.assert(a.foo.value_ === 1)
    var flag = 0
    a.clonedForEach(x => flag += x.value_)
    chai.assert(flag === 1)
    var ab = new ns.AB()
    ab.foo_ = new B(1)
    chai.assert(ab.foo.value_ === 1)
    ab.bar_ = new B(10)
    chai.assert(ab.bar.value_ === 10)
    flag = 0
    ab.clonedForEach(x => flag += x.value_)
    chai.assert(flag === 11)
  })
  it ('Constructor: makeSubclass', function () {
    var ns = eYo.makeNS()
    var flag = 0
    eYo.makeClass(ns, 'A', null, {
      init() {
        flag += 1
      }
    })
    chai.assert(ns.A.makeSubclass)
    ns.A.makeSubclass('AB', {
      init() {
        flag += 10
      },
    })
    chai.assert(ns.AB.superProto_ === ns.A.prototype)
    flag = 0
    new ns.AB()
    chai.assert(flag === 11)
  })
  it ('Constructor: eyo setter', function () {
    var ns = eYo.makeNS()
    eYo.makeClass(ns, 'A', null, {})
    chai.assert(ns.A.eyo.constructor === eYo.Dlgt)
    chai.expect(() => {
      ns.A.eyo = null
    }).to.throw()
    chai.expect(() => {
      ns.A.eyo_ = null
    }).to.throw()
  })
  it ('Constructor: dlgt key', function () {
    var ns = eYo.makeNS()
    var flag = 0
    var dlgt = function (ns, key, c9r, model) {
      eYo.Dlgt.call(this, ns, key, c9r, model)
      flag += 1
    }
    eYo.inherits(dlgt, eYo.Dlgt)
    eYo.makeClass(ns, 'A', null, dlgt, {
      init() {
        flag += 1
      }
    })
    chai.assert(flag === 1)
    chai.assert(ns.A.eyo.constructor === dlgt)
    chai.assert(ns.A.makeSubclass)
    ns.A.makeSubclass('AB', {})
    chai.assert(flag === 2)
    chai.assert(ns.AB.eyo.constructor === dlgt)
  })
})