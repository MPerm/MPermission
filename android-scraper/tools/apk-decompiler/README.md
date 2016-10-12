# APK Decompiler Guide
This is a wholesome all in one solution to decompress an APK file to
readable xml and decompiled code.

## First time setup
Run the Python3 `setupDependencies.py` script
```
./setupDependencies.py
```
This will get the appropriate libraries under the `lib/` directory.

## Usage to decompress APK's

```
./apk_decompiler.sh path/to/app.apk
```

The result will be found in the script location under a `app.apk.uncompressed` directory.

## Implementation details
### Dependencies
- [apktools](https://code.google.com/p/android-apktool/)
- [dex2jar](https://code.google.com/p/dex2jar/)
- [jd-core-java](https://github.com/nviennot/jd-core-java)


`apktools` is used to get the readable xml.
`dex2jar` is used to change the classes.dex file inside an apk to a .jar. Intermediate step.
`jd-core-java` used dex2jars output .jar to decompile the java code to .java files.

To download all of the dependencies you can use the setupDependencies python script. 
