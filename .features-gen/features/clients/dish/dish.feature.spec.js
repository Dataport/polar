// Generated from: features\clients\dish\dish.feature
import { test } from "playwright-bdd";

test.describe('Dish Tests', () => {

  test('The modal dialog is acceptable and closes successfully', { tag: ['@client_dish', '@smoke'] }, async ({ Given, When, Then, page }) => { 
    await Given('the index page is loaded', null, { page }); 
    await When('the modal is opened', null, { page }); 
    await Then('the button should be disabled'); 
    await When('the checkbox is clicked', null, { page }); 
    await Then('the button should be enabled'); 
    await When('the button is clicked'); 
    await Then('the modal should be closed', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\clients\\dish\\dish.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":11,"tags":["@client_dish","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":12,"keywordType":"Context","textWithKeyword":"Given the index page is loaded","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When the modal is opened","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then the button should be disabled","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When the checkbox is clicked","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then the button should be enabled","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When the button is clicked","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then the modal should be closed","stepMatchArguments":[]}]},
]; // bdd-data-end