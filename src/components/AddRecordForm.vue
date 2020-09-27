<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Add a new record</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Record type">
        <b-select v-model="typeOfRecord">
          <option value="A">A</option>
          <option value="AAAA">AAAA</option>
          <option value="CNAME">CNAME</option>
          <option value="TXT">TXT</option>
          <option value="NS">NS</option>
        </b-select>
      </b-field>

      <div>
        <b-field label="Target">
          <b-input v-if='typeOfRecord === "A"' v-model="target" required pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"></b-input>
          <b-input v-if='typeOfRecord === "AAAA"' v-model="target" required pattern="^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$"></b-input>
          <b-input v-if='typeOfRecord === "CNAME"' v-model="target" required pattern="^(([a-zA-Z0-9_]|[a-zA-Z0-9_][a-zA-Z0-9_\-]*[a-zA-Z0-9_])\.)*([A-Za-z0-9_]|[A-Za-z0-9_][A-Za-z0-9_\-]*[A-Za-z0-9_](\.?))$"></b-input>
          <b-input v-if='typeOfRecord === "TXT"' v-model="target" required></b-input>
          <b-input v-if='typeOfRecord === "TXT"' v-model="target" required></b-input>
          <b-input v-if='typeOfRecord === "NS"' v-model="target" requiered></b-input>
        </b-field>
      </div>


      <b-field label="Subdomain">
        <b-input v-model="subdomain" :value="subdomain" placeholder="sub" expanded></b-input>
        <p class="control">
          <span class="button is-static">.{{ domain }}</span>
        </p>
      </b-field>

      <b-field label="TTL">
        <b-input v-model="TTL"
                 required
                 type="number">

        </b-input>
      </b-field>

    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" v-on:click="sendData">Add</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "AddRecordForm",
  props: {
    domain: String
  },
  data() {
    let target, subdomain;
    return {
      "typeOfRecord": "A",
      target,
      subdomain,
      "TTL": 3600
    }
  },
  methods: {
    sendData: function () {
      this.$emit('sendNewRecord', [this.subdomain+"."+this.domain,this.target,this.typeOfRecord,this.TTL])
      this.$buefy.toast.open({
        message: 'Record added successfully!',
        type: 'is-success'
      })
    }
  },
  change: {
    target(newTarget) {
      console.log(newTarget);
    },
    typeOfRecord(newType) {
      localStorage.typeOfRecord = newType;
    }
  },
  mounted() {
    if (localStorage.typeOfRecord) {
      this.typeOfRecord = localStorage.typeOfRecord;
    }
  }
}
</script>

