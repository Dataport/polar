@client_snowbox
@plugin-toast
Feature: Toast functionality tests for Snowbox client

Background:
    Given the index page is loaded

    # The two toasts shown at startup are dropped again after 3s when the toast
    # plugin is removed, so only the toast re-added at 6s is a stable anchor.
    @smoke
    Scenario: Toast added after the plugin was re-registered is visible
        Given the map is loaded
        Then the toast message "Sechs Sekunden" should be visible in the UI

    # The first three toasts only exist during the first 3s, so they are asserted
    # and dismissed right after page load, before waiting for the third one.
    Scenario: All three toasts are shown and can be dismissed
        Then the toast message "Hallo Welt" should be visible in the UI
        And the toast message "Achtung! Dies ist ein Toast!" should be visible in the UI
        When the toast message "Hallo Welt" is dismissed
        Then the toast message "Hallo Welt" should no longer be visible in the UI
        When the toast message "Achtung! Dies ist ein Toast!" is dismissed
        Then the toast message "Achtung! Dies ist ein Toast!" should no longer be visible in the UI
        And the toast message "Sechs Sekunden" should be visible in the UI
        When the toast message "Sechs Sekunden" is dismissed
        Then 0 toast messages should be visible in the UI