@client_snowbox
@plugin-icon-menu
Feature: Icon Menu functionality tests for Snowbox client
    Background:
        Given the index page is loaded
        And the map is loaded

    @smoke
    Scenario: all icons in Icon Menu are clickable
        When each icon in the icon menu is clicked one by one
        Then each icon should respond to the click action

    @smoke
    Scenario: Icon Menu present and contains expected icons
        Then the icon menu should be present
        And the icon menu should contain the following icons in order:
            | Choose map          |
            | Draw tools          |
            | Zoom in             |
            | Zoom out            |
            | Activate fullscreen |
            | Mark own location   |
            | Routing planner     |
            | Attributions        |
    