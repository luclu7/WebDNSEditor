<template>
  <div>
    <SOA n-s="lalal.fr"></SOA>
    <h1>Poor man's Web DNS editor</h1>
    <div class="columns">
      <div class="column is-half">
        <b-field label="Domain name">
          <b-input v-model="domain"></b-input>
        </b-field>
        <b-field label="DNS Server">
          <b-input type="text" v-model="server">
          </b-input>
        </b-field>

        <b-select placeholder="Please select an algorithm" v-model="algo">
          <option value="hmac-sha512">hmac-sha512</option>
          <option value="hmac-sha256">hmac-sha256</option>
          <option value="hmac-sha384">hmac-sha384</option>
          <option value="hmac-sha1">hmac-sha1</option>
          <option value="hmac-md5">hmac-md5</option>
        </b-select>
      </div>

      <div class="column if-half">
        <b-field label="Key name">
          <b-input type="text" v-model="keyname">
          </b-input>
        </b-field>

        <b-field label="Key">
          <b-input type="password"
                   v-model="secretKey"
                   password-reveal>
          </b-input>
        </b-field>
        <div class="columns">
        <div class="column is-half">
          <b-button ref="submitButton" type="is-primary" v-bind:loading=isLoading v-bind:disabled=isGetDisabled v-on:click=getRecords>Get records</b-button>
          </div>
        <div class="column is-half">
          <b-button ref="submitButton" type="is-danger is-light" v-bind:disabled=isClearDisabled v-on:click=clearRecords>Clear records</b-button>
        </div>
        </div>
        <b-button type="is-success" light v-bind:disabled=isSendDisabled>Send records</b-button>
      </div>
    </div>


    <br><br>


    <b-table
        :data="data"
        :bordered="true"
        :striped="false"
        :narrowed="true"
        :hoverable="true"
        :loading="false"
        :focusable="false"
        :searchable="true"
        :mobile-cards="true">

      <b-table-column field="id" label="ID" width="40" numeric v-slot="props">
        {{ props.row.id }}
      </b-table-column>
      <b-table-column field="name" label="Name" v-slot="props">
        {{ props.row.name }}
      </b-table-column>
      <b-table-column field="target" label="Target" v-slot="props">
        {{ props.row.target }}
      </b-table-column>
      <b-table-column field="type" label="Type" v-slot="props">
        {{ props.row.type }}
      </b-table-column>
      <b-table-column field="ttl" label="TTL" v-slot="props" width="50">
        {{ props.row.ttl }}
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import rrtt from "rr-to-type";

// eslint-disable-next-line no-unused-vars
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function transformRecordType(record) {
  switch (record) {
    case "A":
      return "A"
    case "AAAA":
      return "AAAA"
    default:
      return capitalizeFirstLetter(record.toLowerCase())
  }
}
import SOA from "@/components/SOA";

export default {
  name: 'WebDNSEditor',
  methods: {
    getRecords: async function () {
      let dataaa = this.data;
      this.isLoading = true;

      let indexx = 1;
      let requestData = {
        "keyname": this.keyname,
        "domain": this.domain,
        "key": this.secretKey,
        "algo": this.algo,
        "server": this.server,
      };
      let payload = encodeURIComponent(JSON.stringify(requestData));
      await new Promise(r => setTimeout(r, Math.random()*200));
      //console.log("http://localhost:8080/getRecords?data=" + payload);
      fetch("http://95.217.181.166:8080/getRecords?data=" + payload)
          .then(function (response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`

            return response.json();
          }).then(function (data) {
        // `data` is the parsed version of the JSON returned from the above endpoint.
        data.forEach((element) => {

          let typeRecord = rrtt.RRToType(element.Hdr.Rrtype);
          let recordAjusted = transformRecordType(typeRecord);

          let rtarget = "element." + recordAjusted;
          let recordTarget = eval(rtarget);

          switch (recordAjusted) {
            case "Soa":
              recordTarget = "NS: "+element.Ns
              recordTarget += "| Mailbox: "+ element.Mbox;
              recordTarget += "| Serial: "+ element.Serial;
              recordTarget += "| Refresh: "+ element.Refresh;
              recordTarget += "| MinTTL: "+ element.Minttl;
              recordTarget += "| Retry: "+ element.Retry;

              break
            default:
              break
          }

          let currData = {
            'id': indexx,
            'name': element.Hdr.Name,
            'type': typeRecord,
            'target': recordTarget,
            'ttl': element.Hdr.Ttl
          };

          dataaa.splice(indexx + 1, 0, currData);
          indexx = indexx + 1;
        })
      });
      this.data = dataaa;
      this.index = indexx;
      this.isLoading = false;
      this.isClearDisabled = false;
      this.isSendDisabled = false;
      this.isGetDisabled = true;
    },
    clearRecords: function () {
      this.data = [];
      this.index = 0;
      this.isClearDisabled = true;
      this.isSendDisabled = true;
      this.isGetDisabled = false;
    }
  },
  data() {
    let data = []

    let index = 1;
    let fieldAreFull = false;
    let secretKey, server, domain, algo, keyname;
    return {
      data,
      index,
      fieldAreFull,
      algo,
      domain,  //'jsp.lol.',
      server,
      secretKey,
      keyname,
      "isLoading": false,
      "isClearDisabled": true,
      "isGetDisabled": false,
      "isSendDisabled": true,
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    SOA
  },
  mounted() {
    if (localStorage.secretKey) {
      this.secretKey = localStorage.secretKey;
    }
    if (localStorage.domain) {
      this.domain = localStorage.domain;
    }
    if (localStorage.keyname) {
      this.keyname = localStorage.keyname;
    }
    if (localStorage.server) {
      this.server = localStorage.server;
    }
    if (localStorage.algo) {
      this.algo = localStorage.algo;
    }
  },
  watch: {
    secretKey(newKey) {
      localStorage.secretKey = newKey;
    },
    domain(newDomain) {
      localStorage.domain = newDomain;
    },
    keyname(newKeyName) {
      localStorage.keyname = newKeyName;
    },
    server(newServer) {
      localStorage.server = newServer;
    },
    algo(newAlgo) {
      localStorage.algo = newAlgo;
    }
  }

}
</script>
