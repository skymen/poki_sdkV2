# Construct Addon Wizard (CAW) Framework

This is a build framework for creating Construct 3 addons (plugins and behaviors). It handles code bundling, ACE (Actions, Conditions, Expressions) generation, localization, and packaging.

## Critical Rules

**DO NOT MODIFY FILES IN THE `build/` OR `template/` FOLDERS** - These contain the build system internals and modifying them will likely break the addon build process.

**CHECK FOR DEV SERVER BEFORE BUILDING** - If the file `.dev-server-running` exists in the project root, the dev server is already running and will automatically rebuild when files change. You don't need to run `npm run build` to verify changes - just save the file and the dev server will rebuild and show any errors in its terminal output.

## Quick Commands

```bash
npm run build     # Build the addon for production
npm run dev       # Start dev server with hot reload
```

## Project Structure

```
config.caw.js         # Main addon configuration (ID, name, type, properties)
buildconfig.js        # Build system settings (cleanup, warnings, terser validation)
devConfig.js          # Dev server settings (port)
version.js            # Addon version number

src/
├── aces.js           # Alternative: Define ACEs in a single file
├── aces/             # ACE definitions (Actions, Conditions, Expressions)
│   └── [CategoryName]/
│       ├── a.ActionName.js      # Action (prefix: a. or act.)
│       ├── c.ConditionName.js   # Condition (prefix: c. or cnd.)
│       └── e.ExpressionName.js  # Expression (prefix: e. or exp.)
├── runtime/
│   ├── instance.js   # Runtime instance class
│   ├── plugin.js     # Runtime plugin class
│   └── type.js       # Runtime type class
├── editor/
│   ├── instance.js   # Editor instance class
│   └── type.js       # Editor type class
└── domside/
    └── index.js      # DOM-side script (if hasDomside: true)

build/                # DO NOT MODIFY - Build system internals
template/             # DO NOT MODIFY - Template files
```

## Key Files to Edit

### config.caw.js - Main Addon Configuration

```javascript
import {
  ADDON_TYPE,
  PLUGIN_TYPE,
  PROPERTY_TYPE,
  ADDON_CATEGORY,
} from "./template/enums.js";

export const addonType = ADDON_TYPE.PLUGIN; // or ADDON_TYPE.BEHAVIOR
export const type = PLUGIN_TYPE.OBJECT; // OBJECT, WORLD, or DOM
export const id = "my_addon"; // Unique addon ID (lowercase, underscores)
export const name = "My Addon"; // Display name
export const author = "Your Name";
export const description = "Addon description";
export const category = ADDON_CATEGORY.GENERAL;

export const properties = [
  {
    type: PROPERTY_TYPE.INTEGER,
    id: "myProperty",
    name: "My Property",
    desc: "Property description",
    options: {
      initialValue: 0,
    },
  },
];
```

### ACE File Structure

There are **three ways** to organize ACEs:

#### Method 1: Files in Category Folders (Recommended)

```
src/aces/
└── MyCategoryName/
    ├── a.MyAction.js      # Action
    ├── c.MyCondition.js   # Condition
    └── e.MyExpression.js  # Expression
```

File prefixes:

- Actions: `a.` or `act.`
- Conditions: `c.` or `cnd.`
- Expressions: `e.` or `exp.`

#### Method 2: Subfolders for Each Type

```
src/aces/
└── MyCategoryName/
    ├── actions/
    │   └── MyAction.js
    ├── conditions/
    │   └── MyCondition.js
    └── expressions/
        └── MyExpression.js
```

#### Method 3: Single File (src/aces.js)

```javascript
import { action, condition, expression } from "../template/aceDefine.js";

action(
  "CategoryName",
  "ActionId",
  {
    /* config */
  },
  function () {
    /* code */
  }
);
condition(
  "CategoryName",
  "ConditionId",
  {
    /* config */
  },
  function () {
    /* code */
  }
);
expression(
  "CategoryName",
  "ExpressionId",
  {
    /* config */
  },
  function () {
    /* code */
  }
);
```

## ACE Configuration Examples

### Action

```javascript
export const config = {
  listName: "Do Something", // Name in action list
  displayText: "Do something with {0}", // Text shown in event sheet ({0} = param)
  description: "Action description",
  isAsync: false, // Set true for async actions
  highlight: false,
  deprecated: false,
  params: [
    {
      id: "param1",
      name: "Parameter",
      desc: "Parameter description",
      type: "string", // string, number, combo, object, etc.
      initialValue: '"default"',
    },
  ],
};

export const expose = true; // Expose to runtime instance

export default function (param1) {
  // 'this' is the runtime instance
  console.log(param1);
}
```

### Condition

```javascript
export const config = {
  listName: "Is Something",
  displayText: "Is something {0}",
  description: "Condition description",
  isTrigger: false, // Set true for trigger conditions
  isInvertible: true,
  params: [],
};

export const expose = true;

export default function () {
  return true; // Must return boolean
}
```

### Expression

```javascript
export const config = {
  returnType: "number", // number, string, or any
  description: "Expression description",
  highlight: false,
  deprecated: false,
  params: [],
};

export const expose = false;

export default function () {
  return 42;
}
```

## Parameter Types

For actions/conditions:

- `string` - Text input
- `number` - Numeric input
- `combo` - Dropdown (requires `items` array)
- `object` - Object picker
- `layer` - Layer picker
- `layout` - Layout picker
- `keyb` - Keyboard key picker
- `boolean` - Checkbox
- `any` - Any expression

For expressions:

- `string`, `number`, `any`

### Combo Parameter Example

```javascript
{
  id: "myCombo",
  name: "Option",
  desc: "Select an option",
  type: "combo",
  initialValue: "option1",
  items: [
    { option1: "First Option" },
    { option2: "Second Option" },
  ],
}
```

## Runtime Instance Methods

In `src/runtime/instance.js`, you can:

```javascript
export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
      const properties = this._getInitProperties();
      // Access properties: properties[0], properties[1], etc.
    }

    // Trigger a condition
    _trigger(method) {
      super._trigger(self.C3.Plugins[id].Cnds[method]);
    }

    // Save/load for savegames
    _saveToJson() {
      return { myData: this.myData };
    }

    _loadFromJson(o) {
      this.myData = o.myData;
    }
  };
}
```

## Property Types

```javascript
PROPERTY_TYPE.INTEGER; // Whole number
PROPERTY_TYPE.FLOAT; // Decimal number
PROPERTY_TYPE.PERCENT; // 0-1 range shown as 0-100%
PROPERTY_TYPE.TEXT; // Single line text
PROPERTY_TYPE.LONGTEXT; // Multi-line text
PROPERTY_TYPE.CHECK; // Boolean checkbox
PROPERTY_TYPE.COMBO; // Dropdown
PROPERTY_TYPE.COLOR; // Color picker [r, g, b] (0-1 range)
PROPERTY_TYPE.OBJECT; // Object reference
PROPERTY_TYPE.GROUP; // Property group header
PROPERTY_TYPE.FONT; // Font picker
PROPERTY_TYPE.LINK; // Clickable link
PROPERTY_TYPE.INFO; // Info display
```

## Build Configuration (buildconfig.js)

```javascript
export const cleanup = {
  keepExport: false, // Keep dist/export after build
  keepExportStep: false, // Keep intermediate files
  keepGenerated: false, // Keep generated folder
};

export const terserValidation = "error"; // "error", "warning", or "skip"
export const disableTips = false;
export const disableWarnings = false;
```

## Workflow

1. **Configure addon** in `config.caw.js`
2. **Create ACEs** in `src/aces/` folders
3. **Implement runtime logic** in `src/runtime/instance.js`
4. **Run dev server**: `npm run dev`
5. **Test in Construct 3** using the localhost URL shown
6. **Build for release**: `npm run build`
7. **Find output** at project root: `{id}-{version}.c3addon`

## Common Patterns

### Async Action

```javascript
export const config = {
  isAsync: true,
  // ...
};

export default async function () {
  await someAsyncOperation();
}
```

### Trigger Condition

```javascript
export const config = {
  isTrigger: true,
  // ...
};

export default function () {
  return true;
}

// In instance.js, call: this._trigger("ConditionMethodName");
```

### Accessing Other Instances

```javascript
export default function () {
  const runtime = this._runtime;
  const allInstances = runtime.objects.Sprite.getAllInstances();
}
```

## Gotchas

1. **Property access in ACEs**: Use `this` to access the runtime instance, not `self`
2. **Expression returns**: Must match the declared `returnType`
3. **Combo initial values**: Must match one of the item keys, not display names
4. **File naming**: Use correct prefixes (`a.`, `c.`, `e.`) or folder structure
5. **Category names**: Folder names become category IDs (use underscores, not spaces)
6. **Version**: Edit `version.js` to update addon version
