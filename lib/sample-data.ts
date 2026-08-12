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
  combo: `Month,Revenue,Target
Jan,42000,45000
Feb,58000,50000
Mar,51000,55000
Apr,67000,60000
May,72000,65000
Jun,69000,70000`,
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
  scatter: `Segment,Spend,Conversions
Search,4200,320
Social,3100,210
Email,1800,260
Display,2600,140
Affiliate,1200,95`,
  radial: `Goal,Progress
Signups,72
Activation,54
Retention,38`,
}

export const chartTypeLabels: Record<ChartType, string> = {
  bar: "Bar Chart",
  line: "Line Chart",
  area: "Area Chart",
  combo: "Combo Chart",
  pie: "Pie / Donut Chart",
  radar: "Radar Chart",
  scatter: "Scatter Chart",
  radial: "Radial / Gauge Chart",
}

export const chartTypeDescriptions: Record<ChartType, string> = {
  bar: "Compare values across categories with grouped or stacked bars.",
  line: "Track trends over time with single or multi-series lines.",
  area: "Visualize volume and trends with single or stacked area fills.",
  combo: "Mix bars and lines in one chart, e.g. actuals vs. a target trend.",
  pie: "Show proportions of a whole as a pie or donut.",
  radar: "Compare multiple metrics across series on a spider chart.",
  scatter: "Plot two numeric dimensions against each other, grouped by category.",
  radial: "Show progress toward a goal per category as concentric rings.",
}

export const chartTypes: ChartType[] = [
  "bar",
  "line",
  "area",
  "combo",
  "pie",
  "radar",
  "scatter",
  "radial",
]
