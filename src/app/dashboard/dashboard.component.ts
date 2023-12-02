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
  filteredData: any;
  yOptions: string[] =[];
  selectedYOption: string = 'intensity';
  xOptions: string[] =[];
  selectedXOption: string = 'region';
  graphType: string[] = ['Bar Chart' , "Scatter Plot", "Pie Chart" , "Area Chart"];
  selectedGraphType: string = 'Bar Chart';
  svg:any;
  margin:any = { top: 20, right: 20, bottom: 30, left: 40 };
  width:any = 600 - this.margin.left - this.margin.right;
  height:any = 400 - this.margin.top - this.margin.bottom;

  // Filter variables
  endYearFilter: string | null = null;
  topicsFilter: string | null = null;
  sectorFilter: string | null = null;
  regionFilter: string | null = null;
  pestFilter: string | null = null;
  sourceFilter: string | null = null;
  swotFilter: string | null = null;

  // Dropdown options
  endYearOptions: string[] = [];
  topicsOptions: string[] = [];
  sectorOptions: string[] = [];
  regionOptions: string[] = [];
  pestOptions: string[] = [];
  sourceOptions: string[] = [];
  swotOptions: string[] = [];

  // FIX_ME Pie chart will have only one attribute 

  ngOnInit() {
    this.data = data
    this.filteredData = data
    this.updateDropdownOptions();
    this.extractYOptions()
    this.createSvg()
  }

  ngAfterViewInit() {
    // this.createScatterPlot();
    this.createBarChart();
  }

  applyFilters() {
    // Apply filters to the data based on selected filter values
    this.filteredData  = this.data.filter((item:any) => {
      return (
        (this.endYearFilter === null || item.end_year === this.endYearFilter) &&
        (this.topicsFilter === null || item.topic === this.topicsFilter) &&
        (this.sectorFilter === null || item.sector === this.sectorFilter) &&
        (this.regionFilter === null || item.region === this.regionFilter) &&
        (this.pestFilter === null || item.pestle === this.pestFilter) &&
        (this.sourceFilter === null || item.source === this.sourceFilter) &&
        (this.swotFilter === null || item.swot === this.swotFilter)
      );
    });
    // Update dropdown options based on selected filters
    this.updateDropdownOptions();

    this.createBarChart();
  }

  updateDropdownOptions() {
    this.endYearOptions = this.getUniqueValues('end_year');
    this.topicsOptions = this.getUniqueValues('topic');
    this.sectorOptions = this.getUniqueValues('sector');
    this.regionOptions = this.getUniqueValues('region');
    this.pestOptions = this.getUniqueValues('pestle');
    this.sourceOptions = this.getUniqueValues('source');
    this.swotOptions = this.getUniqueValues('swot');
  }


  getUniqueValues(key: string): string[] {
    let filteredData = this.data;

    if (this.endYearFilter) {
      filteredData = filteredData.filter((item:any) => item.end_year === this.endYearFilter);
    }
    if (this.topicsOptions) {
      filteredData = filteredData.filter((item:any) => item.end_year === this.topicsOptions);
    }
    if (this.sectorOptions) {
      filteredData = filteredData.filter((item:any) => item.end_year === this.sectorOptions);
    }
    if (this.regionOptions) {
      filteredData = filteredData.filter((item:any) => item.end_year === this.regionOptions);
    }
    if (this.pestOptions) {
      filteredData = filteredData.filter((item:any) => item.end_year === this.pestOptions);
    }
    if (this.sourceOptions) {
      filteredData = filteredData.filter((item:any) => item.end_year === this.sourceOptions);
    }
    if (this.swotOptions) {
      filteredData = filteredData.filter((item:any) => item.end_year === this.swotOptions);
    }
    
    // return Array.from(new Set(this.filteredData.map((item:any) => {if(item != "") item[key]})));
    return Array.from(new Set(this.filteredData.map((item:any) => item != "" && item[key])));
  }
  resetFilters() {
    this.endYearFilter = null;
    this.topicsFilter = null;
    this.sectorFilter = null;
    this.regionFilter = null;
    this.pestFilter = null;
    this.sourceFilter = null;
    this.swotFilter = null;

    this.applyFilters(); // Apply filters after resetting
  }

  onGraphTypeChange() {
    switch(this.selectedGraphType){
      case "Bar Chart":
        this.createBarChart();
        break;
      case "Scatter Plot":
        this.createScatterPlot();
        break;
      case "Pie Chart":
        this.createPieChart();
        break;
      case "Area Chart":
        this.createAreaChart();
        break;
        
    }
  }

  private extractYOptions() {
    if (this.filteredData.length > 0) {
      // Extract keys from the first data item as yOptions
      this.yOptions = Object.keys(this.filteredData[0]);
      this.xOptions = Object.keys(this.filteredData[0]);
      // Remove the keys that are not numeric (assuming these are your y-axis options)
      this.yOptions = this.yOptions.filter((key) => typeof this.filteredData[0][key] === 'number');
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

  createBarChart() {

    // Clear the existing content of the x-axis and y-axis
    this.svg.selectAll('*').remove();

    const xScale:any = d3.scaleBand().range([0, this.width]).padding(0.1);
    const yScale:any = d3.scaleLinear().range([this.height, 0]);

    xScale.domain(this.filteredData.map((d:any) => d[this.selectedXOption]));
    yScale.domain([0, d3.max(this.filteredData, (d:any) => d[this.selectedYOption])]);

    this.svg.selectAll('rect')
      .data(this.filteredData)
      .enter()
      .append('rect')
      .attr('x', (d:any) => xScale(d[this.selectedXOption]))
      .attr('y', (d:any) => yScale(d[this.selectedYOption]))
      .attr('width', xScale.bandwidth())
      .attr('height', (d:any) => this.height - yScale(d[this.selectedYOption]))
      .attr('fill', 'steelblue')
      .attr("class", "bar")
      .attr("title", (d: any) => d[this.selectedYOption]) 
      .on("mouseover", (event: any, d: any) => {
        // Show tooltip on hover
        const tooltip = d3.select("#tooltip");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`${d[this.selectedXOption]}: ${d[this.selectedYOption]}`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        // Hide tooltip on mouseout
        d3.select("#tooltip").transition().duration(500).style("opacity", 0);
      });

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
      .text(this.selectedXOption);
      
    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.selectedYOption);

  }

  createScatterPlot() {

    // Clear the existing content of the x-axis and y-axis
    this.svg.selectAll('*').remove();

    const xScale:any = d3.scaleLinear().range([0, this.width]);
    const yScale:any = d3.scaleLinear().range([this.height, 0]);
    const sizeScale:any = d3.scaleLinear().range([5, 15]);

    xScale.domain([0, d3.max(this.filteredData, (d:any) => d[this.selectedXOption])]);
    yScale.domain([0, d3.max(this.filteredData, (d:any) => d[this.selectedYOption])]);
    sizeScale.domain([0, 50]);

    this.svg.selectAll('circle')
      .data(this.filteredData)
      .enter()
      .append('circle')
      .attr('cx', (d:any) => xScale(d[this.selectedXOption]))
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
      .text(this.selectedXOption);

    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.selectedYOption);
  
  }
  
  createPieChart() {
    // Clear the existing content of the SVG
    this.svg.selectAll('*').remove();
  
    const radius = Math.min(this.width, this.height) / 2;
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
    const pie = d3.pie().value((d: any) => d[this.selectedYOption]);
  
    const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
  
    const arcs = this.svg
      .selectAll('arc')
      .data(pie(this.filteredData))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);
  
    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => colorScale(d.data.sector));
  
    // Optionally add labels to the pie chart
    arcs
      .append('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .text((d: any) => d.data.sector);
  }
  createAreaChart() {
    // Clear the existing content of the SVG
    this.svg.selectAll('*').remove();
  
    const xScale: any = d3.scaleLinear().range([0, this.width]);
    const yScale: any = d3.scaleLinear().range([this.height, 0]);
  
    xScale.domain(d3.extent(this.filteredData, (d: any) => d[this.selectedXOption]));
    yScale.domain([0, d3.max(this.filteredData, (d: any) => d[this.selectedYOption])]);
  
    const area = d3
      .area()
      .x((d: any) => xScale(d[this.selectedXOption]))
      .y0(this.height)
      .y1((d: any) => yScale(d[this.selectedYOption]));
  
    this.svg.append('path').datum(this.filteredData).attr('class', 'area').attr('d', area);
  
    // Add axes
    this.svg.append('g').attr('transform', `translate(0,${this.height})`).call(d3.axisBottom(xScale));
    this.svg.append('g').call(d3.axisLeft(yScale));
  
    // Add labels
    this.svg
      .append('text')
      .attr('transform', `translate(${this.width / 2},${this.height + this.margin.top + 10})`)
      .style('text-anchor', 'middle')
      .text(this.selectedYOption);
  
    this.svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.selectedXOption);
  }
  
}
