#!/usr/bin/env python3
"""
MPerm: Base driver for the analysis tool.
"""

import argparse
import shutil
import subprocess
import xml.etree.ElementTree as ET

from Harvest import Harvest
from Report import Report

def get_manifest_tree(project_root):
    """Parses AndroidManifest into XML tree."""
    manifest = project_root + "/app/AndroidManifest.xml"
    tree = ET.parse(manifest)
    return tree

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

def get_all_permissions(manifest_tree):
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

    # TODO: dectect for Android M

    parser = argparse.ArgumentParser(description='Performs static analysis on decompiled Android M app permissions.')
    parser.add_argument('apk', metavar='APK', nargs=1,
                        help='required APK to decompile or root app to harvest from')
    parser.add_argument('--decompile', '-d', nargs='?',
                        help='decompiles the provided APK')
    parser.add_argument('--analyze', '-a', nargs='?',
                       help='analyzes the provided deompiled APK')
    args = parser.parse_args()

    if args.decompile:
        decompile(args.apk[0])  # decompile the provided APK
    elif args.analyze:
        # Get permissions and manifest
        source_path = args.apk[0]
        manifest_tree = get_manifest_tree(source_path)
        package_name = get_package_name(manifest_tree)
        permissions = get_all_permissions(manifest_tree)
        third_party_permissions = get_third_party_permissions(manifest_tree)

        # Scrape the source
        harvest = Harvest(source_path, package_name, permissions)
        source_report = harvest.search_project_root()

        # Analyze and print results
        report = Report(package_name, permissions, third_party_permissions)
        report.print_analysis(permissions, source_report)
    else:
        print("error")

if __name__ == "__main__":
    main()
