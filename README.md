<img src="./src/icon.svg" width="100" /><br>
# Poki SDK
<i>Simple plugin for games to be hosted on the Poki Platform (https://sdk.poki.com/)</i> <br>
### Version 2.3.0.3

[<img src="https://placehold.co/200x50/4493f8/FFF?text=Download&font=montserrat" width="200"/>](https://github.com/skymen/poki_sdkV2/releases/download/skymen_pokiSDK-2.3.0.3.c3addon/skymen_pokiSDK-2.3.0.3.c3addon)
<br>
<sub> [See all releases](https://github.com/skymen/poki_sdkV2/releases) </sub> <br>

#### What's New in 2.3.0.3
- **Fixed:** removed WIP code that I forgot to remove before pushing last update

<sub>[View full changelog](#changelog)</sub>

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
| Auto delay gameplay start | Automatically delay the gameplay start to wait for the user to interact with the game | check |


---
## Actions
| Action | Description | Params
| --- | --- | --- |
| Get Token | Fetch a short-lived JWT token for the current user. The token expires in 1 minute. |  |
| Login | Prompt the user to log in. If the user logs in, the page will refresh. If already logged in, resolves immediately. |  |
| Interstitial | Request an interstitial ad | Tag             *(string)* <br> |
| Rewarded | Request a rewarded ad | Tag             *(string)* <br> |
| Send Event | Send an analytics event | Category             *(string)* <br>What             *(string)* <br>Action             *(string)* <br> |
| Gameplay Start | Notify the SDK that the gameplay has started |  |
| Gameplay Stop | Notify the SDK that the gameplay has stopped |  |
| Loading End | Manually notify the SDK that the game has finished loading |  |
| Move Pill | Reposition the Poki Pill on mobile. topPercent (0-50) sets vertical position as percentage from top, topPx is additional pixel offset (positive moves down, negative moves up) | Top Percent             *(number)* <br>Top Pixels             *(number)* <br> |
| Open External Link | Open an external link using Poki's openExternalLink API | URL             *(string)* <br> |
| Submit Score | Submit a score using Poki's submitScore API | Name             *(string)* <br>Score             *(number)* <br> |


---
## Conditions
| Condition | Description | Params
| --- | --- | --- |
| Is Logged In | Check if a user is currently logged in |  |
| On Get Token | Triggered when a JWT token has been successfully fetched |  |
| On Login Failed | Triggered when login fails (user closed auth panel or login timed out) |  |
| On User Changed | Triggered when the user state changes (after loading or after login) |  |
| Last Rewarded Success | Last Rewarded Success |  |
| On Interstitial Complete | Triggered when an interstitial ad is completed | Tag *(string)* <br> |
| On Rewarded Complete | Triggered when a rewarded ad is completed | Tag *(string)* <br> |
| SDK Is Enabled | Check if the SDK is enabled |  |
| SDK Is Loaded | Check if the SDK is loaded |  |


---
## Expressions
| Expression | Description | Return Type | Params
| --- | --- | --- | --- |
| AvatarUrl | The avatar URL of the currently logged-in user | string |  | 
| Token | The last fetched JWT authentication token | string |  | 
| Username | The username of the currently logged-in user | string |  | 
| LastAdTag | Last Ad Tag | string |  | 
| LastRewardedSuccess | Last Rewarded Success | number |  | 


---
## Changelog

**2.3.0.3**
- **Fixed:** removed WIP code that I forgot to remove before pushing last update

**2.3.0.2**
- **Fixed:** Delayed gameplay start now fires on pointer down instead of end of click

**2.3.0.1**
- **Added:** Open External Link
- **Fixed:** The default ad params are properly sent through

**2.3.0.0**
- **Added:** Accounts support
- **Changed:** Updated to new version of CAW framework
- **Fixed:** Should no longer crash on older Construct versions

**2.2.1.1**
- **Fixed:** Added translations

**2.2.1.0**
- **Fixed:** Removed disallowed autocompleteIds from the move pill params

**2.2.0.0**
- **Added:** Added support for moving Poki's pill
