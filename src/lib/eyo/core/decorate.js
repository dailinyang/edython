/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */
/**
 * @fileoverview Various decoration utilities.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Decorate')

/**
 * Decorate the function to be reentrant
 * @param {!string} key
 * @param {!function} f
 * @return An object which `return` property is the value returned by f when called.
 */
eYo.Decorate.reentrant_method = function(key, f) {
  return (!this || !this.reentrant || !this.reentrant[key])
    && goog.isFunction(f)
      && function() {
        if (this.reentrant[key]) {
          return {}
        }
        this.reentrant[key] = true
        try {
          return {ans: f.apply(this, arguments)}
        } catch (err) {
          console.error(err)
          throw err
        } finally {
          this.reentrant[key] = false
        }
      }
}