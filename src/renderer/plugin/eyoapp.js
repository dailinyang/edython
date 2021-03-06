import {layoutcfg} from '@@/../store/modules/Layout'

var eYoApp = {}

eYoApp.test = function () {
  console.error('TEST eYoApp')
}

eYoApp.install = function (Vue, options) {
  var store = options.store
  eYo.Do.readOnlyMixin(eYo.App, {
    CONSOLE: 'console',
    TURTLE: 'turtle',
    WORKSPACE_ONLY: 'workspace only',
    CONSOLE_ONLY: 'console only'
  })
  eYo.App.doPrefToDom = (dom) => {
    var prefs = {}
    var value
    var state = store.state
    value = layoutcfg.prefs
    if (value) {
      prefs.workspace = value
    }
    value = state.Layout.paneLayout
    if (value) {
      prefs.paneLayout = value
    }
    var str = JSON.stringify(prefs)
    dom.insertBefore(goog.dom.createDom('prefs', null,
      goog.dom.createTextNode(str)
    ), dom.firstChild)
    return dom
  }
  eYo.App.doDomToPref = (dom) => {
    var children = dom.childNodes
    var i = 0
    while (i < children.length) {
      var child = children[i++]
      var name = child.nodeName.toLowerCase()
      if (name === eYo.Xml.EDYTHON) {
        // find the 'prefs' child
        children = child.childNodes
        i = 0
        while (i < children.length) {
          child = children[i++]
          if (child.tagName && child.tagName.toLowerCase() === 'prefs') {
            // find the 'text' child
            var str = child.textContent
            if (str) {
              var prefs = JSON.parse(str)
              if (prefs) {
                eYo.Do.tryFinally(() => {
                  store.dispatch('Workspace/setPrefs', prefs.workspace)
                  store.dispatch('Layout/setPrefs', prefs.paneLayout)
                })
                return
              }
            }
          }
        }
      }
    }
  }
  /** Sent when the undo stack is cleared out. */
  eYo.App.didClearUndo = () => {
    // console.log('didClearUndo')
    store.commit('Undo/didClearUndo')
  }
  eYo.App.didProcessUndo = () => {
    // console.log('didProcessUndo')
    store.commit('Undo/didProcessUndo')
  }
  eYo.App.didUnshiftUndo = () => {
    store.commit('Undo/didUnshiftUndo')
  }
  /** Sent when a new undo operation has been created */
  eYo.App.didPushUndo = () => {
    store.commit('Undo/didPushUndo')
  }
  // eYo.App.didTouchBlock = function (block) {
  //   console.log('didTouchBlock', block)
  //   // store.commit('Selected/selectBlock', block) once broke everything when uncommented
  // }
  eYo.Selected.didAdd = () => {
    Vue.nextTick(() => {
      store.commit('Selected/selectBlock', eYo.Selected.block)
    })
  }
  eYo.Selected.didRemove = () => {
    Vue.nextTick(() => {
      store.commit('Selected/selectBlock', eYo.Selected.block)
    })
  }
  eYo.App.selectedBlockUpdate = (eyo) => {
    console.error('selectedBlockUpdate')
    if (eyo) {
      if (eyo.id === store.state.Selected.id) {
        Vue.nextTick(() => {
          console.error('selectedBlockUpdate echoed')
          store.commit('Selected/update', eyo.block_)
        })
      }
    }
  }
  Object.defineProperties(eYo.App, {
    selectedBlock: {
      get () {
        var id = store.state.Selected.id
        return id && eYo.App.workspace.blockDB_[id]
      }
    }
  })
  eYo.App.didRemoveSelect = function (block) {
    Vue.nextTick(() => {
      store.commit('Selected/selectBlock', Blockly.selected)
    })
  }
  Object.defineProperties(eYo.App, {
    selectedMode: {
      get () {
        return store.state.UI.selectedMode
      },
      set (newValue) {
        store.commit('UI/selectMode', newValue)
      }
    }
  })

  // listen to connections
  eYo.Delegate.prototype.didConnect = (() => {
    // this is a closure
    var didConnect = eYo.Delegate.prototype.didConnect
    return function (connection, oldTargetC8n, targetOldC8n) {
      didConnect.call(this, connection, oldTargetC8n, targetOldC8n)
      Vue.nextTick(() => {
        eYo.$$.bus.$emit('did-connect')
      })
    }
  })()

  // listen to connections
  eYo.Delegate.prototype.didDisconnect = (() => {
    // this is a closure
    var didDisconnect = eYo.Delegate.prototype.didDisconnect
    return function (connection, oldTargetC8n, targetOldC8n) {
      didDisconnect.call(this, connection, oldTargetC8n, targetOldC8n)
      Vue.nextTick(() => {
        eYo.$$.bus.$emit('did-disconnect')
      })
    }
  })()
}
export default eYoApp
