class Department {
    constructor (departmentID, name, managerID) {
        this.departmentID = departmentID;
        this.name = name;
        this.managerID = managerID;
    }

    InsertString() {
        return '\'' + this.name + '\', \'' + this.managerID + '\'';
    }

    UpdateString() {
        return 'name = \'' + this.name + '\', managerID = ' + this.managerID;
    }
}

class Employee {
    constructor (employeeID, name, departmentID, managerID, roomID) {
        this.employeeID = employeeID;
        this.name = name;
        this.departmentID = departmentID;
        this.managerID = managerID;
        this.roomID = roomID;
    }

    InsertString(){
        return '\'' + this.name + '\', \'' + this.departmentID + '\', \'' + this.managerID + '\', \'' + this.roomID + '\'';;
    }

    UpdateString() {
        return 'name = \'' + this.name + '\', departmentID = ' + this.departmentID + ', managerID = ' + this.managerID + ', roomID = ' + this.roomID;
    }
}

class Project {
    dateFormat = ', \'%Y-%m-%d\'';
    constructor(projectID, startDate, endDate, deadline, progress, departmentID) {
        this.projectID = projectID;
        this.startDate = startDate;
        this.endDate = endDate;
        this.deadline = deadline;
        this.progress = progress;
        this.departmentID = departmentID;
    }

    InsertString(){
        return '\'' + this.startDate + '\', \'' + this.endDate + '\', \'' + this.deadline + '\', \'' + this.progress + '\', \'' + this.departmentID + '\'';
    }

    UpdateString() {
        return 'startDate = STR_TO_DATE(' + this.startDate + Project.dateFormat + '), endDate = STR_TO_DATE(' + this.endDate + Project.dateFormat + '), deadline = STR_TO_DATE(' + this.deadline + Project.dateFormat +'), progress = ' + this.progress + ', departmentID = ' + this.departmentID;
    }
}

class EmployeeProject {
    constructor(employeeID, projectID, oldEmployeeID = null, oldProjectID = null) {
        this.employeeID = employeeID;
        this.projectID = projectID;
        this.oldEmployeeID = oldEmployeeID;
        this.oldProjectID = oldProjectID;
    }

    InsertString(){
        return '\'' + this.employeeID + '\', \'' + this.projectID + '\'';
    }

    UpdateString() {
        return 'employeeID = ' + this.employeeID + ', projectID = ' + this.projectID;
    }
}

class Room {
    constructor(roomID, number, departmentID) {
        this.roomID = roomID;
        this.number = number;
        this.departmentID = departmentID;
    }

    InsertString(){
        return '\'' + this.number + '\', \'' + this.departmentID + '\'';
    }

    UpdateString() {
        return 'number = ' + this.number + ', departmentID = ' + this.departmentID;
    }
}

module.exports.Department = Department;
module.exports.Employee = Employee;
module.exports.Project = Project;
module.exports.EmployeeProject = EmployeeProject;
module.exports.Room = Room;