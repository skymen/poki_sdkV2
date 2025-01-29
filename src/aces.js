import { action, condition, expression } from "../template/aceDefine.js";

const category = "Aces_In_Single_File";

action(
  category,
  "SampleAction",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Sample Action",
    displayText: "Sample Action {0}",
    description: "This is a sample action",
    params: [
      {
        id: "param1",
        name: "Param1",
        desc: "This is a sample param",
        type: "string",
        initialValue: '"Hello World"',
      },
    ],
  },
  function (param) {
    console.log(param);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Sample Action");
        resolve();
      }, 1000);
    });
  }
);

condition(
  category,
  "SampleCondition",
  {
    highlight: false,
    deprecated: false,
    listName: "Sample Condition",
    displayText: "Sample Condition",
    description: "This is a sample condition",
    params: [],
  },
  function () {
    console.log("Sample Condition");
    return true;
  }
);

expression(
  category,
  "SampleExpression",
  {
    highlight: false,
    deprecated: false,
    returnType: "string",
    description: "This is a sample expression",
    params: [],
  },
  function () {
    console.log("Sample Expression");
    return "Sample Expression";
  },
  false
);
