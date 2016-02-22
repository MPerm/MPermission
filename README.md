## Android M Permissions Analysis
Tool to analyze Android M permissions.

### Context
With the release of Android 6.0 (Android M / API Level 23), the method by which system and 3rd party permissions are granted have changed. Now users grant permissions at runtime instead of during installation.   

This can result in an increase in susceptibility to over and underprivileging for Android M app users. For example, if a normal (as opposed to [dangerous][1]) permission is listed in the app manifest, the system grants that permission automatically -- even if the app is not using the permission directly.

System permissions are divided into nine groups:

| Permission   | Description                        |
|--------------|------------------------------------|
| Calendar     | Managing calendars                 |
| Camera       | Taking photos and recording videos |
| Contacts     | Managing contacts                  |
| Location     | Current device location            |
| Microphone   | Audio recording                    |
| Phone        | Dialing and managing phone calls   |
| Body Sensors | Heart rate and similar data        |
| SMS          | Sending and viewing messages       |
| Storage      | Accessing photos, media, and files |

Users can grant all permissions within a group by requiring a single action -- which may result in overprivileging. 

### Objective
MPermission is a tool that analyzes appropriate usage of permissions in Android M applications. The tool will assign a "Permissions Score" based on what permissions are being used vs. what permissions are being required. The tool will also distinguish between system permissions and 3rd party / advertisement permissions. Ads may check if permissions have already been granted, if they have, then use them. Otherwise they silently won’t, that is without a prompt to the user.

### Implementation
MPermission is written in Python 3. It consists of:
* Stand alone [Android Application Package (.apk file)][2] decompiler
* Source analysis driver
* Ignored permissions configuration file (including looking for dangerous permissions)
* SQLite database to persist analysis results

![Subsystem](/docs/mpermission-subsystem-diagram.png?raw=true "Optional Title")

The tool will have 4 stages of execution:  

1. Decompilation of .apk file 
2. Permission names and groups harvesting from AndroidManifest.xml
3. Searching source files for usage of each permission
4. Writing results of usage to SQLite database

The tool can synchrnously execute over several .apks.

#### Analysis
To determine what permisisons are used in the source the tool will search for commonly used functions to acquire permissions. Some of these include  
* `requestPermissions()` - requests permissions to be used 
* `checkSelfPermission()` - determines whether the user has been granted this permission

### Usage
MPermission uses pre-written decompilation scripts from the kocsenc/android-scraper project. The project is referenced via a [submodule](3). After cloning the project, it can be installed via:

```bash
% git submodule init
% git submodule update
```

For Android decompilation instructions, refer to [the README](4) within the submodule.

The tool can be run incrementally with the following flags:

```bash
% python3 perm.py apk_path --decompile -d               # decompiles APK and moves it to sample_apk/
% python3 perm.py project_root --config -c config.txt   # pass file to observe / ignore permissions during analysis
% python3 perm.py project_root --harvest -h             # writes current permissions to permissions-app-name.txt
% python3 perm.py project_root --save -s                # saves results to SQLite DB
```

### Project Goals

It's intended that the tool will be available to researchers and developers to highlight any over or underprivilege areas within their apps. The team is planning on analyzing 10 - 15 custom permissions-heavy apps as well as several apps that already exist in the Play Store.

Currently testing the following Android M apps:
* Facebook Messenger

License
----
BSD 

[1]: http://developer.android.com/guide/topics/security/permissions.html#normal-dangerous
[2]: https://www.wikiwand.com/en/Android_application_package
[3]: https://git-scm.com/book/en/v2/Git-Tools-Submodules
[4]: https://github.com/kocsenc/android-scraper/tree/master/tools/apk-decompiler/

