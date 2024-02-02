import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { isAfter, isBefore, format } from "date-fns";
import { Button, Container, Grid, GridColumn, Header, Segment } from "semantic-ui-react";
import { usePromise, DAILY_LIMIT } from "../../utils/index";
import { getFoodEntries } from "../../actions/shared/getFoodEntries";
import { DailySummaryTable } from "../../components/shared/dailySummaryTable.jsx";
import { FoodEntriesTable } from "../../components/shared/foodEntriesTable.jsx";
import { CreateFoodEntryModal } from "../../components/shared/createFoodEntryModal.jsx";
import { UpdateFoodEntryModal } from "../../components/admin/updateFoodEntryModal.jsx";
import { SendInvitationModel } from "../../components/user/sendInvitationModel.jsx";


const calculateDailySummaries = (foodEntries) => {
  const dailyCaloriesPerDay = foodEntries.reduce((acc, item) => {
    const date = format(new Date(item.time), "yyyy-MM-dd");
    
    if (!acc[date]) {
      acc[date] = 0;
    }

    acc[date] += item.calories;

    return acc;
  }, {});

  return dailyCaloriesPerDay;
};


function UserPage() {
  const [showCreateFoodEntryModal, setShowCreateFoodEntryModal] = useState(false);
  const [foodEntryIdToUpdate, setFoodEntryIdToUpdate] = useState();
  const [dailySummaries, setDailySummaries] = useState([]);
  const [showSendInviteModal, setShowSendInviteModal] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const { result: foodEntries, execute } = usePromise(async () => {
    const foodEntries = await getFoodEntries();
    setDailySummaries(calculateDailySummaries(foodEntries));
    return foodEntries;
  }, []);

  const dailyLimit = DAILY_LIMIT;

  const foodEntryToUpdate = foodEntries?.find(
    (foodEntry) => foodEntry.id === foodEntryIdToUpdate
  );

  return (
    <>
      {showCreateFoodEntryModal && (
        <CreateFoodEntryModal
          onClose={() => setShowCreateFoodEntryModal(false)}
          onFoodEntryCreated={() => {
            execute();
            setShowCreateFoodEntryModal(false);
          }}
        />
      )}
      {foodEntryIdToUpdate && foodEntryToUpdate && (
        <UpdateFoodEntryModal
        onClose={() => {
          setFoodEntryIdToUpdate(undefined);
        }}
        foodEntry={foodEntryToUpdate}
        onFoodEntryUpdated={() => {
          execute();
        }}
        />
      )}
      {showSendInviteModal && (
        <SendInvitationModel
          onClose={() => setShowSendInviteModal(false)}
          onInvitationSent={() => {
            execute();
            setShowSendInviteModal(false);
          }}
        />
      )}
      <Container style={{ marginTop: 30, padding: 20 }}>
        <Grid columns={2}>
          <Grid.Column verticalAlign="middle" stretched>
            <Header size="huge">Food entries</Header>
          </Grid.Column>
          <GridColumn verticalAlign="middle" floated='right'>

            <Grid rows={2}
              style={{
                justifyContent: "flex-end",
              }}>
              <Grid.Row textAlign="right" verticalAlign="right">
                <Button primary onClick={() => setShowCreateFoodEntryModal(true)}>
                  Create food entry
                </Button>
              </Grid.Row>
              <Grid.Row textAlign="right" verticalAlign="right">
                <Button primary onClick={() => setShowSendInviteModal(true)}>
                  Invite friends
                </Button>
              </Grid.Row>
            </Grid>
          </GridColumn>
        </Grid>

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
          onEditClick={(foodEntryId) => {
            setFoodEntryIdToUpdate(foodEntryId);
          }}
        />

        <Grid columns={2}>
          <Grid.Column verticalAlign="middle">
            <Header>Daily summaries</Header>
          </Grid.Column>
        </Grid>
        <p>
          Daily calorie limit: <b>{dailyLimit}</b>
        </p>
        <DailySummaryTable dailySummaries={dailySummaries} dailyLimit={dailyLimit} />
      </Container>
    </>
  );
};

export default UserPage;
