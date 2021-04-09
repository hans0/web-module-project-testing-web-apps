import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

const firstNameErrorText = /firstname must have at least 5 characters/i;
const lastNameErrorText = /lastname is a required field/i;
const emailErrorText = /email must be a valid email address/i;

const firstNameValidText = 'Stephen';
const lastNameValidText = 'King';
const emailValidText = 'stephen.king@tourism.maine.gov';
const emailInvalidText = 'stephen.king@';
const messageValidText = `The joke is I'm a horror author, yet I work for the tourism board`

test('renders without errors', ()=>{
  render(<ContactForm />);
});

test('renders the contact form header', ()=> {
  render(<ContactForm />);
  const contactFormHeader = screen.getByText(/contact form/i);
  expect(contactFormHeader).toBeInTheDocument();
  expect(contactFormHeader).toBeTruthy();
  expect(contactFormHeader).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByPlaceholderText(/edd/i);
  userEvent.type(firstNameInput, 'test');
  const minFiveCharacterError = await screen.findByText(firstNameErrorText);
  expect(minFiveCharacterError).toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByPlaceholderText(/edd/i);
  const lastNameInput = screen.getByPlaceholderText(/burke/i);
  const emailInput = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i);
  userEvent.type(firstNameInput, "");
  userEvent.type(lastNameInput, "");
  userEvent.type(emailInput, "");
  const submitButton = screen.getByRole('button');
  userEvent.click(submitButton);
  const firstNameError = await screen.findByText(firstNameErrorText);
  expect(firstNameError).toBeInTheDocument();
  const lastNameError = await screen.findByText(lastNameErrorText);
  expect(lastNameError).toBeInTheDocument();
  const emailError = await screen.findByText(emailErrorText);
  expect(emailError).toBeInTheDocument();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByPlaceholderText(/edd/i);
  const lastNameInput = screen.getByPlaceholderText(/burke/i);
  userEvent.type(firstNameInput, firstNameValidText);
  userEvent.type(lastNameInput, lastNameValidText);
  const submitButton = screen.getByRole('button');
  userEvent.click(submitButton);
  const emailError = await screen.findByText(emailErrorText);
  expect(emailError).toBeInTheDocument();
  const firstNameError =  screen.queryByText(firstNameErrorText);
  expect(firstNameError).toBeFalsy();
  const lastNameError = screen.queryByText(lastNameErrorText);
  expect(lastNameError).not.toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailInput = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i);
  userEvent.type(emailInput, emailInvalidText);
  const emailError = await screen.findByText(emailErrorText);
  expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByPlaceholderText(/edd/i);
  const lastNameInput = screen.getByPlaceholderText(/burke/i);
  const emailInput = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i);
  userEvent.type(firstNameInput, firstNameValidText);
  userEvent.type(lastNameInput, "");
  userEvent.type(emailInput, emailValidText);
  const submitButton = screen.getByRole('button');
  userEvent.click(submitButton);
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByPlaceholderText(/edd/i);
  const lastNameInput = screen.getByPlaceholderText(/burke/i);
  const emailInput = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i);
  userEvent.type(firstNameInput, firstNameValidText);
  userEvent.type(lastNameInput, lastNameValidText);
  userEvent.type(emailInput, emailValidText);
  const submitButton = screen.getByRole('button');
  userEvent.click(submitButton);
  const firstNameSubmission = await screen.getByTestId('firstnameDisplay');
  const lastNameSubmission = await screen.getByTestId('lastnameDisplay')
  const emailSubmission = await screen.getByTestId('emailDisplay');
  expect(firstNameSubmission).toBeInTheDocument();
  expect(lastNameSubmission).toBeInTheDocument();
  expect(emailSubmission).toBeInTheDocument();
  const messageSubmission = screen.queryByTestId('messageDisplay');
  expect(messageSubmission).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByPlaceholderText(/edd/i);
  const lastNameInput = screen.getByPlaceholderText(/burke/i);
  const emailInput = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i);
  const messageInput = screen.getByLabelText(/message/i);
  userEvent.type(firstNameInput, firstNameValidText);
  userEvent.type(lastNameInput, lastNameValidText);
  userEvent.type(emailInput, emailValidText);
  userEvent.type(messageInput, messageValidText);
  const submitButton = screen.getByRole('button');
  userEvent.click(submitButton);
  const firstNameSubmission = await screen.getByTestId('firstnameDisplay');
  const lastNameSubmission = await screen.getByTestId('lastnameDisplay')
  const emailSubmission = await screen.getByTestId('emailDisplay');
  expect(firstNameSubmission).toHaveTextContent(firstNameValidText);
  expect(lastNameSubmission).toHaveTextContent(lastNameValidText);
  expect(emailSubmission).toHaveTextContent(emailValidText);
  const messageSubmission = screen.queryByTestId('messageDisplay');
  expect(messageSubmission).toHaveTextContent(messageValidText);
});