from Permissions import Permissions


class Report:
    """Report object to be printed."""

    def __init__(self, package_name, permissions, third_party_permissions):
        self.package_name = package_name
        self.permissions = permissions
        self.third_party_permissions = third_party_permissions
        self.report_filename = "reports/report_" + package_name + ".txt"
        self.analysis_report_filename = "reports/analysis_" + package_name + ".txt"

    def print_report(self):
        """Prints permissions analysis report to report_name."""
        with open(self.report_filename, "w+") as report:
            print(" Android Permissions Report ".center(50,'-'), file=report)
            print("{}".format("Package: " + self.package_name), file=report)

            print(" Permissions from Manifest ".center(50, '-'), file=report)
            for index, non_system_permission in enumerate(self.permissions):
                print('{:>4} {}'.format(index, non_system_permission), file=report)
            print(file=report)

            print(" Third Party Permissions ".center(50, '-'), file=report)
            [print(permission, file=report) for permission in self.third_party_permissions]
            print(file=report)

            print(" Dangerous Permission Groups from Manifest ".center(50, '-'), file=report)
            permission = Permissions()
            for permission_group, permission_list in permission.dangerous_permissions.items():
                # Bucket system permission to appropriate permission_group
                print(permission_group.capitalize() + " Group:", file=report)
                for permission in self.permissions:
                    permission = permission.rsplit('.', 1)[-1]
                    if permission in permission_list:
                        print('{} '.format(permission), file=report)
                print(file=report)

        print("Report printed! Location: " + self.report_filename)

    def print_analysis(self, requested_permissions, source_file):
        """Diffs the requested permissions against occurrences in source."""

        # Get permissions object
        permission = Permissions()

        permissions = set()
        for perm in requested_permissions:
            permissions.add(perm.rsplit('.', 1)[-1])

        requested_permissions_dict = permission.get_dangerous_permission_group(permissions)
        requested_permissions = set()
        for requested_perm_group in requested_permissions_dict.values():
            for requested in requested_perm_group:
                requested_permissions.add(requested)

        normal_permissions = set()
        dangerous_permissions = set()
        potentially_not_requested_lines = set()

        # Reading source report for findings.
        with open(source_file) as source:
            for line in source:
                if "android.permission." in line:

                    # Check each line for normal permissions
                    for normal in permission.normal_permissions:
                        if normal in line:
                            normal_permissions.add(normal + ": " + line)

                    # Check each line to see if dangerous permission may exist
                    for dangerous_list in permission.dangerous_permissions.values():
                        for dangerous in dangerous_list:
                            if dangerous in line:
                                dangerous_permissions.add(perm + ": " + line)

                                # Possible not requested in Manifest
                                if dangerous not in requested_permissions:
                                    potentially_not_requested_lines.add(line)

        # Now print results to analysis file
        with open(self.analysis_report_filename, "w+") as analysis:
            print(" Analysis Report ".center(50,'-'), file=analysis)
            print("{}".format("Package: " + self.package_name), file=analysis)

            print(" Normal Permissions ".center(50,'-'), file=analysis)
            print("{}".format("Count: " + str(len(normal_permissions))), file=analysis)
            for permission in normal_permissions:
                print(permission, file=analysis)

            print(" Dangerous Permissions ".center(50,'-'), file=analysis)
            print("{}".format("Count: " + str(len(dangerous_permissions))), file=analysis)
            for permission in dangerous_permissions:
                print(permission, file=analysis)

            print(" Unrequested Dangerous Permissions ".center(50,'-'), file=analysis)
            for not_requested in potentially_not_requested_lines:
                # TODO: print the permission as well
                # TODO: detect for commenting
                print(not_requested, file=analysis)
        print("Analysis printed! Location: " + self.analysis_report_filename)
