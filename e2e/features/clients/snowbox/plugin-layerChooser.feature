@client_snowbox
@plugin_layerChooser

Feature: Layer Chooser Plugin.
    
    Background:
        Given the index page is loaded
        And the map is loaded

    Scenario: layer chooser should switch layers correctly
        When the layer chooser button is clicked
        And a new layer is selected
        Then the map should display the selected layer

    @mock-map-service
    Scenario: layer chooser should visibly repaint the map
        When the layer chooser button is clicked
        And the rendered map is remembered
        And the mock map basemap is selected
        Then the rendered map should differ from the remembered one
        When the previously active background layer is selected again
        Then the rendered map should match the remembered one
