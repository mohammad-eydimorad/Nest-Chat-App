Feature: User Registration
  As a new user
  I want to register for an account
  So that I can start using the chat application

  Scenario: Successful user registration
    Given the user is on the registration page
    When the user provides valid registration details
    And submits the registration form
    Then the user should be redirected to the login page
  
  Scenario Outline: Failed user registration
    Given the user is on the registration page
    When the user provides registration details with <email> and <password>
    And submits the registration form
    Then <error> message should be displayed
    And the user should stay on the registration page

    Examples:
      | email              | password                                  | error                                                   |
      |                    | valid_password                            | email must be an email                                  |
      | valid@email.com    |                                           | password should not be empty                            |
      | valid@email.com    | short                                     | password must be longer than or equal to 8 characters   |
      | wrong_format_email | valid_password                            | email must be an email                                  |
      | valid@email.com    | long password long password long password | password must be shorter than or equal to 32 characters |