import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { isAfter, isBefore } from "date-fns";
import { Button, Container, Grid, Header, Segment } from "semantic-ui-react";
import { usePromise, usePromiseLazy } from "../../utils/index";
import { getAdminCalorieReport } from "../../actions/admin/getAdminCalorieReport.js";
import { getFoodEntries } from "../../actions/shared/getFoodEntries";
import { deleteFoodEntry } from "../../actions/admin/deleteFoodEntry.js";
import { FoodEntriesTable } from "../../components/shared/foodEntriesTable.jsx";
import { AdminCalorieReport } from "../../components/admin/AdminCalorieReport.jsx";
import { AdminAverageCalorieReport } from "../../components/admin/AdminAverageCalorieReport.jsx";
import { CreateFoodEntryModal } from "../../components/shared/createFoodEntryModal.jsx";
import { UpdateFoodEntryModal } from "../../components/admin/updateFoodEntryModal.jsx";

const calculateUserCalories = (entries) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const filteredEntries = entries.filter(entry => new Date(entry.time) >= sevenDaysAgo);

  const userCalories = filteredEntries.reduce((acc, entry) => {
      const day = entry.time.split('T')[0]; // Extracting just the date part
      const userId = entry.userId;

      if (!acc[userId]) {
          acc[userId] = {};
      }
      if (!acc[userId][day]) {
          acc[userId][day] = { totalCalories: 0, count: 0 };
      }

      acc[userId][day].totalCalories += entry.calories;
      acc[userId][day].count += 1;
      return acc;
  }, {});

  return userCalories;
};


function AdminPage(props)  {
  const [showCreateFoodEntryModal, setShowCreateFoodEntryModal] = useState(false);
  const [foodEntryToUpdate, setFoodEntryToUpdate] = useState();
  const [userCalories, setUserCalories] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const { result: foodEntries, execute } = usePromise(async () => {
    const foodEntries = await getFoodEntries();
    setUserCalories(calculateUserCalories(foodEntries));
    return foodEntries;
  }, []);

  const { result: report } = usePromise(async () => {
    const report = await getAdminCalorieReport();
    return report;
  }, []);

  const { execute: wrappedDeleteFoodEntry } = usePromiseLazy(
    async (entry) => {
      await deleteFoodEntry(entry._id);
      await execute();
    },
    []
  );

  return (
    <Container style={{padding: 20}}>
      {showCreateFoodEntryModal && (
        <CreateFoodEntryModal
          onClose={() => setShowCreateFoodEntryModal(false)}
          onFoodEntryCreated={() => {
            execute();
            setShowCreateFoodEntryModal(false);
          }}
        />
      )}
      {foodEntryToUpdate && (
        <UpdateFoodEntryModal
          onClose={() => setFoodEntryToUpdate(undefined)}
          foodEntry={foodEntryToUpdate}
          onFoodEntryUpdated={async () => {
            await execute();
            setFoodEntryToUpdate(undefined);
          }}
        />
      )}
      <Grid columns={2} style={{ paddingTop: 20 }}>
        <Grid.Column verticalAlign="middle">
          <Header size="huge">Admin dashboard</Header>
        </Grid.Column>
      </Grid>

      <Header>Food entries added per date:</Header>
      <AdminCalorieReport report={report || []} />

      <Header>Average calories over the last 7 days:</Header>
      {userCalories && (
        <AdminAverageCalorieReport
          entries={userCalories || []}
        />
      )}
      <Button
        floated="right"
        primary
        onClick={() => setShowCreateFoodEntryModal(true)}
      >
        Create food entry
      </Button>
      <Header>All food entries:</Header>
      <Header>Filter by consumed at date:</Header>
        <Segment
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            From{" "}
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />{" "}
          </div>
          <div>
            to{" "}
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
            />{" "}
          </div>
          <div>
            <Button
              onClick={() => {
                setEndDate(undefined);
                setStartDate(undefined);
              }}
            >
              Clear filters
            </Button>
          </div>
        </Segment>
      <FoodEntriesTable
        isAdmin
        entries={(foodEntries || [])
          .filter((entry) => {
            return startDate
              ? isAfter(new Date(entry.time), new Date(startDate))
              : true;
          })
          .filter((entry) => {
            return endDate
              ? isBefore(new Date(entry.time), new Date(endDate))
              : true;
          })}
        onDelete={(entry) => {
          wrappedDeleteFoodEntry(entry);
        }}
        onEditClick={(entry) => {
          setFoodEntryToUpdate(entry);
        }}
      />
    </Container>
  );
};

export default AdminPage;
