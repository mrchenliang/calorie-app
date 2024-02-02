import React from "react";
import { Table, Button } from "semantic-ui-react";
import { format } from "date-fns";

export const FoodEntriesTable = ({ isAdmin, entries, onEditClick, onDelete }) => {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Created at</Table.HeaderCell>
          <Table.HeaderCell>Updated at</Table.HeaderCell>
          <Table.HeaderCell>Food</Table.HeaderCell>
          <Table.HeaderCell>Calories</Table.HeaderCell>
          <Table.HeaderCell>Consumed at</Table.HeaderCell>
          {isAdmin && (
            <>
              <Table.HeaderCell>User ID</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </>
          )}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {entries.map((entry, index) => (
          <Table.Row key={index}>
            <Table.Cell>{format(new Date(entry.createdAt), "PPpp")}</Table.Cell>
            <Table.Cell>{format(new Date(entry.updatedAt), "PPpp")}</Table.Cell>
            <Table.Cell>{entry.name}</Table.Cell>
            <Table.Cell>{entry.calories}</Table.Cell>
            <Table.Cell>
              {format(new Date(entry.time), "PPpp")}
            </Table.Cell>
            {isAdmin && (
              <>
                <Table.Cell>{entry.userId}</Table.Cell>
                <Table.Cell>
                  <Button size="small" color="teal" onClick={() => onEditClick(entry)}>
                    Update
                  </Button>
                  <Button size="small" color="red" onClick={() => onDelete(entry)}>
                    Delete
                  </Button>
                </Table.Cell>
              </>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
