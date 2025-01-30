import { Card, CardHeader, LinearProgress } from "@mui/material";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import ApiError from "../../components/ApiError";

import AnimatedBox from "../../components/AnimatedBox";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import BaseOptionChart from "../../components/chart/BaseOptionChart";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { fDate } from "../../utils/formatTime";
import AnalyticsDateRange from "./AnalyticsDateRange";

const Analytic = () => {
  const initializeData = {
    referral: [],
    team: [],
    categories: [],
  };

  const initialStartDate = subDays(startOfDay(new Date()), 6);
  const initialEndDate = endOfDay(new Date());

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const { data, isFetching, error } = trpc.analytics.joining.useQuery({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    offset: new Date().getTimezoneOffset(),
  });
  const result = data! ?? initializeData;
  const { referral, team, categories } = result;

  const baseOptions = BaseOptionChart();
  const options = {
    ...baseOptions,
    legend: {
      ...baseOptions.legend,
      position: "top" as const,
      horizontalAlign: "right" as const,
    },
    xaxis: {
      ...baseOptions.xaxis,
      categories: categories.map((category) => fDate(new Date(category))),
    },
  };
  const series = [
    {
      name: "My Referral",
      data: referral,
    },
    {
      name: "Team Referral",
      data: team,
    },
  ];

  if (error) return <ApiError error={error} />;

  return (
    <Page title="Analytics">
      <HeaderBreadcrumbs
        heading="Analytics"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Analytics" },
        ]}
      />
      <AnimatedBox>
        <Card>
          {isFetching && <LinearProgress />}
          <CardHeader
            title="Referrals Analytics"
            action={
              <AnalyticsDateRange
                initialStartDate={initialStartDate}
                initialEndDate={initialEndDate}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            }
          />
          <ReactApexChart
            type="area"
            series={series}
            options={options}
            height={364}
          />
        </Card>
      </AnimatedBox>
    </Page>
  );
};

export default Analytic;
