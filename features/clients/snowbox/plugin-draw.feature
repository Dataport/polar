@client_snowbox
@plugin-draw
Feature: Draw tool functionality tests for Snowbox client
    Background:
        Given the index page is loaded
        And the map is loaded
        And the draw tools panel is opened

    @smoke
    Scenario: A polygon can be drawn on the map
        When the "Polygon" draw tool is selected
        And a polygon is drawn on the map
        Then the drawing should contain 1 feature
        And the drawn polygon should have 7 coordinate points

    Scenario: Two features drawn at the same coordinate can be modified separately
        When the "Point" draw tool is selected
        And two points are drawn at the same location
        And the edit mode is activated
        And a point is dragged to a different location
        Then the drawing should contain 2 features
        And the two features should have different coordinates

    @smoke
    Scenario: A drawn polygon can be cut
        When the "Polygon" draw tool is selected
        And a polygon suitable for cutting is drawn
        And the "Cut polygons" operation is applied
        And a cut line is drawn through the polygon
        Then the drawing should eventually contain 2 features

    @smoke
    Scenario: A drawn polygon can be duplicated
        When the "Polygon" draw tool is selected
        And a small polygon is drawn on the map
        And the "Duplicate" operation is applied
        And the duplicate is placed on the map
        Then the drawing should eventually contain 2 features

    @smoke
    Scenario: Two drawn polygons can be merged
        When the "Polygon" draw tool is selected
        And two separate polygons are drawn on the map
        And the "Merge polygons" operation is applied
        And a selection is drawn around both polygons
        Then the drawing should eventually contain 1 feature
