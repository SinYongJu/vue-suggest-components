<template>
     <li>
        <button type="button" v-on="$listeners" @focus="focus" class="item_search" ref="button">
            <!-- <em>{{ search.accountId }}({{ search.empName }})</em>
            <p>{{ search.deptName }}</p> -->
            <slot/>
        </button>
        </li>
</template>

<script>
export default {
 name : 'search-seachbox-item',
 props: {
     search: {
         type: Object,
         default: () => {}
     },
 },
 methods: {
     focus() {
         this.$refs.button.focus()
         this.$emit('update:focus',this.$el)
     }
 },
}
</script>

<style scoped>
.list_suggest .item_search:focus,
.list_suggest .item_search:hover {
  background-color: #fffbed;
}
.list_suggest .item_search {
  text-align: left;
  width: 100%;
  padding: 12px 15px 11px;
}
.list_suggest .item_search em {
  display: block;
  padding-bottom: 2px;
  font-size: 12px;
  line-height: 15px;
  color: #222;
}
.list_suggest .item_search p {
  font-size: 12px;
  line-height: 15px;
  color: #888;
}
</style>