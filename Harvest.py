
import glob
import os
import Report

from Report import Report

class Harvest:
    def __init__(self, project_root, permissions):
        """Init method of Harvest."""
        self.project_root = project_root
        self.source_files = []
        self.permissions = permissions

    def search_project_root(self):
        """Looks in the source root for matching files with permissions."""
        print("Harvesting from project root....")
        os.chdir(self.project_root)
        search_string = "permission"
        for file in glob.iglob("*/**/*.java", recursive=True):
            line_number = 0
            current_file = ""
            with open(file) as java_file:
                for line in java_file:
                    line_number += 1
                    if search_string in line:
                        # TODO: print filename as wel
                        if current_file is not java_file.name:
                            current_file = java_file.name
                            print('{} {:>4}\n'.format("\nFile: ", current_file))
                            self.source_files.append(current_file)
                        print('{:>4} {}'.format(line_number, line.rstrip()))
            java_file.close()

        with open("report.txt", "a") as report:
            print(self.source_files, file=report)
