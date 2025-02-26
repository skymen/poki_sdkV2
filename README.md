<img src="./src/icon.svg" width="100" /><br>
# Poki SDK
<i>Simple plugin for games to be hosted on the Poki Platform (https://sdk.poki.com/)</i> <br>
### Version 2.0.2.2

[<img src="https://placehold.co/200x50/4493f8/FFF?text=Download&font=montserrat" width="200"/>](https://github.com/skymen/poki_sdkV2/releases/download/skymen_pokiSDK-2.0.2.2.c3addon/skymen_pokiSDK-2.0.2.2.c3addon)
<br>
<sub> [See all releases](https://github.com/skymen/poki_sdkV2/releases) </sub> <br>

---
<b><u>Author:</u></b> skymen, Avix Games <br>
<b>[Construct Addon Page](https://www.construct.net/en/make-games/addons/1409/poki)</b>  <br>
<b>[Documentation](https://sdk.poki.com/)</b>  <br>
<sub>Made using [CAW](https://marketplace.visualstudio.com/items?itemName=skymen.caw) </sub><br>

## Table of Contents
- [Usage](#usage)
- [Examples Files](#examples-files)
- [Properties](#properties)
- [Actions](#actions)
- [Conditions](#conditions)
- [Expressions](#expressions)
---
## Usage
To build the addon, run the following commands:

```
npm i
npm run build
```

To run the dev server, run

```
npm i
npm run dev
```

## Examples Files

---
## Properties
| Property Name | Description | Type |
| --- | --- | --- |
| Enabled | Whether the SDK is enabled | combo |
| Debug on preview | Whether to enable debug mode | check |
| Game ID | Enter the ID of the game here for the beacon to work | text |
| Do beacon | Whether to send beacons to Poki | check |
| Beacon interval | Number of seconds between beacons | integer |
| Max beacons | Maximum number of beacons to send | integer |
| Loading notification | When to notify the DOM that the game has finished loading | combo |
| Automatic suspend | Automatically suspend the SDK when the game is suspended | check |
| Suspend timeout | Number of seconds to wait before suspending the SDK | integer |


---
## Actions
| Action | Description | Params
| --- | --- | --- |
| Interstitial | Request an interstitial ad | Tag             *(string)* <br> |
| Rewarded | Request a rewarded ad | Tag             *(string)* <br> |
| Send Event | Send an analytics event | Category             *(string)* <br>Action             *(string)* <br>Label             *(string)* <br> |
| Gameplay Start | Notify the SDK that the gameplay has started |  |
| Gameplay Stop | Notify the SDK that the gameplay has stopped |  |
| Loading End | Manually notify the SDK that the game has finished loading |  |


---
## Conditions
| Condition | Description | Params
| --- | --- | --- |
| Last Rewarded Success | Last Rewarded Success |  |
| On Interstitial Complete | Triggered when an interstitial ad is completed | Tag *(string)* <br> |
| On Rewarded Complete | Triggered when a rewarded ad is completed | Tag *(string)* <br> |
| SDK Is Enabled | Check if the SDK is enabled |  |
| SDK Is Loaded | Check if the SDK is loaded |  |


---
## Expressions
| Expression | Description | Return Type | Params
| --- | --- | --- | --- |
| LastAdTag | Last Ad Tag | string |  | 
| LastRewardedSuccess | Last Rewarded Success | number |  | 
