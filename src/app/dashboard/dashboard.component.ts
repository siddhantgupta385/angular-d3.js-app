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
  yOptions: string[] = ['intensity', 'likelihood', 'relevance'];
  selectedYOption: string = 'intensity';

  ngOnInit() {
    // Load your data from a service or directly here
    this.data = data
  }

  ngAfterViewInit() {
    // this.createScatterPlot();
    this.createBarChart();
  }
  onYOptionChange() {
    this.createBarChart();
  }

  createScatterPlot() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select('#scatter-plot')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale:any = d3.scaleLinear().range([0, width]);
    const yScale:any = d3.scaleLinear().range([height, 0]);
    const sizeScale:any = d3.scaleLinear().range([5, 15]);

    xScale.domain([0, d3.max(this.data, (d:any) => d.intensity)]);
    yScale.domain([0, d3.max(this.data, (d:any) => d.likelihood)]);
    sizeScale.domain([0, d3.max(this.data, (d:any) => d.relevance)]);

    svg.selectAll('circle')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('cx', (d:any) => xScale(d.intensity))
      .attr('cy', (d:any) => yScale(d.likelihood))
      .attr('r', (d:any) => sizeScale(d.relevance))
      .attr('fill', 'blue');

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
    svg.append('g').call(d3.axisLeft(yScale));

    // Add labels
    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 10})`)
      .style('text-anchor', 'middle')
      .text('Intensity');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Likelihood');
  
    console.log(svg)
    }

  createBarChart() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select('#bar-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale:any = d3.scaleBand().range([0, width]).padding(0.1);
    const yScale:any = d3.scaleLinear().range([height, 0]);

    xScale.domain(this.data.map((d:any) => d.sector));
    yScale.domain([0, d3.max(this.data, (d:any) => d[this.selectedYOption])]);

    svg.selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', (d:any) => xScale(d.sector))
      .attr('y', (d:any) => yScale(d[this.selectedYOption]))
      .attr('width', xScale.bandwidth())
      .attr('height', (d:any) => height - yScale(d[this.selectedYOption]))
      .attr('fill', 'steelblue');

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g').call(d3.axisLeft(yScale));

    // Add labels
    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 40})`)
      .style('text-anchor', 'middle')
      .text('Sectors');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.selectedYOption);
  }
  
}
