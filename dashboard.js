
class Billboard {
  constructor() {
  }
  async getLatest() {
    // return {"id":1147,"data":"{\"temperature\":75.38,\"moisture\":62,\"light\":130,\"battery\":38}","date":"2021-09-14T23:01:09.241Z","isActive":true};

    const sensorRESTEndpointDomain = `hydroponode.link:3000`;
    const sensorRESTEndpoint = `https://${sensorRESTEndpointDomain}/sensor-data`;
    console.log("Making request to endpoint: ", sensorRESTEndpoint)
    const lastResult = await fetch(sensorRESTEndpoint)
    const responseJson = await lastResult.json();
    console.log("api returned: ", responseJson);
    return responseJson;
  }
  
  parse(str) {
    return JSON.parse(str)
  }

  async update() {
    const jsonResp = await this.getLatest();
    const lastResult = jsonResp;
    console.log(lastResult);
    const sensorDataObj = JSON.parse(lastResult.data);
    this.battery = sensorDataObj.battery+'%';
    this.datestamp = lastResult.date;
    this.temperature = sensorDataObj.temperature;
    this.moisture = sensorDataObj.moisture;
    this.light = sensorDataObj.light;
    return await this.updateBillboard()
  }

  async updateBillboard() {
    const battery = document.getElementById('battery').querySelector('.innerValue');
    const datestamp = document.getElementById('datestamp').querySelector('.innerValue');
    const temperature = document.getElementById('temperature').querySelector('.innerValue');
    const moisture = document.getElementById('moisture').querySelector('.innerValue');
    const light = document.getElementById('light').querySelector('.innerValue');

    battery.innerHTML = this.battery
    datestamp.innerHTML = new Date(this.datestamp).toLocaleString();
    temperature.innerHTML = this.temperature;
    moisture.innerHTML = this.moisture;
    light.innerHTML = this.light;

    return true;
  }

}

const billboard = new Billboard();
const autoUpdate = () => { setTimeout(()=>{billboard.update(); autoUpdate()}, 3000) }
billboard.update();
