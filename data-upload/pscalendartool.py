import argparse
from UploadData import *

def main():
    # parser = argparse.ArgumentParser(description='Uploads data onto the PSCalendar server.')
    # parser.add_argument('-d', dest='dir', type=checkArgPathValue, help='the directory that contains the pdf files to search (automatically the working directory)')
    # args = parser.parse_args()

    ## TODO: put this in env file
    adminUsername = 'admin'
    adminPassword = 'admin'
    deleteStudent(adminUsername, adminPassword)
    deleteCourse(adminUsername, adminPassword)
    deleteCalendar(adminUsername, adminPassword)

    days = readCycleCSV('res/StudentTimeTableToGoogleCalendarDay (1).csv')
    courses, courseDays, students, studentCourses = readStudentCSV('res/StudentTimeTableToGoogleCC (1).csv')

    uploadCalendar(adminUsername, adminPassword, days)
    uploadCourses(adminUsername, adminPassword, courses)
    uploadStudents(adminUsername, adminPassword, students)
    uploadStudentCourses(adminUsername, adminPassword, studentCourses)
    uploadCourseDays(adminUsername, adminPassword, courseDays)

if __name__ == '__main__':
    main()
