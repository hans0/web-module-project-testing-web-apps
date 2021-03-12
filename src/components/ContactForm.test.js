import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';
import DisplayComponent from './DisplayComponent';

test('renders without errors', ()=>{
  render(<ContactForm />);
});

test('renders the contact form header', ()=> {
  render(<ContactForm />);
  const cfHeader = screen.getByText("Contact Form");
  expect(cfHeader).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText(/first name*/i);
  userEvent.type(firstNameInput, "Tst");
  const firstNameError = screen.getByText(/error: firstName must have at least 5 characters/i);
  expect(firstNameError).toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole('button');
  userEvent.click(submitButton);
  const firstNameError = screen.getByText(/error: firstName must have at least 5 characters/i);
  const lastNameError = screen.getByText(/error: lastName is a required field./i);
  const emailError = screen.getByText(/error: email must be a valid email address./i);
  expect(firstNameError).toBeInTheDocument();
  expect(lastNameError).toBeInTheDocument();
  expect(emailError).toBeInTheDocument();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText(/first name*/i);
  const lastNameInput = screen.getByLabelText(/last name*/i);
  const submitButton = screen.getByRole('button');
  userEvent.type(firstNameInput, 'Wally');
  userEvent.type(lastNameInput, 'Worldguy');
  userEvent.click(submitButton);
  const emailError = screen.getByText(/error: email must be a valid email address./i);
  expect(emailError).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, 'gibberishemail@');
  const emailError = screen.getByText(/error: email must be a valid email address./i);
  expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole('button');
  userEvent.click(submitButton);
  const lastNameError = screen.getByText(/error: lastName is a required field./i);
  expect(lastNameError).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm />);
  // w/o message
  const firstName = "Wally";
  const lastName = "Worldsen";
  const email = "wally@worldsen.com";
  const firstNameInput = screen.getByLabelText(/first name*/i);
  userEvent.type(firstNameInput, firstName);
  const lastNameInput = screen.getByLabelText(/last name*/i);
  userEvent.type(lastNameInput, lastName);
  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, email);
  const submitButton = screen.getByRole('button');
  userEvent.click(submitButton);
  const firstNameDisplay = screen.getByTestId(/firstNameDisplay/i);
  const lastNameDisplay = screen.getByTestId(/lastNameDisplay/i);
  const emailDisplay = screen.getByTestId(/emailDisplay/i);
  expect(firstNameDisplay).toHaveTextContent(firstName);
  expect(lastNameDisplay).toHaveTextContent(lastName);
  expect(emailDisplay).toHaveTextContent(email);
  const messageDisplay = screen.queryByTestId(/messageDisplay/i);
  expect(messageDisplay).not.toBeInTheDocument();

});

test('renders all fields text when all fields are submitted.', async () => {
    
});