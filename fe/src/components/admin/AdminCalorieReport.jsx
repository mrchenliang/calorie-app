import React from "react";
import moment from "moment";
import { Grid, Header, Segment } from "semantic-ui-react";

const lastWeekDateRange = `${moment().subtract(13, 'days').startOf('day').format('LL')} - ${moment().subtract(7, 'days').endOf('day').format('LL')}`;
const thisWeekDateRange = `${moment().subtract(6, 'days').startOf('day').format('LL')} - ${moment().endOf('day').format('LL')}`;

export const AdminCalorieReport = ({ report }) => {
  return (
    <Grid columns="equal">
      <Grid.Row>
      <Grid.Column>
          <Segment style={{textAlign: 'center'}}>
            <Header>Last Week</Header>
            <Header>{lastWeekDateRange}</Header>
            <Header size="huge">{report.lastWeekCalories?.length || 0}</Header>
          </Segment>
       </Grid.Column>
        <Grid.Column>
          <Segment style={{textAlign: 'center'}}>
            <Header>This Week</Header>
            <Header>{thisWeekDateRange}</Header>
            <Header size="huge">{report.thisWeekCalories?.length || 0}</Header>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
