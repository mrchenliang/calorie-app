import React, { useState } from "react";
import { Modal, Form, Message } from "semantic-ui-react";
import { usePromiseLazy } from "../../utils/index";
import { updateFoodEntry } from "../../actions/admin/updateFoodEntry";

export const UpdateFoodEntryModal = ({
  onClose,
  onFoodEntryUpdated,
  foodEntry,
}) => {
  const [name, setName] = useState(foodEntry.name);
  const [calories, setCalories] = useState(foodEntry.calories);
  const [consumedAt, setConsumedAt] = useState(foodEntry.time);

  const {
    execute: wrappedUpdateFoodEntry,
    error,
    isLoading,
  } = usePromiseLazy(async () => {
    return updateFoodEntry({
      id: foodEntry._id,
      name,
      calories,
      consumedAt,
    });
  }, []);

  const handleSubmit = async () => {
    const { result: foodEntry } = await wrappedUpdateFoodEntry();

    if (foodEntry && onFoodEntryUpdated) {
      await onFoodEntryUpdated(foodEntry);
    }
  };

  return (
    <Modal closeIcon size="small" onClose={() => onClose(false)} open>
      <Modal.Header>Update food entry</Modal.Header>
      <Modal.Content>
        {error && (
          <Message color="red">
            Failed to update food entry. {JSON.stringify(error)}
          </Message>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Input
            label="Food"
            placeholder="Banana"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <Form.Input
            label="Calories"
            placeholder="100"
            onChange={(e) => setCalories(e.target.value)}
            value={calories}
          />
          <Form.Input
            label="Consumed at"
            placeholder="2021/08/21"
            onChange={(e) => setConsumedAt(e.target.value)}
            value={consumedAt}
          />
          <Form.Button primary type="submit" loading={isLoading}>
            Update food entry
          </Form.Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};
