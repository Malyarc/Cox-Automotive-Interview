import React from "react";
import './App.css';
import axios from 'axios';
import Terminal from "./components/Terminal";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSetID: null,
      vehicleData: [],
      dealerData: [],
      response: null

    }

    this.getDataSetID = this.getDataSetID.bind(this);
    this.getVehicleID = this.getVehicleID.bind(this);
    this.getVehicleData = this.getVehicleData.bind(this);
    this.getDealerData = this.getDealerData.bind(this);
    this.createAndSubmitAnswer = this.createAndSubmitAnswer.bind(this);
    
  }


  componentDidMount() {
    this.getDataSetID()
  }

  getDataSetID() {
    axios
      .get('http://api.coxauto-interview.com/api/datasetId')
      .then((response) => {
        this.setState({
          dataSetID : response.data.datasetId
        });

        this.getVehicleID();
      })
      .catch((error) => {
        console.log(error);
      });
  }


  getVehicleID() {
    axios
      .get(`http://api.coxauto-interview.com/api/${this.state.dataSetID}/vehicles`)
      .then((response) => {
        this.setState({
          vehicleID: response.data.vehicleIds
        });
      
        this.getVehicleData(this.state.vehicleID);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getVehicleData(vehicleIDs) {
    let dealerIDs = [];

    Promise.all(
      vehicleIDs.map((id) => {
        return axios.get(`http://api.coxauto-interview.com/api/${this.state.dataSetID}/vehicles/${id}`)
      })
    )
      .then((response) => {
        for (let i = 0; i < response.length; i++) {
          let newVehicleList = this.state.vehicleData;
          newVehicleList.push(response[i].data)
          this.setState({
            vehicleData: newVehicleList
          })
          if (!dealerIDs.includes(response[i].data.dealerId)) {
            dealerIDs.push(response[i].data.dealerId)
          }
        }

        this.getDealerData(dealerIDs);

      })
      .catch((error) => {
        console.log(error);
      });

  }

  getDealerData(dealerIDs) {
    Promise.all(
      dealerIDs.map((id) => {
        return axios.get(`http://api.coxauto-interview.com/api/${this.state.dataSetID}/dealers/${id}`)
      })
    )
      .then((response) => {
        let dealerList = []
        for (let i = 0; i < response.length; i++) {
          dealerList.push(response[i].data)
        }
        this.setState({
          dealerData: dealerList
        })

        this.createAndSubmitAnswer();

      })
      .catch((error) => {
        console.log(error);
      });

  }


  createAndSubmitAnswer() {

    let answer = this.state.dealerData;
    for (let i = 0; i < answer.length; i++) {
      answer[i].vehicles = []
    }

    for (let i = 0; i < this.state.vehicleData.length; i++) {
      answer.find(dealer => dealer.dealerId === this.state.vehicleData[i].dealerId).vehicles.push({
        vehicleId: this.state.vehicleData[i].vehicleId,
        year: this.state.vehicleData[i].year,
        make: this.state.vehicleData[i].make,
        model: this.state.vehicleData[i].model
      })
    }


    axios
      .post(`http://api.coxauto-interview.com/api/${this.state.dataSetID}/answer`, { dealers: answer })
      .then((response) => {
        console.log(response.data)
        this.setState({
          response: response.data
        })

      })
      .catch((error) => {
        console.log(error);
      });
  }


  render() {


    return (
      <div className="App-header">
        <Terminal data={this.state.response} />
      </div>
    )
  }
}
export default App;
