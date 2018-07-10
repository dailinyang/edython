/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */

/**
 * @fileoverview turtle model. Automatically generated by `bin/helpers/turtlebot.py turtle`
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Model.turtle__module')

goog.require('eYo.Model')

eYo.Model.turtle__module.data = {
  prefix: 'turtle.',
  categories: [
    'turtle-motion',
    'tell-turtle-s-state',
    'settings-for-measurement',
    'drawing-state',
    'color-control',
    'filling',
    'more-drawing-control',
    'visibility',
    'appearance',
    'using-events',
    'special-turtle-methods',
    'window-control',
    'animation-control',
    'using-screen-events',
    'input-methods',
    'settings-and-special-methods',
    'methods-specific-to-screen-not-inherited-from-turtlescreen',
    'public-classes',
    'translation-of-docstrings-into-different-languages'
  ],
  types: [
    'function',
    'class'
  ],
  items: [
    {
      names: ['forward', 'fd'],
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true
    },
    {
      names: ['circle'],
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true
    },
    {
      names: ['clearstamp'],
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true,
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
      category: 0,
      type: 0,
      stmt: true
    },
    {
      names: ['speed'],
      category: 0,
      type: 0,
      stmt: true,
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
      category: 1,
      type: 0
    },
    {
      names: ['towards'],
      category: 1,
      type: 0,
      stmt: true,
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
      category: 1,
      type: 0
    },
    {
      names: ['ycor'],
      category: 1,
      type: 0
    },
    {
      names: ['heading'],
      category: 1,
      type: 0
    },
    {
      names: ['distance'],
      category: 1,
      type: 0,
      stmt: true,
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
      category: 2,
      type: 0,
      stmt: true,
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
      category: 2,
      type: 0,
      stmt: true
    },
    {
      names: ['pendown', 'down', 'pd'],
      category: 3,
      type: 0,
      stmt: true
    },
    {
      names: ['penup', 'pu', 'up'],
      category: 3,
      type: 0,
      stmt: true
    },
    {
      names: ['pensize', 'width'],
      category: 3,
      type: 0,
      stmt: true,
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
      category: 3,
      type: 0,
      stmt: true,
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
      category: 3,
      type: 0
    },
    {
      names: ['pencolor'],
      category: 4,
      type: 0,
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
      category: 4,
      type: 0,
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
      category: 4,
      type: 0,
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
      category: 5,
      type: 0
    },
    {
      names: ['begin_fill'],
      category: 5,
      type: 0,
      stmt: true
    },
    {
      names: ['end_fill'],
      category: 5,
      type: 0,
      stmt: true
    },
    {
      names: ['reset'],
      category: 6,
      type: 0,
      stmt: true
    },
    {
      names: ['clear'],
      category: 6,
      type: 0,
      stmt: true
    },
    {
      names: ['write'],
      category: 6,
      type: 0,
      stmt: true,
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
      category: 7,
      type: 0,
      stmt: true
    },
    {
      names: ['showturtle', 'st'],
      category: 7,
      type: 0,
      stmt: true
    },
    {
      names: ['isvisible'],
      category: 7,
      type: 0
    },
    {
      names: ['shape'],
      category: 8,
      type: 0,
      stmt: true,
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
      category: 8,
      type: 0,
      stmt: true,
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
      category: 8,
      type: 0,
      stmt: true,
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
      category: 8,
      type: 0,
      stmt: true,
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
      category: 8,
      type: 0,
      stmt: true,
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
      category: 8,
      type: 0,
      stmt: true,
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
      category: 8,
      type: 0,
      stmt: true,
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
      category: 8,
      type: 0,
      stmt: true,
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
      category: 8,
      type: 0
    },
    {
      names: ['onclick'],
      category: 9,
      type: 0,
      stmt: true,
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
      category: 9,
      type: 0,
      stmt: true,
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
      category: 9,
      type: 0,
      stmt: true,
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
      category: 10,
      type: 0,
      stmt: true
    },
    {
      names: ['end_poly'],
      category: 10,
      type: 0,
      stmt: true
    },
    {
      names: ['get_poly'],
      category: 10,
      type: 0
    },
    {
      names: ['clone'],
      category: 10,
      type: 0,
      stmt: true
    },
    {
      names: ['getturtle', 'getpen'],
      category: 10,
      type: 0
    },
    {
      names: ['getscreen'],
      category: 10,
      type: 0
    },
    {
      names: ['setundobuffer'],
      category: 10,
      type: 0,
      stmt: true,
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
      category: 10,
      type: 0
    },
    {
      names: ['bgcolor'],
      category: 11,
      type: 0,
      stmt: true,
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
      category: 11,
      type: 0,
      stmt: true,
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
      category: 11,
      type: 0,
      stmt: true
    },
    {
      names: ['resetscreen', 'reset'],
      category: 11,
      type: 0,
      stmt: true
    },
    {
      names: ['screensize'],
      category: 11,
      type: 0,
      stmt: true,
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
      category: 11,
      type: 0,
      stmt: true,
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
      category: 12,
      type: 0,
      stmt: true,
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
      category: 12,
      type: 0,
      stmt: true,
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
      category: 12,
      type: 0,
      stmt: true
    },
    {
      names: ['listen'],
      category: 13,
      type: 0,
      stmt: true,
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
      category: 13,
      type: 0,
      stmt: true,
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
      category: 13,
      type: 0,
      stmt: true,
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
      category: 13,
      type: 0,
      stmt: true,
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
      category: 13,
      type: 0,
      stmt: true,
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
      category: 13,
      type: 0,
      stmt: true
    },
    {
      names: ['textinput'],
      category: 14,
      type: 0,
      stmt: true,
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
      category: 14,
      type: 0,
      stmt: true,
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
      category: 15,
      type: 0,
      stmt: true,
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
      category: 15,
      type: 0,
      stmt: true,
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
      category: 15,
      type: 0
    },
    {
      names: ['getshapes'],
      category: 15,
      type: 0
    },
    {
      names: ['register_shape', 'addshape'],
      category: 15,
      type: 0,
      stmt: true,
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
      category: 15,
      type: 0
    },
    {
      names: ['window_height'],
      category: 15,
      type: 0
    },
    {
      names: ['window_width'],
      category: 15,
      type: 0
    },
    {
      names: ['bye'],
      category: 16,
      type: 0,
      stmt: true
    },
    {
      names: ['exitonclick'],
      category: 16,
      type: 0,
      stmt: true
    },
    {
      names: ['setup'],
      category: 16,
      type: 0,
      stmt: true,
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
      category: 16,
      type: 0,
      stmt: true,
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
      category: 17,
      type: 1,
      stmt: true,
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
      category: 17,
      type: 1,
      stmt: true
    },
    {
      names: ['TurtleScreen'],
      category: 17,
      type: 1,
      stmt: true,
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
      category: 17,
      type: 1,
      stmt: true
    },
    {
      names: ['ScrolledCanvas'],
      category: 17,
      type: 1,
      stmt: true,
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
      category: 17,
      type: 1,
      stmt: true,
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
      category: 17,
      type: 1,
      stmt: true,
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
      category: 18,
      type: 0,
      stmt: true,
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
    'width': 26,
    'exitonclick': 87,
    'begin_fill': 33,
    'fillcolor': 30,
    'textinput': 76,
    'register_shape': 82,
    'setposition': 4,
    'done': 75,
    'bk': 1,
    'heading': 20,
    'seth': 7,
    'getpen': 57,
    'onrelease': 51,
    'clear': 63,
    'RawTurtle': 90,
    'write_docstringdict': 97,
    'undobufferentries': 60,
    'Screen': 93,
    'getscreen': 58,
    'update': 69,
    'isdown': 28,
    'settiltangle': 46,
    'bye': 86,
    'pd': 24,
    'filling': 32,
    'clone': 56,
    'clearstamps': 13,
    'pendown': 24,
    'onclick': 73,
    'pencolor': 29,
    'reset': 64,
    'shapetransform': 48,
    'getshapes': 81,
    'speed': 15,
    'delay': 67,
    'setpos': 4,
    'undo': 14,
    'showturtle': 39,
    'numinput': 77,
    'setworldcoordinates': 66,
    'window_height': 84,
    'penup': 25,
    'resetscreen': 64,
    'dot': 10,
    'pensize': 26,
    'listen': 70,
    'ontimer': 74,
    'getturtle': 57,
    'ScrolledCanvas': 94,
    'isvisible': 40,
    'screensize': 65,
    'towards': 17,
    'TurtleScreen': 92,
    'mainloop': 75,
    'degrees': 22,
    'sety': 6,
    'clearscreen': 63,
    'write': 37,
    'window_width': 85,
    'backward': 1,
    'down': 24,
    'pen': 27,
    'home': 8,
    'tiltangle': 47,
    'circle': 9,
    'addshape': 82,
    'onkeypress': 72,
    'pu': 25,
    'resizemode': 42,
    'ycor': 19,
    'right': 2,
    'turtlesize': 43,
    'pos': 16,
    'stamp': 11,
    'Shape': 95,
    'bgpic': 62,
    'end_fill': 34,
    'get_poly': 55,
    'getcanvas': 80,
    'ondrag': 52,
    'colormode': 79,
    'onscreenclick': 73,
    'turtles': 83,
    'onkeyrelease': 71,
    'back': 1,
    'shearfactor': 44,
    'position': 16,
    'Turtle': 91,
    'Vec2D': 96,
    'tracer': 68,
    'bgcolor': 61,
    'distance': 21,
    'shapesize': 43,
    'setx': 5,
    'lt': 3,
    'mode': 78,
    'st': 39,
    'get_shapepoly': 49,
    'up': 25,
    'xcor': 18,
    'onkey': 71,
    'ht': 38,
    'left': 3,
    'setundobuffer': 59,
    'setup': 88,
    'title': 89,
    'RawPen': 90,
    'forward': 0,
    'goto': 4,
    'hideturtle': 38,
    'shape': 41,
    'setheading': 7,
    'end_poly': 54,
    'radians': 23,
    'tilt': 45,
    'rt': 2,
    'fd': 0,
    'begin_poly': 53,
    'clearstamp': 12,
    'color': 31
  },
  by_category: {
    2: [22, 23],
    6: [35, 36, 37],
    11: [61, 62, 63, 64, 65, 66],
    0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    18: [97],
    13: [70, 71, 72, 73, 74, 75],
    8: [41, 42, 43, 44, 45, 46, 47, 48, 49],
    17: [90, 91, 92, 93, 94, 95, 96],
    12: [67, 68, 69],
    14: [76, 77],
    16: [86, 87, 88, 89],
    9: [50, 51, 52],
    4: [29, 30, 31],
    5: [32, 33, 34],
    1: [16, 17, 18, 19, 20, 21],
    3: [24, 25, 26, 27, 28],
    10: [53, 54, 55, 56, 57, 58, 59, 60],
    7: [38, 39, 40],
    15: [78, 79, 80, 81, 82, 83, 84, 85]
  },
  by_type: {
    1: [90, 91, 92, 93, 94, 95, 96],
    0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 97]
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
eYo.Model.turtle__module.getItemsInCategory = function (category, type) {
  var ra = eYo.Model.turtle__module.data.by_category[category] || []
  if (goog.isString(type)) {
    type = eYo.Model.turtle__module.data.type.indexOf(type)
  }
  if (goog.isNumber(type) && type >= 0) {
    var ra2 = []
    for (var i = 0; i < ra.length ; i++ ) {
      var item = eYo.Model.turtle__module.getItem(i)
      if (item && item.type === type) {
        ra2.append(i)
      }
    }
    return ra2
  } else {
    return ra
  }
}

// This file was generated by `./bin/helpers/{module}bot.py` on 2018-07-10 15:52:24.263137


