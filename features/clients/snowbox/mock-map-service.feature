@client_snowbox
@mock-map-service
@mode:serial
Feature: Mock Map Service tests for Snowbox client
    Background:
        Given the mock map server state is reset
        And the index page is loaded
        And the map is loaded

    @smoke
    Scenario: Mock map basemap is selectable and sends WMS requests
        When a WMS GetMap expectation is registered for the mock layer
        And the layer chooser is opened
        And the mock map basemap is selected
        Then WMS GetMap requests should have been sent to the mock map service

    @smoke
    Scenario: Single-use expectation is consumed after first match
        When a single-use WMS GetMap expectation is registered for the mock layer
        And the layer chooser is opened
        And the mock map basemap is selected
        Then WMS GetMap requests should have been sent to the mock map service
        And subsequent WMS GetMap requests should return the blue fallback tile
