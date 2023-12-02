import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { data } from '../../environments/environment.development';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit  {
  data: any;
  yOptions: string[] =[];
  selectedYOption: string = 'intensity';
  graphType: string[] = ['Bar Chart' , "Scatter Plot"];
  selectedGraphType: string = 'Bar Chart';
  svg:any;
  margin:any = { top: 20, right: 20, bottom: 30, left: 40 };
  width:any = 600 - this.margin.left - this.margin.right;
  height:any = 400 - this.margin.top - this.margin.bottom;

  ngOnInit() {
    this.data = data
    this.extractYOptions()
    this.createSvg()
  }

  ngAfterViewInit() {
    // this.createScatterPlot();
    this.createBarChart();
  }

  onYOptionChange() {
    switch(this.selectedGraphType){
      case "Bar Chart":
        this.createBarChart();
        break;
      case "Scatter Plot":
        this.createScatterPlot();
    }
  }  
  
  onGraphTypeChange() {
    switch(this.selectedGraphType){
      case "Bar Chart":
        this.createBarChart();
        break;
      case "Scatter Plot":
        this.createScatterPlot();
    }
  }

  private extractYOptions() {
    if (this.data.length > 0) {
      // Extract keys from the first data item as yOptions
      this.yOptions = Object.keys(this.data[0]);
      // Remove the keys that are not numeric (assuming these are your y-axis options)
      this.yOptions = this.yOptions.filter((key) => typeof this.data[0][key] === 'number');
    }
  }

  private createSvg() {

    this.svg = d3
      .select('#bar-chart')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }


  createScatterPlot() {

    // Clear the existing content of the x-axis and y-axis
    this.svg.selectAll('*').remove();

    const xScale:any = d3.scaleLinear().range([0, this.width]);
    const yScale:any = d3.scaleLinear().range([this.height, 0]);
    const sizeScale:any = d3.scaleLinear().range([5, 15]);

    xScale.domain([0, d3.max(this.data, (d:any) => d.intensity)]);
    yScale.domain([0, d3.max(this.data, (d:any) => d[this.selectedYOption])]);
    sizeScale.domain([0, 50]);

    this.svg.selectAll('circle')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('cx', (d:any) => xScale(d.intensity))
      .attr('cy', (d:any) => yScale(d[this.selectedYOption]))
      .attr('r', (d:any) => sizeScale(1))
      .attr('fill', 'blue');

    // Add axes
    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(xScale));
    this.svg.append('g').call(d3.axisLeft(yScale));

    // Add labels
    this.svg.append('text')
      .attr('transform', `translate(${this.width / 2},${this.height + this.margin.top + 10})`)
      .style('text-anchor', 'middle')
      .text('Sectors');

    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.selectedYOption);
  
    }

  createBarChart() {

    // Clear the existing content of the x-axis and y-axis
    this.svg.selectAll('*').remove();

    const xScale:any = d3.scaleBand().range([0, this.width]).padding(0.1);
    const yScale:any = d3.scaleLinear().range([this.height, 0]);

    xScale.domain(this.data.map((d:any) => d.sector));
    yScale.domain([0, d3.max(this.data, (d:any) => d[this.selectedYOption])]);

    this.svg.selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', (d:any) => xScale(d.sector))
      .attr('y', (d:any) => yScale(d[this.selectedYOption]))
      .attr('width', xScale.bandwidth())
      .attr('height', (d:any) => this.height - yScale(d[this.selectedYOption]))
      .attr('fill', 'steelblue');

    // Add axes
    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    this.svg.append('g').call(d3.axisLeft(yScale));

    // Add labels
    this.svg.append('text')
      .attr('transform', `translate(${this.width / 2},${this.height + this.margin.top + 40})`)
      .style('text-anchor', 'middle')
      .text('Sectors');

    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.selectedYOption);
  }
  
}
