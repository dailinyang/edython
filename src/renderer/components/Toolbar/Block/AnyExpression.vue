<template>
  <b-form-input
    v-model="expression"
    type="text"
    :class="$$class(expression)"
    :style='{fontFamily: $$.eYo.Font.familyMono}'
    :placeholder="$$t('block.placeholder.expression')"
    :title="title"
    v-tippy ></b-form-input>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import Modifier from './Modifier.vue'

  export default {
    name: 'info-any-expression',
    data: function () {
      return {
        saved_step: undefined,
        expression_: undefined
      }
    },
    components: {
      Modifier
    },
    computed: {
      ...mapState('Selected', [
        'step'
      ]),
      ...mapGetters('Selected', [
        'eyo'
      ]),
      title () {
        return this.$$t('block.enter_any_valid_expression')
      },
      expression: {
        get () {
          this.$$synchronize(this.step)
          return this.expression_
        },
        set (newValue) {
          this.eyo.expression_p = newValue
        }
      }
    },
    methods: {
      $$doSynchronize (eyo) {
        this.expression_ = eyo.expression_p
      },
      $$class (key) {
        return `eyo-code and item text${key.length ? '' : ' placeholder'} w-16rem`
      }
    }
  }
</script>
<style>
</style>
