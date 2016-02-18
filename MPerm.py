#!/usr/bin/env python3

__author__ = 'piper'

import sys
import Harvest

def read_config(config_file):
    """
    Take a configuration file to determine what permissions to analyze
    and/or ignore.
    """
    line_number = 0
    with open(config_file, encoding='utf-8') as config:
        for line in config:
            line_number += 1
            print('{:>4} {}'.format(line_number, line.rstrip()))

def main():
    """
    Primary driver of MPermission.
    """
    arguments = sys.argv
    if len(arguments) < 2:
        print("Error: missing arguments: project-root")
        exit()
    elif len(arguments) > 2:
        read_config(arguments[-1])
        Harvest.search_project_root(arguments[-2])


if __name__ == "__main__":
    main()
