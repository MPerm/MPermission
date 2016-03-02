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

def read_manifest(project_root):
    """Analyze manifest to see what permissions to request."""
    root_dir = project_root[:project_root.find('/') + 1]
    manifests = permissions = []
    for file in glob.glob(root_dir + "/**/AndroidManifest.xml", recursive=True):
        manifests.append(file)

    # Collect all permissions from each manifest
    line_number = 1
    with open(manifests[0]) as manifest:
        for line in manifest:
            line_number += 1
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
    line_number = 1
    with open(config_file) as config:
        for line in config:
            print('{:>4} {}'.format(line_number, line.rstrip()))
            line_number += 1

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
            file_name = "report_" + package_name + ".txt"
            # harvest = Harvest(source_path, permissions)
            # source_files = harvest.search_project_root()
            source_files = []
            report = Report("reports/" + file_name, permissions, source_files, package_name)
            report.print_report()
        elif '-d' in arguments:
            decompile(source_path)

if __name__ == "__main__":
    main()
