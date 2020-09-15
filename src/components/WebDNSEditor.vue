<template>
  <div>
    <div class="columns">
      <div class="column is-half">
        <b-field label="DNS Server">
          <b-input v-model="name"></b-input>
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
                   v-model="key"
                   password-reveal>
          </b-input>
        </b-field>
        <b-button v-on:click=getRecords>Get records</b-button>
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
        :mobile-cards="true">

      <b-table-column field="id" label="ID" width="40" numeric v-slot="props">
        {{ props.row.id }}
      </b-table-column>
      <b-table-column field="first_name" label="Name" v-slot="props">
        {{ props.row.first_name }}
      </b-table-column>
      <b-table-column field="last_name" label="Target" v-slot="props">
        {{ props.row.last_name }}
      </b-table-column>
      <b-table-column field="type" label="Type" v-slot="props">
        {{ props.row.type }}
      </b-table-column>
    </b-table>
  </div>
</template>

<script>

export default {
  name: 'WebDNSEditor',
  methods: {
    getRecords: function () {
      let dataaa = this.data;
      let indexx = 1;
      let requestData = {
        "keyname": this.keyname,
        "domain": "jsp.lol.",
        "key": "2vzVzhEzXQvFUCxtLtgi0benURC/7KGIdIsDxg5dN5XcrCSZInH0s2yToxeYO2Q9BcgWQbEjwcM6uWyRjueGhA==",
        "algo": this.algo,
        "server": this.server,
      };
      let payload = encodeURIComponent(JSON.stringify(requestData));
      console.log(process.env.API_URL + "/getRecords?data=" + payload);
      fetch("http://localhost:8080/getRecords?data=" + payload)
          .then(function (response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`
            return response.json();
          }).then(function (data) {
        // `data` is the parsed version of the JSON returned from the above endpoint.
        data.forEach((element) => {
          let currData = {
            'id': indexx,
            'first_name': element.Hdr.Name,
            'last_name': element.Hdr.ttl,
            'type': element.Hdr,
            'gender': 'Male'
          };

          dataaa.splice(indexx + 1, 0, currData);
          indexx = indexx + 1;  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
        })
      });
      this.data = dataaa;
      this.index = indexx;
      console.log(this.data)
    }
  },
  data() {
    let data = []

    let index = 1;
    let fieldAreFull = false;
    let options = [
      {id: 1, "test": "lalal"}
    ]
    return {
      data,
      index,
      fieldAreFull,
      "algo": "hmac-sha512",
      "name": 'jsp.lol.',
      "server": '127.0.0.1:53',
      "keyname": 'key',
      "key": "2vzVzhEzXQvFUCxtLtgi0benURC/7KGIdIsDxg5dN5XcrCSZInH0s2yToxeYO2Q9BcgWQbEjwcM6uWyRjueGhA==",
      options
    }
  }
}
</script>
