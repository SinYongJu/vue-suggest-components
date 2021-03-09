<template>
  <div class="area_search">
    <div
      class="search_box"
      :class="[selectStyle]"
      v-click-out-side="onBlur"
      v-out-side-focus="onBlur"
      :style="divStyle"
      @keydown.down="onKeydown"
      @keydown.up="onKeyUp"
      @keydown.enter="onKeyEnter"
      @keydown.tab="onKeyTab"
    >
      <input-simple
        id="searchEmployee"
        name="keyword"
        type="text"
        :value="keyword"
        :screen-out="true"
        :label="lable"
        :placeholder="placeHolder"
        ref="searchInp"
        autocomplete="off"
        @onInput="inputHndr"
        @update:focus="onFocus"
      />
      <div class="wrap_suggest" v-show="hasFocusSearch" ref="suggestWrap">
        <ul class="list_suggest" v-if="suggestResult.length > 0">
          <search-item
            v-for="(search, index) in suggestResult"
            :key="index"
            :search="{search}"
            @mousedown="onMouseDownItem(index)"
            ref="suggestItem"
          >
          {{ index + 1 }}
          </search-item>
        </ul>
        <ul class="list_suggest" v-else>
          <li class="item_search">
            <p class="desc_result">{{ noResult }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import InputSimple from '@components/Input/Input.vue'
import SearchItem from '@components/SearchItem/SearchItem.vue'

import * as _ from 'lodash'

// v-out-side-focus 의 hndr 저장
let focusableOutSideEls =null
export default {
  neme: 'register-search-box',
  props: {
    value: {
      type: String,
      default: ''
    },
    clickHndr: {
      type: Function,
      default: () => null
    },
    selectUser: {
      type: Object,
      default: ()=>({})
    },
    searchType: {
			type: String,
			default: 'serveService',
		},
    searchRequest: {
      type: Function,
      default: () => {},
    },
    lable: {
      type: String,
      default: 'SEARCH FILED'
    },
    noResult: {
      type: String,
      default: 'NO RESULT'
    },
    placeHolder: {
      type: String,
      default: ''
    },
    divStyle: {
      type: String,
      default: ''
    },
    selectStyle: {
      type: String,
      default: ''
		},
    duration: {
      type: Number,
      default: 300
    },
    format: {
      type: Function,
      default: (item) => {
        return `${item.accountId}`
      },
    }
  },
  components: {
    // ButtonSimple,
    InputSimple,
    SearchItem
  },
  data() {
    return {
      hasFocusSearch: false,
      cursor: -1, // default
      suggestResult: []
    }
  },
  computed: {
    keyword: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    computedSelectUser: {
      get () {
        return this.selectUser
      },
      set (selectUser) {  
        this.$emit('update:selectUser', selectUser)
      }
    },
    cursorMaxLength() {
      return this.suggestResult.length
    },
  },
  created () {
    // debounce 함수의 memorize created시 할당
    this.debounce =  _.debounce(async function (newKeyword){
      // props 로 주입 받읁 searchRequest 함수를 이용 합니다.
      const data = await this.searchRequest(newKeyword)
      this.suggestResult = data
      },this.duration)
  },
  methods: {
    reset() {
      this.hasFocusSearch = false
      this.cursor = -1
    },
    onFocus() {
      if (this.keyword === '') return
       this.debounce(this.keyword)
      this.hasFocusSearch = true
      this.cursor = -1
    },
    onBlur() {
      this.reset()
      // FIXME: 임시
      this.$refs.searchInp && this.$refs.searchInp.$refs.input.blur()
    },
    // todo input 에 자동 완성 기능
    onKeydown(event) {
      event.preventDefault()
      // under
      if (this.suggestResult.length && this.cursor < this.suggestResult.length) {
        this.cursor++
        this.$refs.suggestItem[this.cursor] && this.$refs.suggestItem[this.cursor].focus()
      } else {
        // 리스트 마지막 blur 로 나가기
        this.onBlur()
        return
      }
    },
    onKeyUp(event) {
      event.preventDefault()
      if (this.cursor === 0) {
        this.$refs.searchInp.focus()
        return
      }
      if (this.cursor > -1) {
        // up
        this.cursor--
        this.$refs.suggestItem[this.cursor] && this.$refs.suggestItem[this.cursor].focus()
      }
    },
    onKeyTab(event) {
      event.preventDefault()
      this.onKeydown(event)
    },
    onKeyEnter() {
      // if (this.$refs.searchInp.$refs.input == event.target) {
      //   this.autoComplete(0)
      //   this.emitSelectIndex(0)
      // }
      this.autoComplete(this.cursor)
      this.emitSelectIndex(this.cursor)
    },
    onMouseDownItem(index) {
      this.autoComplete(index)
      this.emitSelectIndex(index)
    },
    onSelectUserHndr(result) {
      this.computedSelectUser = result
    },
    emitSelectIndex(index) {
      // this.$emit('update:selectedSuggest', this.suggestResult[index])
      this.onSelectUserHndr(this.suggestResult[index])
      this.onBlur()
    },
    inputHndr(event) {
      const value = event.target.value
       if (value === '') {
        this.reset()
      } else {
        this.hasFocusSearch = true
      }
      this.keyword = value
    },
    autoComplete(cursor) {
      if (cursor > -1 && cursor < this.cursorMaxLength) {
        // format 함수를 외부에서 주입 하는 방식이 좋아 보입니다 
        this.keyword = this.format(this.suggestResult[cursor])
      }
    },
  },
  watch: {
    cursor() {
      if (this.cursor > this.suggestResult.length) {
        this.cursor = this.suggestResult.length
      }
    },
    keyword(newKeyword) {
      if (newKeyword !== '') {
        this.debounce(newKeyword)
      }
    }
  },
  directives: {
    outSideFocus: {
      unbind(el) {
        focusableOutSideEls = document.body.querySelectorAll('a, input, button')
        Array.from(focusableOutSideEls).map(item => item.removeEventListener('focus', el.focusHndr))
        focusableOutSideEls = null
      },
      componentUpdated(el, binding, vnode) {
        const vm = vnode.context
        const callback = binding.value // callback
        focusableOutSideEls = document.body.querySelectorAll('a, input, button')
        const focusTargets = el.querySelectorAll('input, button')
        Array.from(focusableOutSideEls).map(item => item.removeEventListener('focus', el.focusHndr))
        el.focusHndr = event => {
          if (!Array.from(focusTargets).includes(event.target)) {
            return callback.call(vm, event)
          }
        }
        Array.from(focusableOutSideEls).map(item => item.addEventListener('focus', el.focusHndr))
      },
      bind(el, binding, vnode) {
        const vm = vnode.context
        const callback = binding.value // callback
        const focusTargets = el.querySelectorAll('input, button')
        focusableOutSideEls = document.body.querySelectorAll('a, input, button')
        el.focusHndr = event => {
          if (!Array.from(focusTargets).includes(event.target)) {
            return callback.call(vm, event)
          }
        }
        Array.from(focusableOutSideEls).map(item => item.addEventListener('focus', el.focusHndr))
      }
    },
    clickOutSide: {
      bind(el, binding, vnode) {
        // 처음 한번 호출
        const vm = vnode.context
        const callback = binding.value // callback
        el.clickOutsideEvent = event => {
          if (!(el == event.target || el.contains(event.target))) {
            return callback.call(vm, event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
.area_search {
  padding-right: 24px;
}
.search_box {
  position: relative;
  z-index: 10;
}
.wrap_suggest {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
}
.wrap_suggest .list_suggest {
  max-height: 296px;
  padding: 8px 0;
  background-color: #fff;
  overflow: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  border: 1px solid #555;
}
.desc_result {
  padding: 12px 15px 11px;
  font-size:12px;
  line-height: 15px;
  color: #222;
}
</style>
