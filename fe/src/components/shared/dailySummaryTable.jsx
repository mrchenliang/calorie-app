import React from "react";
import { Table } from "semantic-ui-react";
import { format } from "date-fns";

export const DailySummaryTable = ({ dailySummaries, dailyLimit }) => {
  const entries = dailySummaries ? Object.entries(dailySummaries) : []
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Consumed at date</Table.HeaderCell>
          <Table.HeaderCell>Calorie limit</Table.HeaderCell>
          <Table.HeaderCell>Calorie amount</Table.HeaderCell>
          <Table.HeaderCell>Calorie limit exceeded</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {entries.map((entry, index) => {
          const calorieAmount = entry[1]
          const limitExceeded = calorieAmount > dailyLimit
          return (
            <Table.Row key={index}>
              <Table.Cell>{format(new Date(entry[0]), "PP")}</Table.Cell>
              <Table.Cell>{dailyLimit}</Table.Cell>
              <Table.Cell>{calorieAmount}</Table.Cell>
              <Table.Cell negative={limitExceeded} positive={!limitExceeded}>
                {limitExceeded ? "Yes" : "No"}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};
