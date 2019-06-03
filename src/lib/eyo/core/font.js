/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview utilities for edython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */

goog.provide('eYo.font-face')

goog.require('eYo')

 /**
 * Setup the font style, amongst others.
 */
eYo.Temp.x = ((static) => {
  eYo.setup.register(() => {
    eYo.Css.insertRuleAt(`@font-face {
  font-family: 'DejaVuSansMono';
  src: local('☺'),url(${static}/font/DejaVuSansMono.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}`)
    eYo.Css.insertRuleAt(`@font-face {
  font-family: 'DejaVuSansMono';
  src: local('☺'), url('${static}/font/DejaVuSansMono-Bold.woff')format('woff');
  font-weight: bold;
  font-style: normal;
}`)
    eYo.Css.insertRuleAt(`@font-face {
  font-family: 'DejaVuSansMono';
  src: local('☺'),url('${static}/font/DejaVuSansMono-Oblique.woff')format('woff');
  font-weight: normal;
  font-style: oblique;
}`)
    eYo.Css.insertRuleAt(`@font-face {
  font-family: 'DejaVuSansMono';
  src: local('☺'),url('${static}/font/DejaVuSansMono-BoldOblique.woff')format('woff');
  font-weight: bold;
  font-style: oblique;
}`)
  })
})(window.__static || 'static')
