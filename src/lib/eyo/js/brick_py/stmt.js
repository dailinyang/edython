/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Bricks for edython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

eYo.require('brick')

eYo.forwardDeclare('xre')
eYo.forwardDeclare('msg')
eYo.forwardDeclare('brick.operator')

/**
 * @name {eYo.Stmt}
 * @namespace
 */
eYo.Brick.makeNS(eYo, 'stmt')

/**
 * @name {eYo.Stmt.Dlgt}
 * @constructor
 */
eYo.Stmt.makeDlgt()

/**
 * Class for a Delegate, statement brick.
 * Not normally called directly, eYo.Brick.Create(...) is preferred.
 * For edython.
 */
eYo.Stmt.makeDflt({
  left /** @suppress {globalThis} */ (type) {
    return this.brick.head || this.brick.foot
    ? [eYo.t3.Stmt.Comment_stmt]
    : eYo.t3.stmt.Left.Simple_stmt
  },
  right: {
    fields: {
      label: { // don't call it 'operator'
        reserved: ';',
        hidden: true
      }
    },
    check /** @suppress {globalThis} */ (type) {
      return eYo.t3.stmt.Right.Simple_stmt
    }
  },
  head /** @suppress {globalThis} */ (type) {
    return this.brick.left
    ? []
    : null // except start_stmt ? connections must also have an uncheck_
  },
  foot /** @suppress {globalThis} */ (type) {
    return this.brick.left
    ? []
    : null
  },
  computed: {
    isStmt () {
      return true
    },
    depth () {
      var group = this.group
      return (group && (group.depth + 1)) || 0
    },
  }
})

eYo.Brick.registerAll(eYo.t3.Stmt, eYo.stmt.Dflt, true)

/**
 * Insert a brick above.
 * If the brick's previous connection is connected,
 * connects the brick above to it.
 * The connection cannot always establish.
 * The holes are filled.
 * @param {Object} model
 * @return the created brick
 */
eYo.Stmt._p.insertParentWithModel = function (model) {
  var magnet = this.head_m
  if (magnet) {
    var parent
    eYo.events.disableWrap(
      () => {
        parent = eYo.Brick.newReady(this, model)
      },
      () => {
        if (parent) {
          var p_magnet = parent.foot_m
          if (p_magnet && magnet.checkType_(p_magnet)) {
            eYo.events.groupWrap(() => {
              eYo.events.fireBrickCreate(parent)
              var targetMagnet = magnet.target
              if (targetMagnet) {
                targetMagnet.disconnect()
                if ((targetMagnet = parent.head_m)) {
                  p_magnet.target = targetMagnet
                }
              } else {
                parent.moveTo(this.xy)
              }
              parent.render()
              magnet.target = p_magnet
              parent.initUI(this.hasUI)
              if (this.hasFocus) {
                parent.hasFocus
              }
            })
          } else {
            parent.dispose(true)
            parent = eYo.NA
          }
        }
      }
    )
    return parent
  }
}

/**
 * Insert a brick below the receiver.
 * If the receiver's next connection is connected,
 * connects the brick below to it.
 * The connection cannot always establish.
 * The holes are filled.
 * @param {string} belowPrototypeName
 * @return the created brick
 */
eYo.Stmt._p.insertBrickAfter = function (belowPrototypeName) {
  return eYo.events.groupWrap(() => {
    var below = eYo.Brick.newReady(this, belowPrototypeName)
    var magnet = this.foot_m
    var targetMagnet = magnet.target
    var magnets = below.magnets
    if (targetMagnet) {
      targetMagnet.disconnect()
      if (targetMagnet.checkType_(foot_m)) {
        targetMagnet.target = foot_m
      }
    }
    magnet.target = head_m
    if (this.hasFocus) {
      after.focusOn()
    }
    return after
  })
}
