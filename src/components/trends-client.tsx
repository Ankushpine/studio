'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { useApp } from './app-provider';
import type { Mood } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { subDays, format } from 'date-fns';

const chartConfig = {
  ecstatic: { label: 'Ecstatic', color: 'hsl(var(--chart-1))' },
  happy: { label: 'Happy', color: 'hsl(var(--chart-2))' },
  neutral: { label: 'Neutral', color: 'hsl(var(--chart-3))' },
  sad: { label: 'Sad', color: 'hsl(var(--chart-4))' },
  anxious: { label: 'Anxious', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

export function TrendsClient() {
  const { state } = useApp();

  const weeklyData = useMemo(() => {
    const data: { date: string; ecstatic: number; happy: number; neutral: number; sad: number; anxious: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const formattedDate = format(date, 'MMM d');
      const dayLogs = state.moodLogs.filter(
        (log) => new Date(log.date).toDateString() === date.toDateString()
      );
      
      const moodCounts = {
        ecstatic: 0,
        happy: 0,
        neutral: 0,
        sad: 0,
        anxious: 0,
      };

      if (dayLogs.length > 0) {
        // Use the mood from the first log of the day
        moodCounts[dayLogs[0].mood as Mood] = 1;
      }
      
      data.push({ date: formattedDate, ...moodCounts });
    }
    return data;
  }, [state.moodLogs]);

  const monthlyData = useMemo(() => {
    const moodCount: Record<Mood, number> = {
      ecstatic: 0,
      happy: 0,
      neutral: 0,
      sad: 0,
      anxious: 0,
    };
    const thirtyDaysAgo = subDays(new Date(), 30);
    state.moodLogs.forEach(log => {
      if(new Date(log.date) >= thirtyDaysAgo) {
        moodCount[log.mood]++;
      }
    });

    return Object.entries(moodCount).map(([mood, count]) => ({
      mood: mood.charAt(0).toUpperCase() + mood.slice(1),
      count,
      fill: `var(--color-${mood})`
    }));
  }, [state.moodLogs]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Mood Trends</CardTitle>
          <CardDescription>Visualize your emotional patterns over time.</CardDescription>
        </CardHeader>
      </Card>
      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Last 7 Days</TabsTrigger>
          <TabsTrigger value="monthly">Last 30 Days</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Weekly Mood Overview</CardTitle>
                    <CardDescription>Your primary mood logged each day for the past week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <BarChart accessibilityLayer data={weeklyData} margin={{ top: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            {Object.keys(chartConfig).map((mood) => (
                                <Bar 
                                    key={mood} 
                                    dataKey={mood} 
                                    stackId="a" 
                                    fill={`var(--color-${mood})`} 
                                    radius={[4, 4, 0, 0]}
                                >
                                  <LabelList dataKey={mood} formatter={(v: number) => v > 0 ? chartConfig[mood as Mood].label : null } position="top" offset={8} className="fill-foreground text-xs" />
                                </Bar>
                            ))}
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Monthly Mood Summary</CardTitle>
              <CardDescription>A summary of your moods over the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={monthlyData} layout="vertical" margin={{ left: 10 }}>
                  <YAxis
                    dataKey="mood"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <XAxis dataKey="count" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar dataKey="count" radius={5}>
                    <LabelList
                        dataKey="count"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                        formatter={(value: number) => (value > 0 ? `${value} days` : '')}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
