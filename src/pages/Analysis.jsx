import React, { Component } from 'react';
import Highcharts from "highcharts";
import highcharts3d from 'highcharts/highcharts-3d';
import HighchartsReact from "highcharts-react-official";
import HC_exporting from 'highcharts/modules/exporting';
import Papa from 'papaparse';
import arquivo from '../data-files/TradeDataAnalysis.csv';

highcharts3d(Highcharts);
HC_exporting(Highcharts);

let options = {
    chart: {
      animation: false,
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45
      }
    },
    title: {
      text: 'Exports by Commodity'
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
        ['Bananas', 8],
        ['Kiwi', 3],
        ['Mixed nuts', 1],
        ['Oranges', 6],
        ['Apples', 8],
        ['Pears', 4],
        ['Clementines', 4],
        ['Reddish (bag)', 1],
        ['Grapes (bunch)', 1]
      ]
    }]
  }

class Analysis extends Component {
  constructor(props){
    super(props);
    this.state = {
      graphicOptions: options
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
    
    for(let row of rows) {
      
      if(row["Period Desc."] === "2017"  ) {
        if(!jsonData[jsonData["Commodity"]]) {   
          jsonData[row["Commodity"]] = Number(row["Trade Value (US$)"])
        } else {
          jsonData[row["Commodity"]] += Number(row["Trade Value (US$)"])
        }
      }
    }
    
    for(let key in jsonData) {
      graphicPizzadata.push([key, jsonData[key]])
    }
    return graphicPizzadata
  }

  componentDidMount(){
    this.GetData().then(res => {
      options.series[0].data = this.PutDataGraph(res);
      let newOptions = {...options}
        newOptions.series[0].data = this.PutDataGraph(res);
        this.setState({graphicOptions: newOptions});
      })
  }

  render(){
        return(
            
                <HighchartsReact
                highcharts={Highcharts}
                options={this.state.graphicOptions}
                />
            
        )
    }
}

export default Analysis