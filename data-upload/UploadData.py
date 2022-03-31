import requests
import csv
import json
import re

def deleteStudent(adminuser: str, adminpass: str) -> None:
    url = 'http://localhost:8888/server-side/php/api/index.php/delete/student'
    x = requests.post(url, data={ 'adminuser': adminuser, 'adminpass': adminpass })

def deleteCourse(adminuser: str, adminpass: str) -> None:
    url = 'http://localhost:8888/server-side/php/api/index.php/delete/course'
    x = requests.post(url, data={ 'adminuser': adminuser, 'adminpass': adminpass })

def deleteCalendar(adminuser: str, adminpass: str) -> None:
    url = 'http://localhost:8888/server-side/php/api/index.php/delete/calendar'
    x = requests.post(url, data={ 'adminuser': adminuser, 'adminpass': adminpass })

def uploadCalendar(adminuser: str, adminpass: str, days: list[dict[str, str]]) -> None:
    url = 'http://localhost:8888/server-side/php/api/index.php/calendar'
    for day in days:
        data = { 'adminuser': adminuser, 'adminpass': adminpass, 'data': json.dumps(day) }
        requests.post(url, data=data)

def uploadCourses(adminuser: str, adminpass: str, courses: dict[str, str]) -> None:
    url = 'http://localhost:8888/server-side/php/api/index.php/course'
    for course in courses:
        data = { 'adminuser': adminuser, 'adminpass': adminpass, 'data': json.dumps(courses[course]) }
        requests.post(url, data=data)

def uploadStudents(adminuser: str, adminpass: str, students: dict[str, str]) -> None:
    url = 'http://localhost:8888/server-side/php/api/index.php/student'
    for student in students:
        data = { 'adminuser': adminuser, 'adminpass': adminpass, 'data': json.dumps(students[student]) }
        requests.post(url, data=data)

def uploadStudentCourses(adminuser: str, adminpass: str, studentCourses: list[dict[str, str]]) -> None:
    url = 'http://localhost:8888/server-side/php/api/index.php/student/course'
    for studentCourse in studentCourses:
        data = { 'adminuser': adminuser, 'adminpass': adminpass, 'data': json.dumps(studentCourse) }
        requests.post(url, data=data)

def uploadCourseDays(adminuser: str, adminpass: str, courseDays: list[dict[str, str]]) -> None:
    url = 'http://localhost:8888/server-side/php/api/index.php/course/day'
    for courseDay in courseDays:
        data = { 'adminuser': adminuser, 'adminpass': adminpass, 'data': json.dumps(courseDay) }
        requests.post(url, data=data)

def readCycleCSV(path: str) -> list[dict[str, str]]:
    important = { 'CYCLE_DAY.DAY_NAME': 'cycle', 'CYCLE_DAY.DATE_VALUE': 'cycle_day' }
    return readCSVWithImportant(path, important)

def evaluateCycleRange(range: str) -> list[str]:
    order = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3', 'A4', 'B4']
    if '-' in range:
        rangeSplit = range.split('-')
        min = order.index(rangeSplit[0])
        max = order.index(rangeSplit[1]) + 1
        return order[min:max]
    else:
        return [range]

def getIndividualCycleDays(exp: str) -> list[tuple[int, str]]:
    results = []
    match = re.match(r'(.)\((.*?)\)', exp)
    if match:
        period = match.group(1)
        cycleDayExp = match.group(2)
        cycleDays = cycleDayExp.split(',')
        for cycleRange in cycleDays:
            allCycleDays = evaluateCycleRange(cycleRange)
            for cycleDay in allCycleDays:
                results.append((period, cycleDay))
    return results

def readStudentCSV(path: str) -> tuple[dict[str, str], list[dict[str, str]], dict[str, str], list[dict[str, str]]]:
    important = { 'STUDENTS.Student': 'name', 'STUDENTS.LID': 'student_id', 'STUDENTS.Grade': 'grade', 'STUDENTS.Gender': 'gender', 'STUDENTS.Course': 'course', 'STUDENTS.Course_Number': 'course_id', 'STUDENTS.Section': 'course_section', 'STUDENTS.Exp': 'course_exp', 'STUDENTS.Room': 'course_room', 'STUDENTS.Teacher': 'course_teacher' }
    data = readCSVWithImportant(path, important)

    course = {}
    courseDay = []
    student = {}
    studentCourse = []
    for point in data:
        if point['course_id'] not in course.keys():
            exps = point['course_exp'].split(' ')
            for exp in exps:
                cycleDays = getIndividualCycleDays(exp)
                for cycleDay in cycleDays:
                    courseDay.append({ 'course_id': point['course_id'], 'cycle_day': cycleDay[1], 'period': cycleDay[0] })
            course[point['course_id']] = {
                'name': point['course'],
                'id': point['course_id'],
                'section': point['course_section'],
                'room': point['course_room'],
                'teacher': point['course_teacher'],
                'expression': point['course_exp']
            }

        if point['student_id'] not in student:
            student[point['student_id']] = {
                'name': point['name'],
                'id': point['student_id'],
                'email': 'jjc914@student.cis.edu.hk', # FIXME: Filler
                'grade': point['grade'],
                'gender': point['gender']
            }
        sc = { 'student_id': point['student_id'], 'course_id': point['course_id'] }
        if sc not in studentCourse:
            studentCourse.append(sc)
    return (course, courseDay, student, studentCourse)

def readCSVWithImportant(path: str, important: dict[str, str]):
    importantIndex = []
    data = []
    with open(path) as csvfile:
        reader = csv.reader(csvfile)
        header = next(reader)
        for i, title in enumerate(header):
            if title in important.keys():
                importantIndex.append(i)
        for row in reader:
            point = {}
            for i in importantIndex:
                point[important[header[i]]] = row[i]
            data.append(point)
    return data
## TODO: course-day, course and student has to all be done together
