<template>
  <div>
    <ul>
      <li>NS: {{ NS }}</li>
      <li>Mailbox: {{ Mbox }}</li>
      <li>Serial: {{ Serial }}</li>
    </ul>


  </div>
</template>

<script>
export default {
name: "SOA",
  props: {
  NS: String,
  Mbox: String,
  Serial: Number,
  Refresh: Number,
  Expire: Number,
  Minttl: Number
  }
}
</script>

<style scoped>

</style>