#!/usr/bin/env python3
"""
MPerm: Base driver for the analysis tool.
"""

import argparse
import os
import shutil
import subprocess
import sys
import xml.etree.ElementTree as ET

from Analyze import Analyze
from Report import Report

def get_manifest_tree(project_root):
    """Parses AndroidManifest into XML tree."""
    manifest = project_root + "/app/AndroidManifest.xml"
    tree = ET.parse(manifest)
    return tree

def validate_minimum_sdk(manifest_tree):
    """MPerm will only test Android 6.0 or greater apps."""
    root = manifest_tree.getroot()
    namespace = '{http://schemas.android.com/apk/res/android}'
    sdks = {
        'min': namespace + 'minSdkVersion',
        'target': namespace + 'targetSdkVersion',
        'max': namespace + 'maxSdkVersion'
    }

    for sdk_version in root.findall('uses-sdk'):
        max_sdk_version = -1
        try:
            max_sdk_version = int(sdk_version.attrib[sdks['max']])
        except KeyError:
            print("Warning: maxSdkVersion wasn't defined in Manifest;\
 app may not be compatible with Android M.")
        if max_sdk_version > -1 and max_sdk_version < 7:
            sys.exit("Error: SDK version is less than 6.0: app is not compatible with Android M.")

def get_package_name(manifest_tree):
    """Analyze manifest to see package name of app."""
    root = manifest_tree.getroot()
    return root.attrib['package']

def get_third_party_permissions(manifest_tree):
    """Analyze manifest to see what permissions to request."""
    root = manifest_tree.getroot()
    values = []
    third_party = set()
    for neighbor in root.iter('uses-permission'):
        values.append(list(neighbor.attrib.values()))
    for val in values:
        for perm in val:
            if 'com' in perm:
                third_party.add(perm)
    return third_party

def get_requested_permissions(manifest_tree):
    """Analyze manifest to see what permissions to request."""
    root = manifest_tree.getroot()
    permissions = set()
    values = []
    for neighbor in root.iter('uses-permission'):
        values.append(list(neighbor.attrib.values()))
    for val in values:
        for perm in val:
            permissions.add(perm)
    return permissions


def decompile(apk_path):
    """
    Only decompile the provided APK. The decompiled APK will be
    left within the same directory.
    """
    apk_name = apk_path.rsplit('/', 1)[-1]

    print("Decompiling " + apk_name)
    subprocess.call(["./android-scraper/tools/apk-decompiler/apk_decompiler.sh", apk_path])
    print("Decompilation finished!")
    print("Moving " + apk_name + " to sample_apks/...")
    try:
        shutil.move("android-scraper/tools/apk-decompiler/" + apk_name +
                    ".uncompressed", "sample_apks/" + apk_name + ".uncompressed")
        print("Move finished! Check sample_apks/ for the decompiled app.")
    except FileNotFoundError:
        print("Error: couldn't find "
              + apk_name + ".It might already be in sample_apks/")

def main():
    """Primary driver of MPermission. """

    parser = argparse.ArgumentParser(description='Performs static analysis on\
     decompiled Android M app permissions.')
    parser.add_argument('apk', metavar='APK', nargs=1,
                        help='required APK to decompile or root app to analyze')
    parser.add_argument('--decompile', '-d', action='store_true',
                        help='decompiles the provided APK')
    parser.add_argument('--analyze', '-a', action='store_true',
                        help='analyzes the provided deompiled APK')
    parser.add_argument('--apilevel', '-l', action='store_true',
                        help='specifies the API level you want to analyze against')
    args = parser.parse_args()

    print("Arguments: " + args.echo)

    if args.decompile:
        decompile(args.apk[0])  # decompile the provided APK
    elif args.analyze:

        # config.txt is used to ignore certain permissions
        print("Looking in root for a config.txt...")
        ignore = {
            'groups': set(),
            'individual': set()
        }
        try:
            with open("./config.txt") as config:
                for index, line in enumerate(config):

                    # ignore commented lines
                    if not line.startswith("//"):
                        if line.startswith("#"):
                            # groups -- remove '# ' and add to set
                            sanitized = line[2:].rstrip()
                            ignore['groups'].add(sanitized)
                        elif line != '\n':
                            # specific permissions
                            sanitized = line.rstrip()
                            ignore['individual'].add(sanitized)
            print("Config found. Analysis will ignore the stated permissions.")

        except FileNotFoundError:
            print("Couldn't find a config.txt. Proceeding with analysis")

        # Create reports directory if it doesn't exist
        if not os.path.exists('./reports'):
            os.mkdir('./reports')

        # Parse manifest and validate API
        source_path = args.apk[0]

        api = ""
        if args.apilevel:
            api = args.apk[1]  # The specified API level

        manifest_tree = get_manifest_tree(source_path)
        validate_minimum_sdk(manifest_tree)

        # Collect permissions
        package_name = get_package_name(manifest_tree)
        permissions = get_requested_permissions(manifest_tree)
        third_party_permissions = get_third_party_permissions(manifest_tree)

        # Scrape the source
        analyzer = Analyze(source_path, package_name, permissions, ignore, str(api))
        source_report = analyzer.search_project_root()

        # Analyze and print results
        report = Report(package_name, permissions, third_party_permissions)
        report.print_analysis(permissions, source_report)
    else:
        parser.print_help

if __name__ == "__main__":
    main()
