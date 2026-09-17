@client_snowbox
@plugin-fullscreen

Feature: Fullscreen functionality tests

    Background:
        Given the index page is loaded
        And the map is loaded

    @smoke
    Scenario: Check if the fullscreen toggles correctly
        Given the map is not in fullscreen mode
        When the fullscreen button is clicked
        Then the map should enter fullscreen mode
        When the fullscreen button is clicked again
        Then the map should exit fullscreen mode
