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

            print(" System Permission Groups from Manifest ".center(50,'-'),file=report)
            permission = Permissions()
            system_permissions = permission.get_permissions()
            for permission_group, permission_list in system_permissions.items():
                # Bucket system permission to appropriate permission_group
                print(permission_group.capitalize() + " Group:", file=report)
                for permission in self.permissions:
                    permission = permission.rsplit('.', 1)[-1]
                    if permission in permission_list:
                        print('{} '.format(permission), file=report)
                print('\n', file=report)

        print("Report printed! Location: " + self.report_file_name)
