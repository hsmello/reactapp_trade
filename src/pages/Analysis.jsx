import React, { Component } from 'react';
import Highcharts from "highcharts";
import highcharts3d from 'highcharts/highcharts-3d';
import HighchartsReact from "highcharts-react-official";
import HC_exporting from 'highcharts/modules/exporting';
import Papa from 'papaparse';
import arquivo from '../data-files/TradeDataAnalysis.csv';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

highcharts3d(Highcharts);
HC_exporting(Highcharts);

let options = {
    chart: {
      width: 1200,
      animation: true,
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45
      }
    },
    title: {
      text: "United Kingdom International Trade"
    },
    // subtitle: {
    //   text: '3D donut in Highcharts'
    // },
    plotOptions: {
      pie: {
        innerSize: 100,
        depth: 45
      }
    },
    series: [{
      name: 'Delivered amount',
      data: [
        
      ]
    }]
  }

const yearOptions = [
  {label: '2014', value: '2014'},
  {label: '2015', value: '2015'},
  {label: '2016', value: '2016'},
  {label: '2017', value: '2017'}
]

const tradeFlowOptions = [
  {label: 'Export', value: 'Export'},
  {label: 'Import', value: 'Import'}
]

const tradePartnerOptions = [
  {label: 'China', value: 'China'},
  {label: 'France', value: 'France'},
  {label: 'Germany', value: 'Germany'},
  {label: 'India', value: 'India'}
]

class Analysis extends Component {
  constructor(props){
    super(props);
    this.state = {
      graphicOptions: options,
      yearSelected: "2017",
      tradeFlowSelected: "Export",
      partnerSelected: "France",
      fileRows: [],
      showGraph: true
    }
  }
  
  GetData = async () => {
    const response = await fetch(arquivo)
    const reader = response.body.getReader()
    const result = await reader.read() // raw array
    const decoder = new TextDecoder('utf-8')
    const csv = decoder.decode(result.value) // the csv text
    const results = Papa.parse(csv, { header: true }) // object with { data, errors, meta }
    const rows = results.data // array of objects
    return rows
  }

  PutDataGraph(rows) {
    let graphicPizzadata = []
    let jsonData = {}
    let jsonDataOrdered = {};
    let jsonDataResumed = {};
    let sumTotal = 0;

    for(let row of rows) {
      
      if(row["Period Desc."] === this.state.yearSelected
          && row["Trade Flow"] === this.state.tradeFlowSelected
          && row["Partner"] === this.state.partnerSelected  ) {
            
        if(!jsonData[row["Commodity"]]) {   
          jsonData[row["Commodity"]] = Number(row["Trade Value (US$)"])
        } else {
          jsonData[row["Commodity"]] += Number(row["Trade Value (US$)"])
        }
      }
    }
    
    //ORDER JSON DATA
    let jsonDataKeysOrdered = Object.keys(jsonData).sort(function(a, b) {
      return jsonData[a] > jsonData[b] ? -1 : 1
    })
    for(let jsonDataKey of jsonDataKeysOrdered) {
        jsonDataOrdered[jsonDataKey] = jsonData[jsonDataKey];
        sumTotal += jsonDataOrdered[jsonDataKey];
    }

    if(sumTotal === 0) {
      return []
    }

    //CALCULATE THE OTHERS IN GRAPH
    jsonDataResumed['Others'] = 0;
    let sumTotal20PercentValue = sumTotal*0.2;
    for(let i = jsonDataKeysOrdered.length - 1 ; i >= 0 ; i--) {
      if(jsonDataResumed['Others'] < sumTotal20PercentValue) {
        jsonDataResumed['Others'] += jsonDataOrdered[jsonDataKeysOrdered[i]];
      }else{
        jsonDataResumed[jsonDataKeysOrdered[i]] = jsonDataOrdered[jsonDataKeysOrdered[i]]
      }
    }

    //ORDER JSON DATA RESUMED
    jsonDataOrdered = {};
    jsonDataKeysOrdered = Object.keys(jsonDataResumed).sort(function(a, b) {
      return jsonDataResumed[a] > jsonDataResumed[b] ? -1 : 1
    })
    for(let jsonDataKey of jsonDataKeysOrdered) {
        jsonDataOrdered[jsonDataKey] = jsonDataResumed[jsonDataKey];
    }

    //PUT OTHERS AS LAST ELEMENT IN JSON
    let othersValue = jsonDataOrdered['Others'];
    delete jsonDataOrdered['Others'];
    jsonDataOrdered['Others'] = othersValue

    //PUT DATA IN GRAPH
    for(let key in jsonDataOrdered) {
      graphicPizzadata.push([key, jsonDataOrdered[key]])
    }
    return graphicPizzadata
  }

  componentDidMount(){
    this.GetData().then(res => {
      this.state.rows = res;      
    })
  }

  onSelectYear(ev) {
    this.setState({...this.state, yearSelected: ev.yearSelected})
  }

  onSelectTradeFlow(ev) {
    this.setState({...this.state, tradeFlowSelected: ev.tradeFlowSelected})
  }

  onSelectPartner(ev) {
    this.setState({...this.state, partnerSelected: ev.partnerSelected})
  }

  refreshGraph(graphicOptions) {
    this.setState({...this.state, showGraph: false, graphicOptions: graphicOptions});
    setTimeout(() => {
      this.setState({...this.state, showGraph: true})
    },0)
  }

  executeFilter() {
    let newOptions = {...options}
    newOptions.series[0].data = this.PutDataGraph(this.state.rows);
    this.refreshGraph(newOptions)
  }

  render(){

    const {graphicOptions, showGraph} = this.state;
        return(
            <div>
              <div className="filters-wrapper" >

              <div className="p-grid">
                  <div className="p-col">
                    <div>
                      <Dropdown value={this.state.yearSelected} 
                        options={yearOptions} 
                        onChange={(e) => {this.onSelectYear({yearSelected: e.value})}} 
                        placeholder="Select a Year"/>
                    </div>
                  </div>

                  <div className="p-col">
                    <div>
                      <Dropdown value={this.state.tradeFlowSelected} 
                        options={tradeFlowOptions} 
                        onChange={(e) => {this.onSelectTradeFlow({tradeFlowSelected: e.value})}} 
                        placeholder="Select a trade flow"/>
                    </div>
                  </div>

                  <div className="p-col">
                    <div>
                      <Dropdown value={this.state.partnerSelected} 
                        options={tradePartnerOptions} 
                        onChange={(e) => {this.onSelectPartner({partnerSelected: e.value})}} 
                        placeholder="Select a Partner"/>
                    </div>
                  </div>

                  <div className="p-col">
                    <Button onClick={() => { this.executeFilter() }}
                      label="Filter" className="p-button-raised p-button-rounded"
                      icon="pi pi-search" iconPos="left" />
                  </div>

              </div>

              </div>
  
              <div className="graph-wrapper" >
                { showGraph ?  
                  (<HighchartsReact
                    highcharts={Highcharts}
                    options={graphicOptions}
                    />
                    ):<></>}
                  
              </div>
            </div>
            
        )
    }
}

export default Analysis