import React from "react";
import { Table } from "semantic-ui-react";

export const AdminAverageCalorieReport = ({ entries }) => {

  const userCaloriesByDate = (() => {
    const usersData = [];

    Object.entries(entries).forEach(([userId, days]) => {
      Object.entries(days).forEach(([day, data]) => {
        usersData.push({
          userId,
          day,
          totalCalories: data.totalCalories,
          count: data.count,
          averageCalories: data.totalCalories / data.count,
        });
      });
    });

    return usersData;
  })();

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Date</Table.HeaderCell>
          <Table.HeaderCell>User ID</Table.HeaderCell>
          <Table.HeaderCell>Total calories consumed</Table.HeaderCell>
          <Table.HeaderCell>Total entries</Table.HeaderCell>
          <Table.HeaderCell>Average calories consumed</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {userCaloriesByDate.map((date, index) => (
          <Table.Row key={index}>
            <Table.Cell>{date.day}</Table.Cell>
            <Table.Cell>{date.userId}</Table.Cell>
            <Table.Cell>{date.totalCalories}</Table.Cell>
            <Table.Cell>{date.count}</Table.Cell>
            <Table.Cell>{date.averageCalories.toFixed(2)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
