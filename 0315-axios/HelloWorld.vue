<template>
  <div class="hello">
 
     <span v-for='itme in obj' :key='item.id'></span>
   </div>
</template>
P
<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      json1:{},
      obj:[
       {
        id:123,
       }
      ]
      test:{}
    }
  },
  mounted:function(){
    this.qa.v(this).json1({
       suecc:function(res){
          this.test=res;
          return res.data.a1
       },
       data:{
        a:'this is a',
        b:123
       }
    });
  },
  methods:{
   send:function(){
 
   }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
