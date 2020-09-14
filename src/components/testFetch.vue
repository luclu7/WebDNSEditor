<template>
  <div>
    <h1>Hey</h1>
    <label>Server <input ref="server" ype="text"></label>
    <label>Key <input ref="key" type="text"></label>
    <label>Key name <input ref="key-name" type="text"></label>
    <label>Domain <input ref="domain" type="text"></label>
    <label>Algo <input ref="algo" type="text"></label>
    <br><br>
    <b-button v-if="fieldAreFull == true" v-on:click=test>Get records</b-button>
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

/*
let arrayToAdd = [
  { 'id': Math.random()*5, 'first_name': 'Jesse', 'last_name': 'Simmons', 'type': '2016/10/15 13:43:27', 'gender': 'Male' },
]

function myFunction(item, index) {
//  let currData = { 'id': index, 'first_name': item.Hdr.Name, 'last_name': item.Hdr.ttl, 'type': "lala", 'gender': 'Male' };
  let currData = { 'id': index, 'first_name': item.Hdr.Name, 'last_name': item.Hdr.ttl, 'type': "lala", 'gender': 'Male' };

  this.index=this.index+1

}
*/


export default {
  name: 'testFetch',
  methods: {
    test: function () {
      console.log(this.$refs.algo.value);

      let dataaa = this.data;
      let indexx = 1;
      let requestData = {
        "keyname": "key",
        "domain": "jsp.lol.",
        "key": "2vzVzhEzXQvFUCxtLtgi0benURC/7KGIdIsDxg5dN5XcrCSZInH0s2yToxeYO2Q9BcgWQbEjwcM6uWyRjueGhA==",
        "algo": this.$refs.algo.value,
        "server": this.$refs.server.value,
      };
      let payload = encodeURIComponent(JSON.stringify(requestData));
      console.log(payload);
      fetch(process.env.API_URL+"/getRecords?data=" + payload)
          .then(function (response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`
            return response.json();
          }).then(function (data) {
            // `data` is the parsed version of the JSON returned from the above endpoint.
            data.forEach((element) => {
              let currData = { 'id': indexx, 'first_name': element.Hdr.Name, 'last_name': element.Hdr.ttl, 'type': "lala", 'gender': 'Male' };

              dataaa.splice(indexx + 1, 0, currData);
              indexx=indexx+1;  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
          })});
      this.data = dataaa;
      this.index = indexx;
      console.log(this.data)
}
},
data() {
  let data = [
  ]
  let index=1;
  let fieldAreFull = false;
  return {
    data,
    index,
    fieldAreFull
  }

}
}
</script>
