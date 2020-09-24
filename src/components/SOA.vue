<template>
  <div>
    <ul>
      <li>NS: {{ Soa.Ns }}</li>
      <li>Mailbox: {{ Soa.Mbox }}</li>
      <li>Serial: {{ Soa.Serial }}</li>
      <li>Refresh: {{ Soa.Refresh }}</li>
      <li>Expire: {{ Soa.Expire }}</li>
      <li>MinTTL: {{ Soa.Minttl }}</li>
    </ul>
  </div>
</template>

<script>
export default {
name: "SOA",
  props: {
  Soa: Object,
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