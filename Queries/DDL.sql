CREATE TABLE Employees(
    employeeID   INT         NOT NULL AUTO_INCREMENT,
    name         VARCHAR(50) NOT NULL,
    departmentID INT,
    managerID    INT,
    roomID       INT,
    PRIMARY KEY(employeeID),
    FOREIGN KEY(managerID)
        REFERENCES Employees(employeeID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE Departments(
    departmentID INT         NOT NULL AUTO_INCREMENT,
    name         VARCHAR(50),
    managerID    INT,
    PRIMARY KEY(departmentID),
    FOREIGN KEY(managerID)
        REFERENCES Employees(employeeID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE Rooms(
    roomID       INT NOT NULL AUTO_INCREMENT,
    number       INT NOT NULL,
    departmentID INT,
    PRIMARY KEY(roomID),
    FOREIGN KEY(departmentID)
        REFERENCES Departments(departmentID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE Projects(
    projectID    INT  NOT NULL AUTO_INCREMENT,
    startDate    DATE          CHECK (startDate < endDate AND startDate < deadline),
    endDate      DATE          CHECK (endDate   > startDate),
    deadline     DATE          CHECK (deadline  > startDate),
    progress     INT  NOT NULL CHECK (progress  >= 0      AND progress  <= 100),
    departmentID INT,
    PRIMARY KEY(projectID),
    FOREIGN KEY(departmentID)
        REFERENCES Departments(departmentID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

ALTER TABLE Employees
ADD CONSTRAINT fk_departmentID
    FOREIGN KEY(departmentID)
        REFERENCES Departments(departmentID)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
ADD CONSTRAINT fk_roomID
    FOREIGN KEY(roomID)
        REFERENCES Rooms(roomID)
        ON UPDATE CASCADE
        ON DELETE SET NULL;

CREATE TABLE Employees_Projects(
    employeeID INT NOT NULL,
    projectID  INT NOT NULL,
    PRIMARY KEY(employeeID, projectID),
    FOREIGN KEY(employeeID)
        REFERENCES Employees(employeeID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY(projectID)
        REFERENCES Projects(projectID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ----------------------- SEED DATA -------------------------
INSERT INTO Employees (name) VALUES ('Tim'), ('Hailey'), ('Chris'), ('Chloe');
UPDATE Employees SET managerID = 4 WHERE employeeID = 1;
UPDATE Employees SET managerID = 3 WHERE employeeID = 2;

INSERT INTO Departments (name, managerID) VALUES ('Dpt1', 4), ('Dpt2', 4), ('Dpt3', 3);
UPDATE Employees SET departmentID = 1 WHERE employeeID IN (1, 2);
UPDATE Employees SET departmentID = 2 WHERE employeeID IN (3, 4);

INSERT INTO Rooms (number, departmentID) VALUES (183, 1), (836, 1), (283, 2), (25, 2);
UPDATE Employees SET roomID = employeeID;

INSERT INTO Projects (progress, startDate, endDate, deadline, departmentID) VALUES (0, "2002-3-1", "2002-5-1", "2002-6-1", 1), (23,"2020-3-1", "2021-2-1", "2021-3-1", 1), (39,"2012-11-15", "2012-12-10", "2012-12-15", 2), (77,"2004-7-24", "2004-8-4", "2004-8-4", 2);

INSERT INTO Employees_Projects (employeeID, projectID) VALUES (1, 1), (2, 1), (2, 2), (3, 3), (4, 4);

-- ----------------------- Get Employees Managers -------------------------
--SELECT  Employees.managerID,
--        Managers.name,
--        GROUP_CONCAT(Employees.name SEPARATOR ', ') employees
--FROM Employees
--LEFT JOIN Employees Managers
--ON Employees.managerID = Managers.employeeID
--WHERE Employees.managerID IS NOT NULL
--GROUP BY Employees.managerID;

-- ----------------------- Get Employees Rooms -------------------------
--SELECT  Employees.name,
--        Rooms.number 'room number'
--FROM Employees
--LEFT JOIN Rooms
--ON Rooms.roomID = Employees.roomID;

-- ----------------------- Get Employees Departments -------------------------
--SELECT  Employees.name,
--        Departments.name
--FROM Employees
--LEFT JOIN Departments
--ON Departments.departmentID = Employees.departmentID;

-- ----------------------- Get Managers Departments -------------------------
--SELECT  Employees.name,
--        GROUP_CONCAT(Departments.name SEPARATOR ', ') departments
--FROM Departments
--LEFT JOIN Employees
--ON Departments.managerID = Employees.employeeID
--GROUP BY Departments.managerID;

-- ----------------------- Get Employees Projects -------------------------
--SELECT  Employees.name,
--        GROUP_CONCAT(Projects.projectID SEPARATOR ', ') projects
--FROM Employees
--LEFT JOIN Employees_Projects ep
--ON ep.employeeID = Employees.employeeID
--LEFT JOIN Projects
--ON Projects.projectID = ep.projectID
--GROUP BY Employees.employeeID;



-- ----------------------- Get Departments Managers -------------------------
--SELECT  Departments.name,
--        GROUP_CONCAT(Employees.name SEPARATOR ', ') managers
--FROM Departments
--LEFT JOIN Employees
--ON Employees.employeeID = Departments.managerID
--GROUP BY Departments.departmentID;

-- ----------------------- Get Departments Employees -------------------------
--SELECT  Departments.name,
--        GROUP_CONCAT(Employees.name SEPARATOR ', ') employees
--FROM Departments
--LEFT JOIN Employees
--ON Employees.departmentID = Departments.departmentID
--GROUP BY Departments.departmentID;

-- ----------------------- Get Departments Rooms -------------------------
--SELECT  Departments.name,
--        GROUP_CONCAT(Rooms.number SEPARATOR ', ') 'room numbers'
--FROM Departments
--LEFT JOIN Rooms
--ON Rooms.departmentID = Departments.departmentID
--GROUP BY Departments.departmentID;

-- ----------------------- Get Departments Projects -------------------------
--SELECT  Departments.name,
--        GROUP_CONCAT(Projects.projectID SEPARATOR ', ') projects
--FROM Departments
--LEFT JOIN Projects
--ON Projects.departmentID = Departments.departmentID
--GROUP BY Departments.departmentID;



-- ----------------------- Get Rooms Employees -------------------------
--SELECT  Rooms.number,
--        GROUP_CONCAT(Employees.name SEPARATOR ', ') employees
--FROM Rooms
--LEFT JOIN Employees
--ON Employees.roomID = Rooms.roomID
--GROUP BY Rooms.roomID;

-- ----------------------- Get Rooms Departments -------------------------
--SELECT  Rooms.number,
--        Departments.name
--FROM Rooms
--LEFT JOIN Departments
--ON Departments.departmentID = Rooms.departmentID;



-- ----------------------- Get Projects Employees -------------------------
--SELECT  Projects.projectID,
--        Projects.progress,
--        GROUP_CONCAT(Employees.name SEPARATOR ', ') employees
--FROM Projects
--LEFT JOIN Employees_Projects ep
--ON ep.projectID = Projects.projectID
--LEFT JOIN Employees
--ON Employees.employeeID = ep.employeeID
--GROUP BY Projects.projectID;

-- ----------------------- Get Projects Departments -------------------------
--SELECT  Projects.projectID,
--        Departments.name
--FROM Projects
--LEFT JOIN Departments
--ON Departments.departmentID = Projects.departmentID;