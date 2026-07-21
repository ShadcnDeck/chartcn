import type { ChartType } from "@/types/chart"

export const sampleCSV: Record<ChartType, string> = {
  bar: `Month,Revenue,Expenses
Jan,42000,31000
Feb,58000,34000
Mar,51000,29000
Apr,67000,38000
May,72000,41000
Jun,69000,37000`,
  line: `Week,Users,Sessions
Week 1,1200,3400
Week 2,1450,4100
Week 3,1380,3900
Week 4,1620,4700
Week 5,1890,5200`,
  area: `Quarter,Product A,Product B,Product C
Q1,12000,8000,5000
Q2,15000,9500,6200
Q3,18000,11000,7800
Q4,22000,13500,9100`,
  pie: `Category,Value
Engineering,45
Design,20
Marketing,18
Operations,12
Other,5`,
  radar: `Skill,Junior,Senior
Problem Solving,60,90
Communication,70,85
Technical Depth,50,95
Teamwork,80,88
Leadership,40,82`,
}

export const chartTypeLabels: Record<ChartType, string> = {
  bar: "Bar Chart",
  line: "Line Chart",
  area: "Area Chart",
  pie: "Pie / Donut Chart",
  radar: "Radar Chart",
}

export const chartTypeDescriptions: Record<ChartType, string> = {
  bar: "Compare values across categories with grouped or stacked bars.",
  line: "Track trends over time with single or multi-series lines.",
  area: "Visualize volume and trends with single or stacked area fills.",
  pie: "Show proportions of a whole as a pie or donut.",
  radar: "Compare multiple metrics across series on a spider chart.",
}

export const chartTypes: ChartType[] = ["bar", "line", "area", "pie", "radar"]
