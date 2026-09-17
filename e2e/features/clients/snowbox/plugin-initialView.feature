@client_snowbox
@plugin_initialView

Feature: Initial View Plugin

    Background:
        Given the index page is loaded
        And the map is loaded

    Scenario: Returning to the initial view restores the start zoom level
        Given the zoom level should be at level 2
        When the zoom in button is clicked 3 times
        Then the zoom level should be at level 5
        When the return to initial view button is clicked
        Then the zoom level should be at level 2

    Scenario: Returning to the initial view is possible from the minimum zoom level
        Given the map is zoomed out at minimum zoom level
        When the return to initial view button is clicked
        Then the zoom level should be at level 2
