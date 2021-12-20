
class ActionHistory {
  constructor() {
      this.data = {};
      this.test = "tessitng";
  }
  async getLatest() {
    // return {"id":1147,"data":"{\"temperature\":75.38,\"moisture\":62,\"light\":130,\"battery\":38}","date":"2021-09-14T23:01:09.241Z","isActive":true};

    const sensorRESTEndpointDomain = `hydroponode.link:3000`;
    const sensorRESTEndpoint = `https://${sensorRESTEndpointDomain}/action-history`;
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
    this.data = await this.getLatest();
    console.log('action history: ', this.data);
    await this.renderActionHistory();
    console.log("Finished calling renderActionHistory");
  }

  async renderActionHistory() {

    const container = document.getElementById('container');
    const newTable = document.createElement('table');
    container.appendChild(newTable);

    this.data.forEach((item) => {
      const newRow = document.createElement('tr');
      const newTdDate = document.createElement('td');
      const newTdSystem = document.createElement('td');
      const newTdAction = document.createElement('td');
      const newTdMessage = document.createElement('td');
      newTdDate.innerHTML = new Date(item.date).toLocaleString(undefined, {
        timeStyle: "short",
        dateStyle: "short"
      });
      newTdSystem.innerHTML = item.system;
      newTdAction.innerHTML = item.action;
      newTdMessage.innerHTML = item.message;
      newRow.appendChild(newTdDate);
      newRow.appendChild(newTdSystem);
      newRow.appendChild(newTdAction);
      newRow.appendChild(newTdMessage);
      container.appendChild(newRow);
   });
    
  }
  hide() {
    const container = document.getElementById('container')
    container.style.display = 'none';
  }
  show() {
    const container = document.getElementById('container')
    container.style.display = 'block';
  }
  toggle() {
    const container = document.getElementById('container')
    if (container.style.display == 'block') {
      this.hide();
    } else {
      this.show();
    }
  }
}


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
    datestamp.innerHTML = new Date(this.datestamp).toLocaleString(undefined, {
  timeStyle: "short",
  dateStyle: "short"
});
    temperature.innerHTML = Math.round(this.temperature);
    moisture.innerHTML = this.moisture;
    light.innerHTML = this.light;

    return true;
  }

}

const billboard = new Billboard();
const actionHistory = new ActionHistory();
const autoUpdate = () => { setTimeout(()=>{actionHistory.update(); billboard.update(); autoUpdate()}, 3000) }
actionHistory.update();
billboard.update();
document.querySelector('.toggleActionHistory').addEventListener('click', () => actionHistory.toggle());
