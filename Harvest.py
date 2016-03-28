"""
Harvest: collections permisisons within source project.
"""

import fnmatch
import os

class Harvest:
    """Harvest object that scrapes project source looking for permissions matches."""

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
        matches = []

        # Search for matching java files
        for root, dirnames, filenames in os.walk(source_root):
            for filename in fnmatch.filter(filenames, "*.java"):
                matches.append(os.path.join(root, filename))
        for file in matches:
            current_file = ""
            with open(file) as java_file:
                for index, line in enumerate(java_file):
                    if search_string in line:
                        if current_file is not java_file.name:
                            current_file = java_file.name
                            self.lines.append(('{} {:>4}\n'.format("\nFile: ", current_file)))
                            self.source_files.append(current_file)
                        self.lines.append(('{:>4} {}'.format(index, line.rstrip())))
        print("Harvesting finished!")

        # Print the source report
        with open(self.report_file_name, "w+") as report:
            print(" Source Report ".center(50, '-'), file=report)
            print("{}".format("Package: " + self.package_name), file=report)
            print(file=report)

            print(" Permissions Found in Files ".center(50, '-'), file=report)
            for line in self.source_files:
                print(line, file=report)
            print(file=report)

            print(" Occurrences in Source ".center(50, '-'), file=report)
            for line in self.lines:
                print(line, file=report)
        print("Source report printed! Location: " + self.report_file_name)
        return self.report_file_name
