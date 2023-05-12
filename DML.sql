-- all dynamic values are prefaced with a colon : eg :id

-- DEPARTMENT QUERIES
SELECT * FROM Deparments;

SELECT * From Deparments WHERE departmentID = :id;

INSERT INTO Deparments (name, managerID)
VALUES (:name, :managerID);

UPDATE Deparments
SET name = :name, managerID = :managerID
WHERE departmentID = :id;

DELETE FROM Deparments
WHERE departmentID = :id;

-- EMPLOYEE QUERIES
SELECT * FROM Employees;

SELECT * From Employees WHERE employeeID = :id;

INSERT INTO Employees (name, departmentID, managerID, roomID)
VALUES (:name, :departmentID, :managerID, :roomID);

UPDATE Employees
SET name = :name, departmentID = :departmentID, managerID = :managerID, roomID = :roomID
WHERE employeeID = :id;

DELETE FROM Employees
WHERE employeeID = :id;

-- PROJECT QUERIES
SELECT * FROM Projects;

SELECT * From Projects WHERE projectID = :id;

INSERT INTO Projects (startDate, endDate, deadline, progress, departmentID)
VALUES (:startDate, :endDate, :deadline, :progress, :departmentID);

UPDATE Projects
SET startDate = :startDate, endDate = :endDate, deadline = :deadline, progress = :progress, departmentID = :departmentID
WHERE projectID = :id;

DELETE FROM Projects
WHERE projectID = :id;

-- EMPLOYEE_PROJECT QUERIES
SELECT * FROM EmployeeProject;

SELECT * From EmployeeProject WHERE (employeeID, projectID) = :id;

INSERT INTO EmployeeProject (employeeID, projectID)
VALUES (:employeeID, :projectID);

UPDATE EmployeeProject
SET employeeID = :employeeID, projectID = :projectID
WHERE (employeeID, projectID) = :id;

DELETE FROM EmployeeProject
WHERE (employeeID, projectID) = :id;

-- ROOM QUERIES
SELECT * FROM Rooms;

SELECT * From Rooms WHERE roomID = :id;

INSERT INTO Rooms (number, departmentID)
VALUES (:number, :departmentID);

UPDATE Rooms
SET number = :number, departmentID = :departmentID
WHERE roomID = :id;

DELETE FROM Rooms
WHERE roomID = :id;