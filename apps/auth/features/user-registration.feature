Feature: User Registration
  As a new user
  I want to register for an account
  So that I can start using the chat application

  Scenario: Successful user registration
    Given the user is on the registration page
    When the user provides valid registration details
    And submits the registration form
    Then the user should be redirected to the login page
    And receive a confirmation email

  Scenario: Failed user registration (Invalid email)
    Given the user is on the registration page
    When the user provides an invalid email address
    And submits the registration form
    Then an error message should be displayed
    And the user should stay on the registration page