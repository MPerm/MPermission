#!/usr/bin/env python3
__author__ = 'piper'

import glob
import sys
import subprocess
import xml.etree.ElementTree as ET

from Harvest import Harvest
from Permissions import Permissions
from Report import Report

def get_package_name(project_root):
    """Analyze manifest to see package name of app."""
    manifest = glob.glob(project_root + "/**/AndroidManifest.xml", recursive=True)
    tree = ET.parse(manifest[0])
    root = tree.getroot()
    return root.attrib['package']

def get_third_party_permissions(project_root):
    """Analyze manifest to see what permissions to request."""
    manifest = glob.glob(project_root + "/**/AndroidManifest.xml", recursive=True)
    tree = ET.parse(manifest[0])
    root = tree.getroot()
    values = []
    third_party = set()
    for neighbor in root.iter('uses-permission'):
        values.append(list(neighbor.attrib.values()))
    for val in values:
        for perm in val:
            if 'com' in perm:
                third_party.add(perm)
    return third_party

def read_manifest(project_root):
    """Analyze manifest to see what permissions to request."""
    manifests = permissions = []
    for file in glob.glob(project_root + "/**/AndroidManifest.xml", recursive=True):
        manifests.append(file)

    # Collect all permissions from each manifest
    with open(manifests[0]) as manifest:
        for line in manifest:
            if 'permission' in line:
                permission_line = line[(line.find('permission.') + len('permission.')):]
                permission = permission_line[:permission_line.find('"')]
                if permission not in permissions:
                    permissions.append(permission_line[:permission_line.find('"')])
    return permissions


def decompile(apk_path):
    """
    Only decompile the provided APK. The decompiled APK will be
    left within the same directory.
    """
    subprocess.call(["./android-scraper/tools/apk-decompiler/apk_decompiler.sh", apk_path])
    # subprocess.call(["mv", "android-scraper/tools/apk-decompiler/com.*", "sample_apks/"], shell=True)

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
            package_name = get_package_name(source_path)
            permissions = read_manifest(source_path)
            third_party_permissions = get_third_party_permissions(source_path)
            file_name = "report_" + package_name + ".txt"
            harvest = Harvest(source_path, package_name, permissions)
            source_files = harvest.search_project_root()
            report = Report("reports/" + file_name, package_name, permissions, third_party_permissions)
            report.print_report()
        elif '-d' in arguments:
            decompile(source_path)

if __name__ == "__main__":
    main()
