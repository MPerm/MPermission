
import glob, os

def search_project_root(project_root):
    """
    Looks in the source root for matching files with permissions.
    """
    os.chdir(project_root)

    for file in glob.iglob("*.java", recursive=True):
        line_number = 0
        with open(file, encoding='utf-8') as java_file:
            for line in java_file:
                line_number += 1
                print('{:>4} {}'.format(line_number, line.rstrip()))
