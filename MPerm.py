#!/usr/bin/env python3

__author__ = 'piper'

import glob
import sys
import subprocess
import Harvest

def read_manifest(project_root):
    """Analyze manifest to see what permissions to request."""
    root_dir = project_root[:project_root.find('/') + 1]
    manifests = permissions = []
    for file in glob.glob(root_dir + "/**/AndroidManifest.xml", recursive=True):
        manifests.append(file)

    line_number = 1
    with open(manifests[0]) as manifest:
        for line in manifest:
            line_number += 1
            if 'permission' in line:
                # TODO(piper): allow for permission[s] as well. Not just singular.
                permission_line = line[(line.find('permission.') + len('permission.')):]
                permissions.append(permission_line[:permission_line.find('"')])

    line_number = 1
    print('--- Permissions from Manifest --- \n')
    for permission in permissions:
        print('{:>4} {}'.format(line_number, permission.rstrip()))
        line_number += 1

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
        read_manifest(source_path)


if __name__ == "__main__":
    main()
