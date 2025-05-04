import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PhysiologicalData } from '../../models/physiological-data.model';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-simple-graph',
  templateUrl: './simple-graph.component.html',
  styleUrls: ['./simple-graph.component.scss'],
})
export class SimpleGraphComponent implements OnInit, AfterViewInit {
  @Input() data: PhysiologicalData[] = [];
  @Input() title: string = '';
  @Input() color: string = '#3880ff';
  @ViewChild('chartCanvas') chartCanvas: ElementRef | undefined;

  chart: Chart | undefined;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges() {
    // Only recreate the chart if we have the canvas and data
    if (this.chartCanvas && this.data && this.data.length > 0) {
      if (this.chart) {
        this.chart.destroy();
      }
      this.createChart();
    }
  }

  createChart() {
    if (!this.chartCanvas || !this.data || this.data.length === 0) {
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    // Sort data by timestamp
    const sortedData = [...this.data].sort((a, b) => a.timestamp - b.timestamp);

    // Extract values and labels
    const values = sortedData.map(item => item.value);
    const labels = sortedData.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: this.title,
          data: values,
          backgroundColor: this.color + '33', // Add transparency
          borderColor: this.color,
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              precision: 0
            }
          },
          x: {
            display: true,
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
  }
}
