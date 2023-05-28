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
    constructor(projectID, startDate, endDate, deadline, progress, departmentID) {
        this.projectID = projectID;
        this.startDate = startDate;// (startDate < endDate) and (startDate < deadline)
        this.endDate = endDate;    // (endDate > startDate)
        this.deadline = deadline;  // (deadline > startDate)
        this.progress = progress;
        this.departmentID = departmentID;
        this.dateFormat = '\'%Y-%m-%d\'';
    }

    InsertString(){
        return 'STR_TO_DATE(\'' + this.startDate + '\', ' + this.dateFormat + '), STR_TO_DATE(\'' + this.endDate + '\', ' + this.dateFormat + '), STR_TO_DATE(\'' + this.deadline + '\', ' + this.dateFormat + '), \'' + this.progress + '\', \'' + this.departmentID + '\'';
    }

    UpdateString() {
        return 'startDate = STR_TO_DATE(\'' + (this.startDate || 'NULL') + '\', ' + this.dateFormat + '), endDate = STR_TO_DATE(\'' + (this.endDate || 'NULL') + '\', ' + this.dateFormat + '), deadline = STR_TO_DATE(\'' + (this.deadline || 'NULL') + '\', ' + this.dateFormat +'), progress = ' + this.progress + ', departmentID = ' + this.departmentID;
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