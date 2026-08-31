@client_snowbox
@plugin-toast
Feature: Toast functionality tests for Snowbox client

    @smoke
    Scenario: Toast is visible
        Given the index page is loaded
        And the map is loaded
        When a toast "info" is programmatically dispatched with message "私が来た"
        Then the toast message "私が来た" should be visible in the UI