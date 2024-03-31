<template>
  <div>
    <h1>Hello World</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello World'
    };
  },
  mounted() {
    if(err){
      console.log(err)
    } 
  }
};
</script>