from Permissions import Permissions


class Report:
    """Report object to be printed."""

    def __init__(self, report_file_name, package_name, permissions, third_party_permissions):
        self.report_file_name = report_file_name
        self.package_name = package_name
        self.permissions = permissions
        self.third_party_permissions = third_party_permissions

    def print_permissions_origin(self):
        """Prints where the permission requests come from (app, libs, etc)."""
        with open(self.report_file_name, "w") as report:
            print('test')

    def print_report(self):
        """Prints permissions analysis report to report_name."""
        line_number = 1
        with open(self.report_file_name, "w+") as report:
            print(" Android Permissions Report ".center(50,'-'),file=report)
            print("{}".format("Package: " + self.package_name), file=report)
            print("\n", file=report)

            print(" Third Party Permissions ".center(50,'-'),file=report)
            [print(permission, file=report) for permission in self.third_party_permissions]

            print("\n", file=report)
            permission = Permissions()
            system_permissions = permission.get_permissions()

            print(" System Permission Groups from Manifest ".center(50,'-'),file=report)
            for permission_group, permission_list in system_permissions.items():
                # Bucket system permission to appropriate permission_group
                print(permission_group.capitalize() + " Group:", file=report)
                for new_permission in self.permissions:
                    if new_permission.rstrip() in permission_list:
                        print('{:>4} {}'.format(line_number, new_permission.rstrip()), file=report)
                        self.permissions.remove(new_permission)
                        line_number += 1
                print('\n', file=report)

            print(" Non-Dangerous Permissions from Manifest ".center(50,'-'),file=report)
            line_number = 1
            for non_system_permission in self.permissions:
                print('{:>4} {}'.format(line_number, non_system_permission), file=report)
                line_number += 1
