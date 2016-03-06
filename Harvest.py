
import glob
import os
import Report

from Report import Report

class Harvest:
    def __init__(self, project_root, package_name, permissions):
        """Init method of Harvest."""
        self.project_root = project_root
        self.package_name = package_name
        self.permissions = permissions
        self.report_file_name = "reports/source_report_" + self.package_name + ".txt"
        self.source_files = []
        self.lines = []

    def search_project_root(self):
        """Looks in the source root for matching files with permissions."""
        print("Harvesting from project root....")
        search_string = "permission"
        source_root = self.project_root + "/app/src/"
        for file in glob.iglob(source_root + "**/*.java", recursive=True):
            line_number = 0
            current_file = ""
            with open(file) as java_file:
                for line in java_file:
                    line_number += 1
                    if search_string in line:
                        if current_file is not java_file.name:
                            current_file = java_file.name
                            self.lines.append(('{} {:>4}\n'.format("\nFile: ", current_file)))
                            self.source_files.append(current_file)
                        self.lines.append(('{:>4} {}'.format(line_number, line.rstrip())))
        print("Harvesting finished!")

        with open(self.report_file_name, "w+") as report:
            print(" Source Report ".center(50,'-'),file=report)
            print("{}".format("Package: " + self.package_name), file=report)
            print("\n", file=report)

            print(" Permissions Found in Files ".center(50,'-'),file=report)
            [print(line,file=report) for line in self.source_files]
            print("\n", file=report)

            print(" Occurrences in Source ".center(50,'-'),file=report)
            [print(line,file=report) for line in self.lines]
        print("Source report printed! Location: " + self.report_file_name)
