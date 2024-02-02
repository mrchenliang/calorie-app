import React, { useState, useEffect } from "react";
import { Modal, Form, Dropdown, Message } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import { usePromiseLazy } from "../../utils/index";
import { createFoodEntry } from "../../actions/shared/createFoodEntry";
import { getFoodSearch } from "../../actions/shared/getFoodSearch";

export const CreateFoodEntryModal = ({ onClose, onFoodEntryCreated }) => {
  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState(input);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [name, setName] = useState();
  const [calories, setCalories] = useState();
  const [consumedAt, setConsumedAt] = useState(new Date());
  const [isNameErrored, setIsNameErrored] = useState(false);
  const [isCaloriesErrored, setIsCaloriesErrored] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [input]); 

  useEffect(() => {
    const fetchFoodSuggestions = async () => {
      if (debouncedInput.length > 2) {
        try {
          const data = await getFoodSearch(debouncedInput);
          const formattedSuggestions = data.map(item => ({
            key: item.food_name,
            value: item.food_name,
            text: item.food_name,
            calories: item.nf_calories
          }));
          setSuggestions(formattedSuggestions);
        } catch (error) {
          console.error("Failed to fetch food suggestions:", error);
        }
      }
    };
    fetchFoodSuggestions();
  }, [debouncedInput]);

  const {
    execute: wrappedCreateFoodEntry,
    error,
    isLoading,
  } = usePromiseLazy(async () => {
    const foodEntry = await createFoodEntry({
      name,
      calories,
      consumedAt,
    });

    return foodEntry;
  }, []);

  const handleSubmit = async () => {
    const nameErrored = name === undefined || name === "";
    if (nameErrored) setIsNameErrored(true);

    const numCalories = Number.parseInt(calories);
    const caloriesErrored = calories === undefined || numCalories <= 0;
    if (caloriesErrored) setIsCaloriesErrored(true);

    if (!caloriesErrored && !nameErrored) {
      const { result: foodEntry } = await wrappedCreateFoodEntry();

      if (foodEntry && onFoodEntryCreated) {
        await onFoodEntryCreated(foodEntry);
      }
    }
  };

  const handleDropdownChange = (e, { value }) => {
    const foodItem = suggestions.find(item => item.value === value);
    setInput(value);
    setSelectedFood(value);
    if (foodItem) {
      setName(foodItem.value);
      setCalories(foodItem.calories);
    }
  };

  return (
    <Modal closeIcon size="small" onClose={() => onClose(false)} open>
      <Modal.Header>New food entry</Modal.Header>
      <Modal.Content>
        {error && (
          <Message color="red">
            Failed to create food entry. {JSON.stringify(error)}
          </Message>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Field >
            <label>Search for food</label>
            <Dropdown
              label="Food Search"
              fluid
              search
              selection
              options={suggestions}
              placeholder="Search food item"
              onChange={handleDropdownChange}
              onSearchChange={(e, { searchQuery }) => setInput(searchQuery)}
              value={selectedFood}
            />
          </Form.Field>
          <Form.Input
            label="Food"
            placeholder="Food Item"
            value={name}
            onChange={(e) => {
              setIsNameErrored(false);
              setName(e.target.value);
            }}
            error={
              isNameErrored && {
                content: "Please enter a valid food name",
                pointing: "below",
              }
            }
          />
          <Form.Input
            label="Calories"
            placeholder="Calorie Number"
            type="number"
            value={calories}
            onChange={(e) => {
              setIsCaloriesErrored(false);
              setCalories(e.target.value);
            }}
            error={
              isCaloriesErrored && {
                content: "Please enter a calorie amount",
                pointing: "below",
              }
            }
          />
          <p style={{ fontSize: 13, marginBottom: 4, fontWeight: 700 }}>
            Consumed at
          </p>
          <div style={{ width: "100%", marginBottom: 20 }}>
            <DatePicker
              className={{ width: "100%", marginBottom: 20 }}
              selected={consumedAt}
              onChange={(date) => setConsumedAt(date)}
              showTimeSelect
              dateFormat="Pp"
            />
          </div>
          <Form.Button primary type="submit" loading={isLoading}>
            Create food entry
          </Form.Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};
