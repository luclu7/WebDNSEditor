<template>
  <div class="about">
    <h1>This is an about page</h1>
    <test></test>
  </div>
</template>

<script>

import test from "../components/testFetch.vue"

export default {
  components: {
      test
    }
}
</script>