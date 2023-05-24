// Get an instance of mysql we can use
const { query } = require('express');
var mysql = require('mysql');

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_mcmichag',
    password        : '4183',
    database        : 'cs340_mcmichag'
});

// link db models
var models = require('./../Models/Models');

//db constants
const DEPARTMENTS_TABLE         = 'Departments';
const EMPLOYEES_TABLE           = 'Employees';
const EMPLOYEES_PROJECTS_TABLE  = 'Employees_Projects'
const PROJECTS_TABLE            = 'Projects';
const ROOMS_TABLE               = 'Rooms';

const DEPARTMENTS_ID = 'departmentID';
const EMPLOYEES_ID   = 'employeeID';
const PROJECTS_ID    = 'projectID'
const ROOM_ID        = 'roomID'

//run a query and return the result
function RunQuery(queryString) {// query can go pool.query(queryString, parameters, callback);
                                // qS = SELECT * FROM ? WHERE ? = ?; and parameters = [table, colName, colValue]
    return new Promise((resolve, reject) => {
        pool.query(queryString, function(err, results, fields) {
            return err ? reject(err) : resolve(results);
        });
    });
}

module.exports.RunQuery = RunQuery;

// General CRUD
async function SelectAll(table) {
    return await RunQuery('SELECT * FROM ' + table + ';');
}

async function SelectById(table, idName, id) {
    return await RunQuery('SELECT * FROM ' + table + ' WHERE ' + idName + ' = ' + id + ';');
}

async function Insert(table, columns, values) {
    return await RunQuery('INSERT INTO ' + table + ' ' + columns + ' VALUES (' + values + ') RETURNING *;');
}

async function UpdateById(table, idName, id, values) {
    await RunQuery('UPDATE ' + table + ' SET ' + values + ' WHERE ' + idName + ' = ' + id + ';');
    return await SelectById(table, idName, id);
}

async function DeleteById(table, idName, id) {
    return await RunQuery('DELETE FROM ' + table + ' WHERE ' + idName + ' = ' + id + ';');
}

// Department CRUD
function ConstructDepartments(deparmentData) {
    deparments = [];
    deparmentData.forEach(deparment => {
        deparments.push(
            new models.Department(
                deparment.departmentID,
                deparment.name,
                deparment.managerID
            )
        )
    });
    return deparments;
}

async function SelectAllDeparments() {
    return ConstructDepartments(await SelectAll(DEPARTMENTS_TABLE));
}

async function SelectDeparmentById(id) {
    return ConstructDepartments(await SelectById(DEPARTMENTS_TABLE, DEPARTMENTS_ID,  id))[0];
}

async function InsertDeparment(deparment) {
    return ConstructDepartments(await Insert(DEPARTMENTS_TABLE, '(name, managerID)', deparment.InsertString()))[0];
}

async function UpdateDeparmentById(deparment) {
    return ConstructDepartments(await UpdateById(DEPARTMENTS_TABLE, DEPARTMENTS_ID, deparment.departmentID, deparment.UpdateString()))[0];
}

async function DeleteDeparmentById(id) {
    return await DeleteById(DEPARTMENTS_TABLE, DEPARTMENTS_ID, id);
}

module.exports.SelectAllDeparments = SelectAllDeparments;
module.exports.SelectDeparmentById = SelectDeparmentById;
module.exports.InsertDeparment     = InsertDeparment;
module.exports.UpdateDeparmentById = UpdateDeparmentById;
module.exports.DeleteDeparmentById = DeleteDeparmentById;

// Employee CRUD
function ConstructEmployees(employeeData) {
    employees = [];
    employeeData.forEach(employee => {
        employees.push(
            new models.Employee(
                employee.employeeID,
                employee.name,
                employee.departmentID,
                employee.managerID,
                employee.roomID
            )
        )
    });
    return employees;
}

async function SelectAllEmployees() {
    return ConstructEmployees(await SelectAll(EMPLOYEES_TABLE));
}

async function SelectEmployeeById(id) {
    return ConstructEmployees(await SelectById(EMPLOYEES_TABLE, EMPLOYEES_ID,  id))[0];
}

async function InsertEmployee(employee) {
    return ConstructEmployees(await Insert(EMPLOYEES_TABLE, '(name, departmentID, managerID, roomID)', employee.InsertString()))[0];
}

async function UpdateEmployeeById(employee) {
    return ConstructEmployees(await UpdateById(EMPLOYEES_TABLE, EMPLOYEES_ID, employee.employeeID, employee.UpdateString()))[0];
}

async function DeleteEmployeeById(id) {
    return await DeleteById(EMPLOYEES_TABLE, EMPLOYEES_ID, id);
}

module.exports.SelectAllEmployees = SelectAllEmployees;
module.exports.SelectEmployeeById = SelectEmployeeById;
module.exports.InsertEmployee     = InsertEmployee;
module.exports.UpdateEmployeeById = UpdateEmployeeById;
module.exports.DeleteEmployeeById = DeleteEmployeeById;

// Project CRUD
function ConstructProjects(projectData) {
    projects = [];
    projectData.forEach(project => {
        projects.push(
            new models.Project(
                project.projectID,
                project.startDate,
                project.endDate,
                project.deadline,
                project.progress,
                project.departmentID
            )
        )
    });
    return projects;
}

async function SelectAllProjects() {
    return ConstructProjects(await SelectAll(PROJECTS_TABLE));
}

async function SelectProjectById(id) {
    return ConstructProjects(await SelectById(PROJECTS_TABLE, PROJECTS_ID,  id))[0];
}

async function InsertProject(project) {
    return ConstructProjects(await Insert(PROJECTS_TABLE, '(startDate, endDate, deadline, progress, departmentID)', project.InsertString()))[0];
}

async function UpdateProjectById(project) {
    return ConstructProjects(await UpdateById(PROJECTS_TABLE, PROJECTS_ID, project.projectID, project.UpdateString()))[0];
}

async function DeleteProjectById(id) {
    return await DeleteById(PROJECTS_TABLE, PROJECTS_ID, id);
}

module.exports.SelectAllProjects = SelectAllProjects;
module.exports.SelectProjectById = SelectProjectById;
module.exports.InsertProject     = InsertProject;
module.exports.UpdateProjectById = UpdateProjectById;
module.exports.DeleteProjectById = DeleteProjectById;

// Employee Project CRUD
function ConstructEmployeesProjects(empProjData) {
    empsProjs = [];
    empProjData.forEach(empProj => {
        empsProjs.push(
            new models.EmployeeProject(
                empProj.employeeID,
                empProj.projectID
            )
        )
    });
    return empsProjs;
}

async function SelectAllEmployeesProjects() {
    return ConstructEmployeesProjects(await SelectAll(EMPLOYEES_PROJECTS_TABLE));
}

async function SelectEmployeeProjectById(employeeID, projectID) {
    compositeName = '(' + EMPLOYEES_ID + ', ' + PROJECTS_ID + ')';
    compositeID = '(' + employeeID + ', ' + projectID + ')';
    return ConstructEmployeesProjects(await SelectById(PROJECTS_TABLE, compositeName,  compositeID))[0];
}

async function InsertEmployeeProject(employeeProject) {
    return ConstructEmployeesProjects(await Insert(EMPLOYEES_PROJECTS_TABLE, '(employeeID, projectID)', employeeProject.InsertString()))[0];
}

async function UpdateEmployeeProjectById(employeeProject) {
    compositeName = '(' + EMPLOYEES_ID + ', ' + PROJECTS_ID + ')';
    compositeID = '(' + employeeProject.employeeID + ', ' + employeeProject.projectID + ')';
    return ConstructEmployeesProjects(await UpdateById(PROJECTS_TABLE, compositeName, compositeID, employeeProject.UpdateString()))[0];
}

async function DeleteEmployeeProjectById(employeeID, projectID) {
    compositeName = '(' + EMPLOYEES_ID + ', ' + PROJECTS_ID + ')';
    compositeID = '(' + employeeID + ', ' + projectID + ')';
    return await DeleteById(PROJECTS_TABLE, compositeName, compositeID);
}

module.exports.SelectAllEmployeesProjects         = SelectAllEmployeesProjects;
module.exports.SelectEmployeeProjectById          = SelectEmployeeProjectById;
module.exports.InsertEmployeeProject              = InsertEmployeeProject;
module.exports.UpdateEmployeeProjectById          = UpdateEmployeeProjectById;
module.exports.DeleteEmployeeProjectById          = DeleteEmployeeProjectById;

// Room CRUD
function ConstructRooms(roomData) {
    rooms = [];
    roomData.forEach(room => {
        rooms.push(
            new models.Room(
                room.roomID,
                room.number,
                room.departmentID
            )
        )
    });
    return rooms;
}

async function SelectAllRooms() {
    return ConstructRooms(await SelectAll(ROOMS_TABLE));
}

async function SelectRoomById(id) {
    return ConstructRooms(await SelectById(ROOMS_TABLE, ROOM_ID,  id))[0];
}

async function InsertRoom(room) {
    return ConstructRooms(await Insert(ROOMS_TABLE, '(number, departmentID)', room.InsertString()))[0];
}

async function UpdateRoomById(room) {
    return ConstructRooms(await UpdateById(ROOMS_TABLE, ROOM_ID, room.roomID, room.UpdateString()))[0];
}

async function DeleteRoomById(id) {
    return await DeleteById(ROOMS_TABLE, ROOM_ID, id);
}

module.exports.SelectAllRooms = SelectAllRooms;
module.exports.SelectRoomById = SelectRoomById;
module.exports.InsertRoom     = InsertRoom;
module.exports.UpdateRoomById = UpdateRoomById;
module.exports.DeleteRoomById = DeleteRoomById;