#!/usr/bin/env python3
__author__ = 'piper'

import glob
import sys
import subprocess

from Harvest import Harvest
from Permissions import Permissions
from Report import Report

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


def decompile(decomp_path, apk_path, dest_path="./sample_apks/"):
    """
    Only decompile the provided APK. The decompiled APK will be
    left within the same directory.
    """
    subprocess.call(["./" + decomp_path, apk_path])
    subprocess.call(["mv", "android-scraper/tools/apk-decompiler/uncompressed", dest_path])


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
        permissions = read_manifest(source_path)
        if '-h' in arguments:
            harvest = Harvest(source_path, permissions)
            source_files = harvest.search_project_root()
            report = Report("report.txt", permissions, source_files)
            report.print_report()

if __name__ == "__main__":
    main()
