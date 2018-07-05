
/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */

/**
 * @fileoverview turtle model. Automatically generated by `bin/helpers/turtle.py`
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Model.turtle__module')

goog.require('eYo.Model')


eYo.Model.turtle__module.data = {
  categories: [
    'translation-of-docstrings-into-different-languages',
    'input-methods',
    'special-turtle-methods',
    'using-events',
    'tell-turtle-s-state',
    'settings-for-measurement',
    'public-classes',
    'more-drawing-control',
    'drawing-state',
    'settings-and-special-methods',
    'window-control',
    'color-control',
    'filling',
    'turtle-motion',
    'methods-specific-to-screen-not-inherited-from-turtlescreen',
    'visibility',
    'using-screen-events',
    'appearance',
    'animation-control'
  ],
  items: [
    {
      names: ['forward', 'fd'],
      category: 'turtle-motion',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'distance',
          description: 'a number (integer or float)'
        }
      ]
    },
    {
      names: ['backward', 'back', 'bk'],
      category: 'turtle-motion',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'distance',
          description: 'a number'
        }
      ]
    },
    {
      names: ['right', 'rt'],
      category: 'turtle-motion',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'angle',
          description: 'a number (integer or float)'
        }
      ]
    },
    {
      names: ['left', 'lt'],
      category: 'turtle-motion',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'angle',
          description: 'a number (integer or float)'
        }
      ]
    },
    {
      names: ['setposition', 'setpos', 'goto'],
      category: 'turtle-motion',
      type: 'function',
      ary: 2,
      mandatory: 1,
      arguments: [
        {
          name: 'x',
          description: 'a number or a pair/vector of numbers'
        },
        {
          name: 'y',
          default: 'None',
          description: 'a number or None'
        }
      ]
    },
    {
      names: ['setx'],
      category: 'turtle-motion',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'x',
          description: 'a number (integer or float)'
        }
      ]
    },
    {
      names: ['sety'],
      category: 'turtle-motion',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'y',
          description: 'a number (integer or float)'
        }
      ]
    },
    {
      names: ['setheading', 'seth'],
      category: 'turtle-motion',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'to_angle',
          description: 'a number (integer or float)'
        }
      ]
    },
    {
      names: ['home'],
      category: 'turtle-motion',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['circle'],
      category: 'turtle-motion',
      type: 'function',
      ary: 3,
      mandatory: 1,
      arguments: [
        {
          name: 'radius',
          description: 'a number'
        },
        {
          name: 'extent',
          default: 'None',
          description: 'a number (or None)'
        },
        {
          name: 'steps',
          default: 'None',
          description: 'an integer (or None)'
        }
      ]
    },
    {
      names: ['dot'],
      category: 'turtle-motion',
      type: 'function',
      ary: 2,
      mandatory: 1,
      arguments: [
        {
          name: 'size',
          default: 'None',
          description: 'an integer >= 1 (if given)'
        },
        {
          name: '*color'
        }
      ]
    },
    {
      names: ['stamp'],
      category: 'turtle-motion',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['clearstamp'],
      category: 'turtle-motion',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'stampid',
          description: 'an integer, must be return value of previous stamp() call'
        }
      ]
    },
    {
      names: ['clearstamps'],
      category: 'turtle-motion',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'n',
          default: 'None',
          description: 'an integer (or None)'
        }
      ]
    },
    {
      names: ['undo'],
      category: 'turtle-motion',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['speed'],
      category: 'turtle-motion',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'speed',
          default: 'None',
          description: 'an integer in the range 0..10 or a speedstring (see below)'
        }
      ]
    },
    {
      names: ['position', 'pos'],
      category: 'tell-turtle-s-state',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['towards'],
      category: 'tell-turtle-s-state',
      type: 'function',
      ary: 2,
      mandatory: 1,
      arguments: [
        {
          name: 'x',
          description: 'a number or a pair/vector of numbers or a turtle instance'
        },
        {
          name: 'y',
          default: 'None',
          description: 'a number if x is a number, else None'
        }
      ]
    },
    {
      names: ['xcor'],
      category: 'tell-turtle-s-state',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['ycor'],
      category: 'tell-turtle-s-state',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['heading'],
      category: 'tell-turtle-s-state',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['distance'],
      category: 'tell-turtle-s-state',
      type: 'function',
      ary: 2,
      mandatory: 1,
      arguments: [
        {
          name: 'x',
          description: 'a number or a pair/vector of numbers or a turtle instance'
        },
        {
          name: 'y',
          default: 'None',
          description: 'a number if x is a number, else None'
        }
      ]
    },
    {
      names: ['degrees'],
      category: 'settings-for-measurement',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'fullcircle',
          default: '360.0',
          description: 'a number'
        }
      ]
    },
    {
      names: ['radians'],
      category: 'settings-for-measurement',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['pendown', 'down', 'pd'],
      category: 'drawing-state',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['penup', 'pu', 'up'],
      category: 'drawing-state',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['pensize', 'width'],
      category: 'drawing-state',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'width',
          default: 'None',
          description: 'a positive number'
        }
      ]
    },
    {
      names: ['pen'],
      category: 'drawing-state',
      type: 'function',
      ary: 2,
      mandatory: 1,
      arguments: [
        {
          name: 'pen',
          default: 'None',
          description: 'a dictionary with some or all of the below listed keys'
        },
        {
          name: '**pendict'
        }
      ]
    },
    {
      names: ['isdown'],
      category: 'drawing-state',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['pencolor'],
      category: 'color-control',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: '*args'
        }
      ]
    },
    {
      names: ['fillcolor'],
      category: 'color-control',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: '*args'
        }
      ]
    },
    {
      names: ['color'],
      category: 'color-control',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: '*args'
        }
      ]
    },
    {
      names: ['filling'],
      category: 'filling',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['begin_fill'],
      category: 'filling',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['end_fill'],
      category: 'filling',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['reset'],
      category: 'more-drawing-control',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['clear'],
      category: 'more-drawing-control',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['write'],
      category: 'more-drawing-control',
      type: 'function',
      ary: 6,
      mandatory: 3,
      arguments: [
        {
          name: 'arg',
          description: 'object to be written to the TurtleScreen'
        },
        {
          name: 'move',
          default: 'False',
          description: 'True/False'
        },
        {
          name: 'align',
          default: '"left"',
          description: 'one of the strings “left”, “center” or right”'
        },
        {
          name: 'font',
          default: '("Arial"',
          description: 'a triple (fontname, fontsize, fonttype)'
        },
        {
          name: '8'
        },
        {
          name: '"normal")'
        }
      ]
    },
    {
      names: ['hideturtle', 'ht'],
      category: 'visibility',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['showturtle', 'st'],
      category: 'visibility',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['isvisible'],
      category: 'visibility',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['shape'],
      category: 'appearance',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'name',
          default: 'None',
          description: 'a string which is a valid shapename'
        }
      ]
    },
    {
      names: ['resizemode'],
      category: 'appearance',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'rmode',
          default: 'None',
          description: 'one of the strings “auto”, “user”, “noresize”'
        }
      ]
    },
    {
      names: ['turtlesize', 'shapesize'],
      category: 'appearance',
      type: 'function',
      ary: 3,
      mandatory: 0,
      arguments: [
        {
          name: 'stretch_wid',
          default: 'None',
          description: 'positive number'
        },
        {
          name: 'stretch_len',
          default: 'None',
          description: 'positive number'
        },
        {
          name: 'outline',
          default: 'None',
          description: 'positive number'
        }
      ]
    },
    {
      names: ['shearfactor'],
      category: 'appearance',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'shear',
          default: 'None',
          description: 'number (optional)'
        }
      ]
    },
    {
      names: ['tilt'],
      category: 'appearance',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'angle',
          description: 'a number'
        }
      ]
    },
    {
      names: ['settiltangle'],
      category: 'appearance',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'angle',
          description: 'a number'
        }
      ]
    },
    {
      names: ['tiltangle'],
      category: 'appearance',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'angle',
          default: 'None',
          description: 'a number (optional)'
        }
      ]
    },
    {
      names: ['shapetransform'],
      category: 'appearance',
      type: 'function',
      ary: 4,
      mandatory: 0,
      arguments: [
        {
          name: 't11',
          default: 'None',
          description: 'a number (optional)'
        },
        {
          name: 't12',
          default: 'None',
          description: 'a number (optional)'
        },
        {
          name: 't21',
          default: 'None',
          description: 'a number (optional)'
        },
        {
          name: 't22',
          default: 'None'
        }
      ]
    },
    {
      names: ['get_shapepoly'],
      category: 'appearance',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['onclick'],
      category: 'using-events',
      type: 'function',
      ary: 3,
      mandatory: 1,
      arguments: [
        {
          name: 'fun',
          description: 'a function with two arguments which will be called with the coordinates of the clicked point on the canvas'
        },
        {
          name: 'btn',
          default: '1'
        },
        {
          name: 'add',
          default: 'None',
          description: 'True or False – if True, a new binding will be added, otherwise it will replace a former binding'
        }
      ]
    },
    {
      names: ['onrelease'],
      category: 'using-events',
      type: 'function',
      ary: 3,
      mandatory: 1,
      arguments: [
        {
          name: 'fun',
          description: 'a function with two arguments which will be called with the coordinates of the clicked point on the canvas'
        },
        {
          name: 'btn',
          default: '1'
        },
        {
          name: 'add',
          default: 'None',
          description: 'True or False – if True, a new binding will be added, otherwise it will replace a former binding'
        }
      ]
    },
    {
      names: ['ondrag'],
      category: 'using-events',
      type: 'function',
      ary: 3,
      mandatory: 1,
      arguments: [
        {
          name: 'fun',
          description: 'a function with two arguments which will be called with the coordinates of the clicked point on the canvas'
        },
        {
          name: 'btn',
          default: '1'
        },
        {
          name: 'add',
          default: 'None',
          description: 'True or False – if True, a new binding will be added, otherwise it will replace a former binding'
        }
      ]
    },
    {
      names: ['begin_poly'],
      category: 'special-turtle-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['end_poly'],
      category: 'special-turtle-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['get_poly'],
      category: 'special-turtle-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['clone'],
      category: 'special-turtle-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['getturtle', 'getpen'],
      category: 'special-turtle-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['getscreen'],
      category: 'special-turtle-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['setundobuffer'],
      category: 'special-turtle-methods',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'size',
          description: 'an integer or None'
        }
      ]
    },
    {
      names: ['undobufferentries'],
      category: 'special-turtle-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['bgcolor'],
      category: 'window-control',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: '*args'
        }
      ]
    },
    {
      names: ['bgpic'],
      category: 'window-control',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'picname',
          default: 'None',
          description: 'a string, name of a gif-file or "nopic", or None'
        }
      ]
    },
    {
      names: ['clearscreen', 'clear'],
      category: 'window-control',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['resetscreen', 'reset'],
      category: 'window-control',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['screensize'],
      category: 'window-control',
      type: 'function',
      ary: 3,
      mandatory: 0,
      arguments: [
        {
          name: 'canvwidth',
          default: 'None',
          description: 'positive integer, new width of canvas in pixels'
        },
        {
          name: 'canvheight',
          default: 'None',
          description: 'positive integer, new height of canvas in pixels'
        },
        {
          name: 'bg',
          default: 'None',
          description: 'colorstring or color-tuple, new background color'
        }
      ]
    },
    {
      names: ['setworldcoordinates'],
      category: 'window-control',
      type: 'function',
      ary: 4,
      mandatory: 4,
      arguments: [
        {
          name: 'llx',
          description: 'a number, x-coordinate of lower left corner of canvas'
        },
        {
          name: 'lly',
          description: 'a number, y-coordinate of lower left corner of canvas'
        },
        {
          name: 'urx',
          description: 'a number, x-coordinate of upper right corner of canvas'
        },
        {
          name: 'ury',
          description: 'a number, y-coordinate of upper right corner of canvas'
        }
      ]
    },
    {
      names: ['delay'],
      category: 'animation-control',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'delay',
          default: 'None',
          description: 'positive integer'
        }
      ]
    },
    {
      names: ['tracer'],
      category: 'animation-control',
      type: 'function',
      ary: 2,
      mandatory: 0,
      arguments: [
        {
          name: 'n',
          default: 'None',
          description: 'nonnegative integer'
        },
        {
          name: 'delay',
          default: 'None',
          description: 'nonnegative integer'
        }
      ]
    },
    {
      names: ['update'],
      category: 'animation-control',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['listen'],
      category: 'using-screen-events',
      type: 'function',
      ary: 2,
      mandatory: 0,
      arguments: [
        {
          name: 'xdummy',
          default: 'None'
        },
        {
          name: 'ydummy',
          default: 'None'
        }
      ]
    },
    {
      names: ['onkeyrelease', 'onkey'],
      category: 'using-screen-events',
      type: 'function',
      ary: 2,
      mandatory: 2,
      arguments: [
        {
          name: 'fun',
          description: 'a function with no arguments or None'
        },
        {
          name: 'key',
          description: 'a string: key (e.g. “a”) or key-symbol (e.g. “space”)'
        }
      ]
    },
    {
      names: ['onkeypress'],
      category: 'using-screen-events',
      type: 'function',
      ary: 2,
      mandatory: 1,
      arguments: [
        {
          name: 'fun',
          description: 'a function with no arguments or None'
        },
        {
          name: 'key',
          default: 'None',
          description: 'a string: key (e.g. “a”) or key-symbol (e.g. “space”)'
        }
      ]
    },
    {
      names: ['onscreenclick', 'onclick'],
      category: 'using-screen-events',
      type: 'function',
      ary: 3,
      mandatory: 1,
      arguments: [
        {
          name: 'fun',
          description: 'a function with two arguments which will be called with the coordinates of the clicked point on the canvas'
        },
        {
          name: 'btn',
          default: '1'
        },
        {
          name: 'add',
          default: 'None',
          description: 'True or False – if True, a new binding will be added, otherwise it will replace a former binding'
        }
      ]
    },
    {
      names: ['ontimer'],
      category: 'using-screen-events',
      type: 'function',
      ary: 2,
      mandatory: 1,
      arguments: [
        {
          name: 'fun',
          description: 'a function with no arguments'
        },
        {
          name: 't',
          default: '0',
          description: 'a number >= 0'
        }
      ]
    },
    {
      names: ['mainloop', 'done'],
      category: 'using-screen-events',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['textinput'],
      category: 'input-methods',
      type: 'function',
      ary: 2,
      mandatory: 2,
      arguments: [
        {
          name: 'title',
          description: 'string'
        },
        {
          name: 'prompt',
          description: 'string'
        }
      ]
    },
    {
      names: ['numinput'],
      category: 'input-methods',
      type: 'function',
      ary: 5,
      mandatory: 2,
      arguments: [
        {
          name: 'title',
          description: 'string'
        },
        {
          name: 'prompt',
          description: 'string'
        },
        {
          name: 'default',
          default: 'None',
          description: 'number (optional)'
        },
        {
          name: 'minval',
          default: 'None',
          description: 'number (optional)'
        },
        {
          name: 'maxval',
          default: 'None',
          description: 'number (optional)'
        }
      ]
    },
    {
      names: ['mode'],
      category: 'settings-and-special-methods',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'mode',
          default: 'None',
          description: 'one of the strings “standard”, “logo” or “world”'
        }
      ]
    },
    {
      names: ['colormode'],
      category: 'settings-and-special-methods',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'cmode',
          default: 'None',
          description: 'one of the values 1.0 or 255'
        }
      ]
    },
    {
      names: ['getcanvas'],
      category: 'settings-and-special-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['getshapes'],
      category: 'settings-and-special-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['register_shape', 'addshape'],
      category: 'settings-and-special-methods',
      type: 'function',
      ary: 2,
      mandatory: 1,
      arguments: [
        {
          name: 'name'
        },
        {
          name: 'shape',
          default: 'None'
        }
      ]
    },
    {
      names: ['turtles'],
      category: 'settings-and-special-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['window_height'],
      category: 'settings-and-special-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['window_width'],
      category: 'settings-and-special-methods',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['bye'],
      category: 'methods-specific-to-screen-not-inherited-from-turtlescreen',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['exitonclick'],
      category: 'methods-specific-to-screen-not-inherited-from-turtlescreen',
      type: 'function',
      ary: 0,
      mandatory: 0
    },
    {
      names: ['setup'],
      category: 'methods-specific-to-screen-not-inherited-from-turtlescreen',
      type: 'function',
      ary: 4,
      mandatory: 0,
      arguments: [
        {
          name: 'width',
          default: '_CFG["width"]',
          description: 'if an integer, a size in pixels, if a float, a fraction of the screen; default is 50% of screen'
        },
        {
          name: 'height',
          default: '_CFG["height"]',
          description: 'if an integer, the height in pixels, if a float, a fraction of the screen; default is 75% of screen'
        },
        {
          name: 'startx',
          default: '_CFG["leftright"]',
          description: 'if positive, starting position in pixels from the left edge of the screen, if negative from the right edge, if None, center window horizontally'
        },
        {
          name: 'starty',
          default: '_CFG["topbottom"]',
          description: 'if positive, starting position in pixels from the top edge of the screen, if negative from the bottom edge, if None, center window vertically'
        }
      ]
    },
    {
      names: ['title'],
      category: 'methods-specific-to-screen-not-inherited-from-turtlescreen',
      type: 'function',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'titlestring',
          description: 'a string that is shown in the titlebar of the turtle graphics window'
        }
      ]
    },
    {
      names: ['RawTurtle', 'RawPen'],
      category: 'public-classes',
      type: 'class',
      ary: 2,
      mandatory: 2,
      arguments: [
        {
          name: 'class'
        },
        {
          name: 'canvas',
          description: 'a tkinter.Canvas, a ScrolledCanvas or a TurtleScreen'
        }
      ]
    },
    {
      names: ['Turtle'],
      category: 'public-classes',
      type: 'class',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'class'
        }
      ]
    },
    {
      names: ['TurtleScreen'],
      category: 'public-classes',
      type: 'class',
      ary: 2,
      mandatory: 2,
      arguments: [
        {
          name: 'class'
        },
        {
          name: 'cv',
          description: 'a tkinter.Canvas'
        }
      ]
    },
    {
      names: ['Screen'],
      category: 'public-classes',
      type: 'class',
      ary: 1,
      mandatory: 1,
      arguments: [
        {
          name: 'class'
        }
      ]
    },
    {
      names: ['ScrolledCanvas'],
      category: 'public-classes',
      type: 'class',
      ary: 2,
      mandatory: 2,
      arguments: [
        {
          name: 'class'
        },
        {
          name: 'master',
          description: 'some Tkinter widget to contain the ScrolledCanvas, i.e. a Tkinter-canvas with scrollbars added'
        }
      ]
    },
    {
      names: ['Shape'],
      category: 'public-classes',
      type: 'class',
      ary: 3,
      mandatory: 3,
      arguments: [
        {
          name: 'class'
        },
        {
          name: 'type_',
          description: 'one of the strings “polygon”, “image”, “compound”'
        },
        {
          name: 'data'
        }
      ]
    },
    {
      names: ['Vec2D'],
      category: 'public-classes',
      type: 'class',
      ary: 3,
      mandatory: 3,
      arguments: [
        {
          name: 'class'
        },
        {
          name: 'x'
        },
        {
          name: 'y'
        }
      ]
    },
    {
      names: ['write_docstringdict'],
      category: 'translation-of-docstrings-into-different-languages',
      type: 'function',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'filename',
          default: '"turtle_docstringdict"',
          description: 'a string, used as filename'
        }
      ]
    }
  ],
  by_name: {
    'get_poly': 55,
    'setup': 88,
    'pendown': 24,
    'title': 89,
    'circle': 9,
    'begin_poly': 53,
    'update': 69,
    'Shape': 95,
    'mode': 78,
    'pos': 16,
    'settiltangle': 46,
    'addshape': 82,
    'distance': 21,
    'write_docstringdict': 97,
    'undo': 14,
    'register_shape': 82,
    'position': 16,
    'seth': 7,
    'pu': 25,
    'bye': 86,
    'pensize': 26,
    'tilt': 45,
    'clone': 56,
    'penup': 25,
    'showturtle': 39,
    'setx': 5,
    'setposition': 4,
    'colormode': 79,
    'shape': 41,
    'clearstamp': 12,
    'setworldcoordinates': 66,
    'begin_fill': 33,
    'backward': 1,
    'getturtle': 57,
    'towards': 17,
    'undobufferentries': 60,
    'heading': 20,
    'xcor': 18,
    'Turtle': 91,
    'home': 8,
    'back': 1,
    'write': 37,
    'getpen': 57,
    'screensize': 65,
    'clearstamps': 13,
    'tracer': 68,
    'exitonclick': 87,
    'right': 2,
    'dot': 10,
    'rt': 2,
    'RawTurtle': 90,
    'delay': 67,
    'goto': 4,
    'setpos': 4,
    'RawPen': 90,
    'shapesize': 43,
    'up': 25,
    'onscreenclick': 73,
    'speed': 15,
    'end_fill': 34,
    'st': 39,
    'lt': 3,
    'mainloop': 75,
    'ht': 38,
    'shapetransform': 48,
    'get_shapepoly': 49,
    'ontimer': 74,
    'sety': 6,
    'down': 24,
    'Vec2D': 96,
    'pen': 27,
    'left': 3,
    'isvisible': 40,
    'ondrag': 52,
    'window_height': 84,
    'numinput': 77,
    'turtlesize': 43,
    'forward': 0,
    'end_poly': 54,
    'clearscreen': 63,
    'onkeypress': 72,
    'radians': 23,
    'color': 31,
    'onclick': 73,
    'hideturtle': 38,
    'bgcolor': 61,
    'window_width': 85,
    'onkeyrelease': 71,
    'bk': 1,
    'done': 75,
    'onrelease': 51,
    'getcanvas': 80,
    'shearfactor': 44,
    'getshapes': 81,
    'onkey': 71,
    'setheading': 7,
    'clear': 63,
    'turtles': 83,
    'TurtleScreen': 92,
    'resizemode': 42,
    'isdown': 28,
    'pd': 24,
    'setundobuffer': 59,
    'fd': 0,
    'width': 26,
    'listen': 70,
    'Screen': 93,
    'ScrolledCanvas': 94,
    'ycor': 19,
    'getscreen': 58,
    'resetscreen': 64,
    'degrees': 22,
    'fillcolor': 30,
    'pencolor': 29,
    'reset': 64,
    'stamp': 11,
    'filling': 32,
    'bgpic': 62,
    'tiltangle': 47,
    'textinput': 76
  },
  by_category: {
    'translation-of-docstrings-into-different-languages': [97],
    'input-methods': [76, 77],
    'special-turtle-methods': [53, 54, 55, 56, 57, 58, 59, 60],
    'using-events': [50, 51, 52],
    'tell-turtle-s-state': [16, 17, 18, 19, 20, 21],
    'settings-for-measurement': [22, 23],
    'public-classes': [90, 91, 92, 93, 94, 95, 96],
    'more-drawing-control': [35, 36, 37],
    'drawing-state': [24, 25, 26, 27, 28],
    'settings-and-special-methods': [78, 79, 80, 81, 82, 83, 84, 85],
    'window-control': [61, 62, 63, 64, 65, 66],
    'color-control': [29, 30, 31],
    'filling': [32, 33, 34],
    'turtle-motion': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    'methods-specific-to-screen-not-inherited-from-turtlescreen': [86, 87, 88, 89],
    'visibility': [38, 39, 40],
    'using-screen-events': [70, 71, 72, 73, 74, 75],
    'appearance': [41, 42, 43, 44, 45, 46, 47, 48, 49],
    'animation-control': [67, 68, 69]
  }
}

/**
 * Get the item with the given key
 * @param {!String|Number} key  The key or index of the item
 * @return {?Object} return the model object for that item, if any.
 */
eYo.Model.turtle__module.getItem = function (key) {
  if (!goog.isNumber(key)) {
    key = eYo.Model.turtle__module.data.by_name[key]
  }
  if (goog.isNumber(key)) {
    return eYo.Model.turtle__module.data.items[key]
  }
}

/**
 * Get the indices of the items for the given category
 * @param {!String} key  The name of the category
 * @return {!Array} the list of item indices with the given category (possibly void).
 */
eYo.Model.turtle__module.getItemsInCategory = function (category) {
  return eYo.Model.turtle__module.data.by_category[category] || []
}

// This file was generated by `./bin/helpers/turtle.py` on 2018-07-05 14:23:37.530670

