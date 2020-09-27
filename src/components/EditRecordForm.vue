<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit record n° {{ id }}</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Record type">
        <b-select v-model="typeOfRecord" disabled>
          <option value="A">A</option>
          <option value="AAAA">AAAA</option>
          <option value="CNAME">CNAME</option>
          <option value="TXT">TXT</option>
          <option value="NS">NS</option>
        </b-select>
      </b-field>

      <div>
        <b-field v-model="typeOfRecord" label="Target">
          <b-input v-if='typeOfRecord === "A"' v-model="target" required pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"></b-input>
          <b-input v-if='typeOfRecord === "AAAA"' v-model="target" required pattern="^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$"></b-input>
          <b-input v-if='typeOfRecord === "CNAME"' v-model="target" required pattern="^(([a-zA-Z0-9_]|[a-zA-Z0-9_][a-zA-Z0-9_\-]*[a-zA-Z0-9_])\.)*([A-Za-z0-9_]|[A-Za-z0-9_][A-Za-z0-9_\-]*[A-Za-z0-9_](\.?))$"></b-input>
          <b-input v-if='typeOfRecord === "TXT"' v-model="target" required></b-input>
          <b-input v-if='typeOfRecord === "NS"' v-model="target" required></b-input>
        </b-field>
      </div>


      <b-field label="Subdomain">
        <b-input v-model="subdomain" placeholder="sub" expanded></b-input>
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
      <button class="button is-primary" @click="$parent.close()" v-on:click="sendData">Edit</button>
    </footer>
  </div>
</template>

<script lang="ts">

import {parseDomain, fromUrl} from "parse-domain";

export default {
  name: "EditRecordForm",
  props: {
    domain: String,
    test: Number,
    data: Array,
    id: Number
  },
  data() {
    let recordInfo, TTL, typeOfRecord, subdomain, target;
    return {
      recordInfo,
      TTL,
      typeOfRecord,
      subdomain,
      target
    }
  },
  methods: {
    sendData: function () {
      this.$emit('sendEditedRecord', [this.recordInfo,this.subdomain+"."+this.domain,this.target,this.typeOfRecord,this.TTL])
      this.$buefy.toast.open({
        message: 'Record edited successfully!',
        type: 'is-success'
      });
    }
  },
  mounted() {
//    console.log(this.test);
  //  console.log(this.data[this.test])
    this.recordInfo = this.data[this.test];

    console.log(this.typeOfRecord);
    this.typeOfRecord = this.recordInfo.type;
    this.TTL = this.recordInfo.ttl;
    this.target = this.recordInfo.target;
    console.log(this.recordInfo.target)

    const {subDomains} = parseDomain(
        fromUrl(this.recordInfo.name),
    );
    this.subdomain = subDomains.join('.')
  }
}
</script>

