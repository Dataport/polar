@client_dish
Feature: Dish Tests

  @not_implemented
  Scenario: The modal dialog is opening
    Given the index page is loaded
    When the modal is opened
    Then the button should be disabled

  @smoke
  Scenario: The modal dialog is acceptable and closes successfully
    Given the index page is loaded
    When the modal is opened
    Then the button should be disabled
    When the checkbox is clicked
    Then the button should be enabled
    When the button is clicked
    Then the modal should be closed