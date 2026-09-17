@client_snowbox
@plugin_pointerPosition

Feature: Pointer Position Plugin

    Background:
        Given the index page is loaded
        And the map is loaded

    Scenario: The pointer position is shown once the pointer moves over the map
        Given the pointer position should display "X, Y"
        When the pointer is moved to the center of the map
        Then the pointer position should display a coordinate

    Scenario: Switching the coordinate reference system reprojects the position
        Given the pointer is moved to the center of the map
        And the pointer position should display a coordinate
        When the coordinate reference system "EPSG:4326" is selected
        Then the pointer position should display a different coordinate
