#!/usr/bin/env python3
__author__ = 'piper'

import sys
import subprocess
import xml.etree.ElementTree as ET

from Harvest import Harvest
from Permissions import Permissions
from Report import Report

def get_manifest_tree(project_root):
    """Parses AndroidManifest into XML tree."""
    manifest = android_manifest = project_root + "/app/AndroidManifest.xml"
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
    subprocess.call(["./android-scraper/tools/apk-decompiler/apk_decompiler.sh", apk_path])
    # subprocess.call(["mv", "android-scraper/tools/apk-decompiler/com.*", "sample_apks/"], shell=True)
    print("Decompilation finished!")

def read_config(config_file):
    """Takes a configuration file to decide which permissions to analyze."""
    with open(config_file) as config:
        for line in config:
            ignored.append(line)
    return ignored


def main():
    """Primary driver of MPermission. """
    arguments = sys.argv
    source_path = ""
    if len(arguments) < 3:
        print("Error: missing arguments. ")
        exit(1)
    elif len(arguments) >= 3 and len(arguments) < 5:
        source_path = arguments[1]
        if '-h' in arguments:
            manifest_tree = get_manifest_tree(source_path)
            package_name = get_package_name(manifest_tree)
            permissions = get_all_permissions(manifest_tree)
            third_party_permissions = get_third_party_permissions(manifest_tree)

            # Create the proper file_name
            file_name = "report_" + package_name + ".txt"

            # Scrape the source
            harvest = Harvest(source_path, package_name, permissions)
            source_files = harvest.search_project_root()

            # Print report
            report = Report("reports/" + file_name, package_name, permissions, third_party_permissions)
            report.print_report()
        elif '-d' in arguments:
            decompile(source_path)

if __name__ == "__main__":
    main()
