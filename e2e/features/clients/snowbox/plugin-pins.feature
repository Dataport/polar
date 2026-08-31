@client_snowbox
@plugin-pins
Feature: Plugin Pins functionality tests for Snowbox client
    Background:
        Given the index page is loaded
        And the map is loaded

    @smoke
    Scenario: Check if the pin location and zoom level are updated when clicking on the map
        Given no pin coordinate is set
        When the map is clicked at coordinates [-200, 0]
        Then the pin location should be set to some value
        And the zoom level should be at level 7
    
    @smoke
    Scenario: Check if the pin is displayed on the map
        Given the map is zoomed to level 7
        When the map is clicked at the center coordinates
        Then a pin should be displayed at the center coordinates

    @smoke
    Scenario: Check if the pin is moved to the center of the map after placing
        Given the map is zoomed to level 7
        When the map is clicked at coordinates [-200, 0]
        Then a pin should be displayed at the center coordinates
        