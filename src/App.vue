<template>
  <div id="app">
    <div>
      <search-box
        v-model="keyword"
        :format="format"
        :searchRequest="getSuggest"
        selectStyle="ss"
      />
      <div class="area_button">
        <button>BUTTON1</button>
        <button>BUTTON2</button>
      </div>
     
    </div>
  </div>
</template>

<script>

import SearchBox from '@components/SearchBox/SearchBox.vue'
export default {
  name: 'App',
  components: {
    SearchBox,
  },
  data(){
    return {
        keyword: '',
    }
  },
  methods:{
    getSuggest(){
      return new Promise((resolve) => {
        setTimeout(() =>{
          resolve(Array.from(Array(Math.floor(Math.random() * 10) + 1)).map((item,index) => index))
        } ,500)
      })  
    },
    format(index){
      return `${index}. blah`
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  height: 100vh;
}
.area_button{
  padding: 80px 0
}

</style>
