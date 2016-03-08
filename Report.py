from Permissions import Permissions


class Report:
    """Report object to be printed."""

    def __init__(self, report_file_name, package_name, permissions, third_party_permissions):
        self.report_file_name = report_file_name
        self.package_name = package_name
        self.permissions = permissions
        self.third_party_permissions = third_party_permissions

    def print_report(self):
        """Prints permissions analysis report to report_name."""
        line_number = 1
        with open(self.report_file_name, "w+") as report:
            print(" Android Permissions Report ".center(50,'-'),file=report)
            print("{}".format("Package: " + self.package_name), file=report)
            print("\n", file=report)

            print(" Permissions from Manifest ".center(50,'-'),file=report)
            line_number = 1
            for non_system_permission in self.permissions:
                print('{:>4} {}'.format(line_number, non_system_permission), file=report)
                line_number += 1
            print("\n", file=report)

            print(" Third Party Permissions ".center(50,'-'),file=report)
            [print(permission, file=report) for permission in self.third_party_permissions]
            print("\n", file=report)

            print(" Dangerous Permission Groups from Manifest ".center(50,'-'),file=report)
            permission = Permissions()
            for permission_group, permission_list in permission.dangerous_permissions.items():
                # Bucket system permission to appropriate permission_group
                print(permission_group.capitalize() + " Group:", file=report)
                for permission in self.permissions:
                    permission = permission.rsplit('.', 1)[-1]
                    if permission in permission_list:
                        print('{} '.format(permission), file=report)
                print('\n', file=report)

        print("Report printed! Location: " + self.report_file_name)

    def print_analysis(self, requested_permissions, source_file):
        """Diffs the requested permissions against occurrences in source."""

        permission = Permissions()

        permissions = set()
        for perm in requested_permissions:
            permissions.add(perm.rsplit('.', 1)[-1])

        # TODO: check to see if unused permissions / weren't requested in manifest
        # p = permission.get_dangerous_permission_group(permissions)

        with open(source_file) as source:
            for line in source:
                if "android.permission." in line:
                    for normal in permission.normal_permissions:
                        if normal in line:
                            print("normal" + line)

                    for dangerous in permission.dangerous_permissions.values():
                        for perm in dangerous:
                            if perm in line:
                                print("dangerous: " + line)
