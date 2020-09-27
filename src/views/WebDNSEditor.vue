<template>
  <div style="padding-left: 1em; padding-right: 1em;">
    <h1>Poor man's Web DNS editor</h1>
    <div class="columns">
      <div class="column is-half">
        <b-field label="Domain name">
          <b-input :disabled="isDomainInputDisabled" v-model="domain"></b-input>
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
          <div class="column is-one-quarter">
            <b-button ref="submitButton" type="is-primary" v-bind:loading=isLoading v-bind:disabled=isGetDisabled v-on:click=getRecords>Get records</b-button>
          </div>
          <div class="column is-one-quarter">
            <button class="button is-light is-primary" :disabled="isAddDisabled"
                    @click="isAddComponentModalActive = true">
              Add record
            </button>
            <b-modal
                v-model="isAddComponentModalActive"
                has-modal-card
                trap-focus
                :destroy-on-hide="false"
                aria-role="dialog"
                aria-modal>
              <template #default="props">
                <AddRecordForm @sendNewRecord="addNewRecord" :domain="domain" @close="props.close"></AddRecordForm>
              </template>
            </b-modal>

          </div>
          <div class="column is-one-quarter">
            <b-button ref="submitButton" type="is-danger is-light" v-bind:disabled=isClearDisabled v-on:click=clearRecords>Clear records</b-button>
          </div>
          <div class="column is-one-quarter">
            <b-button type="is-success" light v-bind:disabled=isSendDisabled @click="sendRecords">Send records</b-button>
          </div>
        </div>
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
        <SOA v-if='props.row.type === "SOA"' :Soa="props.row.target"></SOA>
        <span v-if='props.row.type !== "SOA"'>{{ props.row.target }}</span>
      </b-table-column>

      <b-table-column field="type" label="Type" v-slot="props">
        {{ props.row.type }}
      </b-table-column>

      <b-table-column field="ttl" label="TTL" v-slot="props" width="50">
        {{ props.row.ttl }}
      </b-table-column>

      <b-table-column field="Delete" v-slot="props" label="Delete" width="50">
        <b-button v-if='props.row.type !== "SOA"' :idRow="props.row.id" type="is-danger is-light" @click="deleteRecord">❌</b-button>
      </b-table-column>

      <b-table-column field="Edit" v-slot="props" label="Edit" width="50">
        <b-button :idRow="props.row.id" class="button is-light is-primary" :disabled="isAddDisabled"
                @click="getEditEvent" v-on:click="isEditComponentModalActive[props.row.id] = true">📝</b-button>
          <b-modal
              v-model="isEditComponentModalActive[props.row.id]"
              has-modal-card
              trap-focus
              :destroy-on-hide="false"
              aria-role="dialog"
              aria-modal>
              <EditRecordForm :data="data" :id="props.row.id" :test="editEvent" :domain="domain" @sendEditedRecord="editRecord"></EditRecordForm>
          </b-modal>
      </b-table-column>
    </b-table>
  </div>
</template>

<script lang="ts">
import rrtt from "rr-to-type";
import AddRecordForm from "../components/AddRecordForm";
import SOA from "../components/SOA";
import EditRecordForm from "../components/EditRecordForm";

export default {
  name: 'WebDNSEditor',
  methods: {
    getEditEvent(event) {
      console.log("cc mdr tuez moi lol")
      let idRow = event.currentTarget.getAttribute("idrow");
      const toEdit = this.data.findIndex(element => element.id === parseInt(idRow));
      console.log(this.data[toEdit]);
      this.editEvent = toEdit;
    },
    getRecords: async function () {
      let buefy = this.$buefy;
      this.isDomainInputDisabled = true;
      this.isLoading = true;

      let self = this


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
      fetch("http://localhost:8080/getRecords?data=" + payload)
      //fetch("https://webdns-api.luc.ovh/getRecords?data=" + payload)
          .then(function (response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`

            return response.json();
          }).then(function (data) {
        // `data` is the parsed version of the JSON returned from the above endpoint.
        data.forEach((element) => {
          let typeRecord = rrtt.RRToType(element.Hdr.Rrtype);
          let recordTarget;
          switch (typeRecord) {
            case "SOA":
              recordTarget = element;
              break
            case "CNAME":
              recordTarget = element.Target
              break
            case "A":
              recordTarget = element.A
              break
            case "AAAA":
              recordTarget = element.AAAA;
              break
            case "NS":
              recordTarget = element.Ns;
              break
            case "MX":
              recordTarget = element.Preference + " " + element.Mx;
              break
            case "TXT":
              recordTarget =  element.Txt;
              break
            default:
              recordTarget = "This record is not supported yet";
              recordTarget = element
              break
          }

          let currData = {
            'id': self.index,
            'name': element.Hdr.Name,
            'type': typeRecord,
            'target': recordTarget,
            'ttl': element.Hdr.Ttl
          };

          self.data.splice(self.index + 1, 0, currData);
          self.index = self.index + 1;

        })
        buefy.toast.open({
          message: 'Records were downloaded successfully',
          type: 'is-success'
        })
        self.isClearDisabled = false;
        self.isSendDisabled = true;
        self.isGetDisabled = true;
        self.isAddDisabled = false;
        self.isDomainInputDisabled = true;

      }).catch(function(error) {
        console.log("uh")
        console.log(error)
        buefy.toast.open({
          message: 'An error occurred!',
          type: 'is-danger'
        })
        self.isClearDisabled = true;
        self.isSendDisabled = true;
        self.isGetDisabled = false;
        self.isAddDisabled = true;
        self.isDomainInputDisabled = false;
      });
      this.isLoading = false;
    },
    clearRecords: function () {
      this.data = [];
      this.addedRecords = [];
      this.removedRecords = [];
      this.index = 0;
      this.isClearDisabled = true;
      this.isSendDisabled = true;
      this.isGetDisabled = false;
      this.isDomainInputDisabled = false;
      this.isAddDisabled = true;
    },
    editRecord(variable) {
      console.log(variable);

      let currData = {
        'id': this.index,
        'name': variable[1],
        'type': variable[3],
        'target': variable[2],
        'ttl': variable[4]
      };
      this.data.splice(this.index + 1, 1, variable[0]);
      this.data.splice(this.index + 1, 0, currData);
      this.addedRecords.splice(this.index, 0, currData);
      this.removedRecords.splice(this.index + 1, 0, variable[0]);
      this.isSendDisabled = false;

      //this.remRecords.splice(this.index, 0, variable[0]);

    },
    addNewRecord(variable) {
      this.test = variable;
      console.log(variable);

      let currData = {
        'id': this.index,
        'name': variable[0],
        'type': variable[2],
        'target': variable[1],
        'ttl': variable[3]
      };


      this.addedRecords.splice(this.index, 0, currData);
      this.index++
      this.isSendDisabled = false;
    },
    sendRecords() {
      let requestData= {
        "keyname": this.keyname,
        "domain": this.domain,
        "key": this.secretKey,
        "algo": this.algo,
        "server": this.server,
        "newRecords": this.addedRecords,
        "remRecords": this.removedRecords
      };
      console.log(JSON.stringify(requestData));

      let payload = encodeURIComponent(JSON.stringify(requestData));

      let self = this
      self.$buefy.dialog.confirm({
        message: 'Are you sure you want to continue?',
        onConfirm: function (){
          fetch("http://localhost:8080/addRecords?data=" + payload)
              .then(function (response) {
                // The response is a Response instance.
                // You parse the data into a useable format using `.json()`
                return response.json();
              }).then(function (data) {
           console.log(data.success)
            // I mean, who needs error handling?
            self.$buefy.toast.open({
              message: 'Records were added successfully!',
              type: 'is-success'
            })
            self.addedRecords = [];
            self.removedRecords = [];
            self.isSendDisabled = true;

          }).catch(function(error) {
            console.log(error)
            self.$buefy.toast.open({
              message: 'An error occurred!',
              type: 'is-danger'
            })

          });
        }})

    },
    deleteRecord(event) {
      let idRow = event.currentTarget.getAttribute("idrow");
      const toDelete = this.data.findIndex(element => element.id === parseInt(idRow));
      this.removedRecords.splice(this.index, 0, this.data[toDelete]);
      if (this.data[toDelete].type === "TXT") {
        console.log(this.data[toDelete].target.join(" "));
        this.data[toDelete].target = this.data[toDelete].target.join(' ')
      }
      if (toDelete < 0) {
        console.log("Uh, something broke: " + toDelete)
        return
      }
      this.data.splice(toDelete,1);
      this.isSendDisabled = false;
}
  },
  data() {
    let data = []
    let addedRecords = [];
    let removedRecords = [];
    let index = 1;
    let fieldAreFull = false;
    let secretKey, server, domain, algo, keyname, APIServer, editEvent;
    return {
      data,
      APIServer,
      index,
      fieldAreFull,
      algo,
      domain,  //'jsp.lol.',
      server,
      secretKey,
      editEvent,
      keyname,
      addedRecords,
      removedRecords,
      isAddComponentModalActive: false,
      isEditComponentModalActive: [],
      "isLoading": false,
      "isClearDisabled": true,
      "isGetDisabled": false,
      "isSendDisabled": true,
      "isAddDisabled": true,
      "isDomainInputDisabled": false,
    }
  },
  components: {
    SOA,
    AddRecordForm,
    EditRecordForm
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
    if (localStorage.APIServer) {
      this.APIServer = localStorage.APIServer;
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
    },
    APIServer(newAPIServer) {
      localStorage.APIServer = newAPIServer;
    }
  }

}
</script>