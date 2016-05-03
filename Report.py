"""
Report: Writes an analysis text file of the various over/under priviliged
        permissions found during analysis.
"""
from Permissions import Permissions

class Report:
    """Report object to be printed."""

    def __init__(self, package_name, permissions, third_party_permissions):
        self.package_name = package_name
        self.permissions = permissions
        self.third_party_permissions = third_party_permissions
        self.report_filename = "reports/report_" + package_name + ".txt"
        self.analysis_report_filename = "reports/analysis_" + package_name + ".txt"

    def print_analysis(self, manifest_requested_permissions, source_file):
        """Diffs the requested permissions against occurrences in source."""

        # Add requested normal permissions to total
        total_requested_permissions = set()
        for perm in manifest_requested_permissions:
            total_requested_permissions.add(perm.rsplit('.', 1)[-1])

        # Now add the requested dangerous permissions, based on what
        # permissions from groups have already been added.
        # For example, if READ_CONTACTS was requested in manifest, then add the remaining CONTACTS group.
        requested_dangerous_permissions = Permissions().get_dangerous_permission_group(total_requested_permissions)
        rp = set()
        for requested_perm_group in requested_dangerous_permissions.values():
            for requested in requested_perm_group:
                rp.add(requested)

        over_requested = requested_dangerous_permissions.copy()

        normal_permission_occurrences = set()
        dangerous_permission_occurrences = set()

        groups_to_remove = set()
        not_requested_files = set()
        not_requested_source_lines = set()

        # Reading source report for findings.
        with open(source_file) as source:
            for line in source:
                if "android.permission." in line:
                    # Skip line if it's commented
                    if line.lstrip().startswith("//"):
                        continue

                    # Check each normal permission to see if it's in line
                    for normal in Permissions().normal_permissions:
                        if normal in line:
                            normal_permission_occurrences.add(normal + ": " + line)

                    # Check each line to see if dangerous permission may exist
                    for d_perm_group in Permissions().dangerous_permissions.values():
                        for dangerous in d_perm_group:
                            # Dangerous permission was found in line.
                            if dangerous in line:
                                dangerous_permission_occurrences.add(dangerous + ": " + line)

                                # Possible not requested in Manifest. This is what we're
                                # using for underprivilege.
                                if dangerous not in rp:
                                    not_requested_files.add(source_file)
                                    not_requested_source_lines.add(line)
                                else:
                                    # At this point, we've encountered a dangerous
                                    # permission that hasn't been requested.
                                    # But, the remaining perms from the group may have been requested.
                                    for req_perm_group in requested_dangerous_permissions.values():
                                        if dangerous in req_perm_group:
                                            for group, permissions in over_requested.items():
                                                if dangerous in permissions:
                                                    groups_to_remove.add(group)

            # Now remove those groups from requested groups
            for group in groups_to_remove:
                over_requested.pop(group)

        # Now print results to analysis file
        with open(self.analysis_report_filename, "w+") as analysis:
            print(" Analysis Report ".center(50, '-'), file=analysis)
            print("{}".format("Package: " + self.package_name), file=analysis)
            print(file=analysis)

            print(" Permissions from Manifest ".center(50, '-'), file=analysis)
            for index, non_system_permission in enumerate(self.permissions):
                print('{:>4} {}'.format(index, non_system_permission), file=analysis)
            print(file=analysis)

            print(" Third Party Permissions ".center(50, '-'), file=analysis)
            for index, permission in enumerate(self.third_party_permissions):
                print('{:>4} {}'.format(index, permission), file=analysis)
            print(file=analysis)

            print(" Requested Dangerous Permission Groups ".center(50, '-'), file=analysis)
            for group, permissions in requested_dangerous_permissions.items():
                for permission in permissions:
                    print(group + ": " + permission, file=analysis)
            print(file=analysis)

            print(" Dangerous Permission Occurrences ".center(50, '-'), file=analysis)
            print("{}".format("Total found: " + str(len(dangerous_permission_occurrences))), file=analysis)
            print(file=analysis)
            for permission in dangerous_permission_occurrences:
                print(permission, file=analysis)
            print(file=analysis)

            print(" Unrequested Dangerous (Under) ".center(50, '-'), file=analysis)
            for permission in not_requested_source_lines:
                print(permission, file=analysis)
            print(file=analysis)

            print(" Requested Dangerous (Over) ".center(50, '-'), file=analysis)
            for requested in over_requested.values():
                print(requested, file=analysis)
            print(file=analysis)
        print("Analysis printed! Location: " + self.analysis_report_filename)
