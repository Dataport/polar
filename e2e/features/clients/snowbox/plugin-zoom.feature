@client_snowbox
@plugin-zoom
Feature: Zoom functionality tests for Snowbox client
    Background:
        Given the index page is loaded
        And the map is loaded

    @smoke
    Scenario: Check initial state of zoom level
        Then the zoom level should be at level 2

    @smoke
    Scenario: Check zoom level increases when zoom in button is clicked
        When the zoom in button is clicked 1 time
        Then the zoom level should be at level 3

    @smoke
    Scenario: Check zoom level decreases when zoom out button is clicked
        When the zoom out button is clicked 1 time
        Then the zoom level should be at level 1

    @smoke
    Scenario: Zoom in button gets disabled at maximum zoom level
        Given the map is zoomed in at maximum zoom level
        Then the zoom level should be at level 9
        And the zoom in button should be disabled
        But the zoom out button should be enabled

    @smoke
    Scenario: Zoom out button gets disabled at minimum zoom level
        Given the map is zoomed out at minimum zoom level
        Then the zoom level should be at level 0
        And the zoom out button should be disabled
        But the zoom in button should be enabled

    Scenario: Zoom in button gets enabled after zooming out from maximum zoom level
        Given the map is zoomed in at maximum zoom level
        When the zoom out button is clicked 1 time
        Then the zoom in button should be enabled

    Scenario: Zoom out button gets enabled after zooming in from minimum zoom level
        Given the map is zoomed out at minimum zoom level
        When the zoom in button is clicked 1 times
        Then the zoom out button should be enabled

    @mock-map-service
    Scenario: Zooming in requests smaller tiles from the mock map service
        When a WMS GetMap expectation is registered for the mock layer
        And the layer chooser is opened
        And the mock map basemap is selected
        Then WMS GetMap requests should have been sent to the mock map service
        And the WMS tile width is saved as "before zoom"
        When the zoom in button is clicked 1 time
        Then the zoom level should be at level 3
        And a WMS request with tile width smaller than "before zoom" is saved as "after zoom"

    @mock-map-service
    Scenario: Zoom in followed by zoom out returns to the same tile size
        When a WMS GetMap expectation is registered for the mock layer
        And the layer chooser is opened
        And the mock map basemap is selected
        Then WMS GetMap requests should have been sent to the mock map service
        And the WMS tile width is saved as "initial"
        When the zoom in button is clicked 1 time
        Then the zoom level should be at level 3
        And a WMS request with tile width smaller than "initial" is saved as "after zoom in"
        When the zoom out button is clicked 1 time
        Then the zoom level should be at level 2
        And a WMS request with tile width larger than "after zoom in" is saved as "after roundtrip"
    

