Feature: User Login
  Before:

  Scenario: Successful Login
    Given I use DB fixture "users"
    And the user is on the login page
    When the user enters a valid email and password
    And clicks on the login button
    Then the user should be redirected to the home page

  Scenario Outline: Failed login
    Given the user is on the login page
    When the user enter invalid <email> and <password>
    And clicks on the login button
    Then <error> message should be displayed
    And the user should stay on the login page

    Examples:
      | email                     | password         | error                     |
      |                           | 12345678         | Unauthorized              |
      | user-1@example.com        |                  | Unauthorized              |
      | user-1@example.com        | invalid_password | Credentials are not valid |
      | invalid_email@example.com | 12345678         | Credentials are not valid |