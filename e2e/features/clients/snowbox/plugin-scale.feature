@client_snowbox
@plugin_scale

Feature: Scale Plugin

    Background:
        Given the index page is loaded
        And the map is loaded

    Scenario: The scale plugin should update correctly when zooming
        Given the zoom level should be at level 2
        Then the scale should display "1:60,000"
        When the zoom out button is clicked 1 time
        Then the scale should display "1:100,000"

    Scenario: Selecting a different scale should update the zoom level accordingly
        When the scale "1:100,000" is selected
        Then the zoom level should be at level 1

    Scenario: All scale to zoom level mappings should be correct
        Then all scale to zoom level mappings should be correct
            | Scale     | Zoom Level |
            | 1:250,000 | 0          |
            | 1:100,000 | 1          |
            | 1:60,000  | 2          |
            | 1:40,000  | 3          |
            | 1:20,000  | 4          |
            | 1:10,000  | 5          |
            | 1:5,000   | 6          |
            | 1:2,500   | 7          |
            | 1:1,000   | 8          |
            | 1:500     | 9          |