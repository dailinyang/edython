/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Turtle graphic environment.
 * 
 * @author jerome.laurens@u-bourgogne.fr
 */
'use strict'

eYo.require('c9r.pane')

eYo.require('decorate')

/**
 * @name {eYo.Turtle}
 * Class for a turtle graphic environment.
 * @param {eYo.Desk} owner Owner desk.
 * @constructor
 */
eYo.makeClass('Turtle', eYo.C9r.Pane)
