/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview cpython's grammar.c, graminit.h and grammar1.c counterparts.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

eYo.require('E')

eYo.require('Do')
eYo.require('TKN')
eYo.provide('GMR')

/* Grammar implementation *-/

#include "Python.h"
#include "pgenheaders.h"

#include <ctype.h>

#include "token.h"
#include "grammar.h"
*/

eYo.GMR = function (dfas, labels, start) {
  this.g_dfa = dfas || []
  this.g_start = start
  this.g_ll = {}
  this.g_ll.ll_label = labels || []
  Object.defineProperties(this.g_ll, {
    ll_nlabels: {
      get () {
        return this.ll_label.length
      }
    }
  })
  this.g_accel = 0
}

Object.defineProperties(eYo.GMR.prototype, {
  g_ndfas: {
    get () {
      return this.g_dfa.length
    }
  }
})

/* Grammar interface */

// #include "bitset.h" /* Sigh... */

/* A label of an arc *-/

typedef struct {
    int          lb_type
    char        *lb_str
} label
*/

eYo.GMR.Label = function (type, str) {
  this.lb_type = type
  this.lb_str = str
}

/*
eYo.GMR.EMPTY = 0         /* Label number 0 is by definition the empty label *-/

/* A list of labels *-/

typedef struct {
    int          length
    label       *ll_label
} labellist

/* An arc from one state to another *-/

typedef struct {
    short       a_lbl;          /* Label of this arc *-/
    short       a_arrow;        /* State where this arc goes to *-/
} arc
*/

eYo.GMR.Arc = function(lbl, arrow) {
  this.a_lbl = lbl
  this.a_arrow = arrow
}

/* A state in a DFA *-/

typedef struct {
    int          s_narcs
    arc         *s_arc;         /* Array of arcs *-/

    /* Optional accelerators *-/
    int          s_lower;       /* Lowest label index *-/
    int          s_upper;       /* Highest label index *-/
    int         *s_accel;       /* Accelerator *-/
    int          s_accept;      /* Nonzero for accepting state *-/
} state
*/

eYo.GMR.State = function (arcs) {
  this.s_arc = arcs || []
  this.s_lower = 0
  this.s_upper = 0
  this.s_accel = null
  this.s_accept = 0
}

Object.defineProperties(eYo.GMR.State.prototype, {
  s_narcs: {
    get() {
      return this.s_arc.length
    }
  }
})

/* A DFA *-/

typedef struct {
    int          d_type;        /* Non-terminal this represents *-/
    char        *d_name;        /* For printing *-/
    int          d_initial;     /* Initial state *-/
    int          d_nstates
    state       *d_state;       /* Array of states *-/
    bitset       d_first
} dfa
*/

eYo.GMR.DFA = function (type, name, initial, states, first) {
  /*
  {256, "single_input", 0, 3, states_0,
     "\004\050\340\000\004\000\000\000\024\174\022\016\204\045\000\041\000\000\014\211\362\041\010"},
     */
  this.d_type = type
  this.d_name = name
  this.d_initial = initial
  this.d_state = states
  this.d_first = first
}

Object.defineProperties(eYo.GMR.DFA.prototype, {
  d_nstates: {
    get () {
      return this.d_state.length
    }
  }
})

/* A grammar *-/

typedef struct {
    int          g_ndfas
    dfa         *g_dfa;         /* Array of DFAs *-/
    labellist    g_ll
    int          g_start;       /* Start symbol of the grammar *-/
    int          g_accel;       /* Set if accelerators present *-/
} grammar

/* FUNCTIONS *-/

grammar *newgrammar(int start)
void freegrammar(grammar *g)
dfa *adddfa(grammar *g, int type, const char *name)
int addstate(dfa *d)
void addarc(dfa *d, int from, int to, int lbl)
dfa *PyGrammar_FindDFA(grammar *g, int type)

int addlabel(labellist *ll, int type, const char *str)
int findlabel(labellist *ll, int type, const char *str)
const char *PyGrammar_LabelRepr(label *lb)
void translatelabels(grammar *g)

void addfirstsets(grammar *g)

void PyGrammar_AddAccelerators(grammar *g)
void PyGrammar_RemoveAccelerators(grammar *)

void printgrammar(grammar *g, FILE *fp)
void printnonterminals(grammar *g, FILE *fp)

/*

extern int Py_DEBUG

grammar * */

eYo.GMR.newgrammar = (/* int */ start) =>
{
  return new eYo.GMR(null, null, start)
}

/* dfa * */
eYo.GMR.adddfa = (/* grammar * */ g, /* int */ type, /* const char * */ name) =>
{
    var /* dfa * */ d = {}
    g.g_dfa.push(d)
    d.d_type = type
    d.d_name = name
    d.d_nstates = 0
    d.d_state = []
    d.d_initial = -1
    d.d_first = null
    return d; /* Only use while fresh! */
}

/* int */
eYo.GMR.addstate = (/* dfa * */ d) =>
{
  var /* state * */ s = new eYo.GMR.State()
  d.d_state.push(state)
  ++d.d_nstates
  return d.d_state.length - 1
}

/* void */
eYo.GMR.addarc = (/* dfa * */ d, /* int */ from, /* int */ to, /* int */ lbl) =>
{
  s = d.d_state[from]
  s.s_arc.push(new eYo.GMR.Arc(lbl, to))
}

/* int */
eYo.GMR.addlabel = (/* labellist * */ ll, /* int */ type, /* const char * */ str) =>
{
  var /* int */ i
  for (i = 0; i < ll.length; i++) {
    if (ll[i].lb_type === type && ll[i].lb_str === str) {
      return i
    }
  }
  var /* label * */ lb = {}
  ll.push(new eYo.GMR.Label(type, str))
  return ll.length - 1
}

/* Same, but rather dies than adds *-/

int */
eYo.GMR.findlabel = (/* labellist * */ ll, /* int */ type, /* const char * */ str) =>
{
  var i

  for (i = 0; i < ll.length; i++) {
    if (ll[i].lb_type === type /*&&
      ll[i].lb_str === str*/) // JL: WHY IS IT COMMENTED OUT ?
      return i
  }
  console.error("Label %d/'%s' not found\n", type, str)
  throw "grammar.c:findlabel()"

  /* Py_FatalError() is declared with __attribute__((__noreturn__)).
      GCC emits a warning without "return 0;" (compiler bug!), but Clang is
      smarter and emits a warning on the return... */
}

/* Forward *-/
static void translabel(grammar *, label *)

void */
// eYo.GMR.translatelabels = (/* grammar * */ g) =>
// {
//   /* Don't translate EMPTY */
//   for (var i = eYo.GMR.EMPTY+1; i < g.g_ll.length; i++) {
//     eYo.GMR.translabel(g, g.g_ll[i])
//   }
// }

eYo.Do.isalpha = c => XRegExp.exec(c, eYo.Scan.XRE.letter, 0, true)
eYo.Do.Py_CHARMASK = c => c & 0xff

/* static void */
// eYo.GMR.translabel = (/* grammar * */ g, /* label * */ lb) =>
// {
//   var i
//   if (lb.lb_type === eYo.TKN.NAME) {
//     for (i = 0; i < g.g_ndfas; i++) {
//       if (lb.lb_str === g.g_dfa[i].d_name) {
//         lb.lb_type = g.g_dfa[i].d_type
//         lb.lb_str = null
//         return
//       }
//     }
//     for (i = 0; i < eYo.TKN.N_TOKENS; i++) {
//       if (lb.lb_str === eYo.TKN._NAMES[i]) {
//         lb.lb_type = i
//         lb.lb_str = null
//         return
//       }
//     }
//     console.log("Can't translate NAME label '%s'\n", lb.lb_str)
//     return
//   }
//   if (lb.lb_type === eYo.TKN.STRING) {
//     if (eYo.Do.isalpha(eYo.Do.Py_CHARMASK(lb.lb_str[1])) ||
//       lb.lb_str[1] === '_') {
//       var /* size_t */ name_len
//       if (eYo.Const.Py_DEBUG) {
//         console.log("Label %s is a keyword\n", lb.lb_str)
//       }
//       lb.lb_type = eYo.TKN.NAME
//       name_len = str.indexOf("'", 1)
//       if (name_len < 0) {
//         lb.lb_str = str
//       } else {
//         lb.lb_str = str.substring(0, name_len)
//       }
//     }
//     else if (lb.lb_str[2] === lb.lb_str[0]) {
//       var type = eYo.TKN.PyToken_OneChar(lb.lb_str[1])
//       if (type !== eYo.TKN.OP) {
//         lb.lb_type = type
//         lb.lb_str = null
//       }
//       else {
//         console.log("Unknown OP label %s\n", lb.lb_str)
//       }
//     }
//     else if (lb.lb_str[2] && lb.lb_str[3] === lb.lb_str[0]) {
//         var type = eYo.TKN.PyToken_TwoChars(lb.lb_str[1],
//                                     lb.lb_str[2])
//         if (type !== eYo.TKN.OP) {
//             lb.lb_type = type
//             lb.lb_str = null
//         }
//         else {
//           console.log("Unknown OP label %s\n", lb.lb_str)
//         }
//     }
//     else if (lb.lb_str[2] && lb.lb_str[3] && lb.lb_str[4] === lb.lb_str[0]) {
//         var type = eYo.TKN.PyToken_ThreeChars(lb.lb_str[1],
//                                             lb.lb_str[2],
//                                             lb.lb_str[3])
//         if (type !== eYo.TKN.OP) {
//             lb.lb_type = type
//             lb.lb_str = null
//         }
//         else {
//           console.log("Unknown OP label %s\n", lb.lb_str)
//         }
//     }
//     else {
//       console.log("Can't translate STRING label %s\n",
//       lb.lb_str)
//     }
//   }
//   else {
//     console.log("Can't translate label '%s'\n",
//             eYo.GMR.PyGrammar_LabelRepr(lb))
//   }
// }

/* Including grammar1.c /*

/* Grammar subroutines needed by parser */

/* Return the DFA for the given type */

/* dfa * */
eYo.GMR.PyGrammar_FindDFA = (/* grammar * */ g, /* int */ type) =>
{
  var /* dfa * */ d = g.g_dfa[type - eYo.TKN.NT_OFFSET]
  if (!d) {
    console.error('WTF')
  }
  eYo.assert(d.d_type === type, `${d.d_type} === ${type}`)
  return d
}

/* const char * */
eYo.GMR.PyGrammar_LabelRepr = (/* label * */ lb) =>
{
  if (lb.lb_type === eYo.TKN.ENDMARKER) {
    return "EMPTY"
  } else if (eYo.TKN.ISNONTERMINAL(lb.lb_type)) {
    if (lb.lb_str === null) {
      return `NT${lb.lb_type}`
    } else {
      return lb.lb_str
    }
  }
  else if (lb.lb_type < eYo.TKN.N_TOKENS) {
    if (lb.lb_str === null)
      return eYo.TKN._NAMES[lb.lb_type]
    else {
      return `${lb.lb_type}(${lb.lb_str})`
    }
  }
  else {
    console.error("invalid label in PyGrammar_LabelRepr")
    return null
  }
}

