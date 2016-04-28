## Android M Permissions Analysis
Tool to analyze Android M permissions.

### Context
With the release of Android 6.0 (Android M / API Level 23), the method by which system and 3rd party permissions are granted have changed. Now users grant permissions at runtime instead of during installation.   

This can result in an increase in susceptibility to over and underprivileging for Android M app users. For example, if a normal (as opposed to [dangerous][1]) permission is listed in the app manifest, the system grants that permission automatically -- even if the app is not using the permission directly. Users can grant all permissions within a group by requiring a single permission. This may result in overprivileging. For convenience, groups and further information is [in the wiki][5].

#### Rules to Keep in Mind
1. If an app requests a **normal** permission it will be granted immediately. [View the list of normal permissions here](http://developer.android.com/guide/topics/security/normal-permissions.html).
2. If an app requests a **dangerous** permission listed in its manifest, and the app already has another dangerous permission in the same permission group, the system immediately grants the permission without any interaction with the user.

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

The tool can synchronously execute over several .apks.

#### Analysis
To determine what permisisons are used in the source the tool will search for commonly used functions to acquire permissions. Some of these include  
* `requestPermissions()` - requests permissions to be used 
* `checkSelfPermission()` - determines whether the user has been granted this permission
* `<uses-permission>` is when the application is seeking the user's permission to use some feature
* `<permission>` is when the application is requiring other apps to seek the user's permission to use a custom feature of the app These are the developer's own permissions.

### Setup
MPermission requires Python 3.0 - 3.4. 

MPermission uses pre-written decompilation scripts from the kocsenc/android-scraper project. The project is referenced via a [submodule](3). After cloning the project, it can be installed via:

```bash
% git submodule init
% git submodule update
```


After cloning and updating the submodule, run  

```bash
% python3 android-scraper/tools/apk-decompiler/setupDependencies.py
```
This will install dex2jar and apktools for the android-scraper. For further Android decompilation instructions, refer to [the README](4) within the submodule.

Now install any package dependencies:  
```bash
% pip install -r requirements.txt
```

You should now be ready to decompile and analyze some Android M apps.

### Usage  

The tool can be run incrementally with the following flags:

```bash
% python3 mperm.py -d [--decompile] apk_path              # decompiles APK and moves it to sample_apk/
% python3 mperm.py -a [--analyze]   decompiled_apk_path   # analyze and prints source report / analysis report
```

### Project Goals

It's intended that the tool will be available to researchers and developers to highlight any over or underprivilege areas within their apps. The team is planning on analyzing 10 - 15 custom permissions-heavy apps as well as several apps that already exist in the Play Store.

Currently testing the following Android M apps:
* Facebook Messenger
* Instagram Layout
* Facebook Lite 2
* Facebook Lite 4
* New York Times
* Plex App
* Oracle Suite of Apps

License
----
BSD 

[1]: http://developer.android.com/guide/topics/security/permissions.html#normal-dangerous
[2]: https://www.wikiwand.com/en/Android_application_package
[3]: https://git-scm.com/book/en/v2/Git-Tools-Submodules
[4]: https://github.com/kocsenc/android-scraper/tree/master/tools/apk-decompiler/
[5]: https://github.com/dan7800/MPermission/wiki

