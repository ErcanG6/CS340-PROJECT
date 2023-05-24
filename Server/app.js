/*
 * SETUP
 */

// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
const PORT  = 6427;                 // Set a port number at the top so it's easy to change in the future
const __viewDir = __dirname + '/Views/';

app.use(express.static(__dirname + '/public'));
app.use(express.json({extended: true, limit: '1mb'}));

// Database
var dbManager = require('./Database/DbManager');
var models = require('./Models/Models');

/*
 * ROUTES
 */

app.post('/api/:Action/:Type/', async (req, res) => {
    try {
        json = req.body;
        data = {status: 1};
        
        switch(req.params.Action) {
            case 'Create':
                switch(req.params.Type) {
                    case 'Departments':
                        data.data = await dbManager.InsertDeparment(new models.Department(null, json.name, json.managerID));
                        break;
                    case 'Employees':
                        data.data = await dbManager.InsertEmployee(new models.Employee(null, json.name, json.departmentID, json.managerID, json.roomID));
                        break;
                    case 'EmployeesProjects':
                        data.data = await dbManager.InsertEmployeeProject(new models.EmployeeProject(json.employeeID, json.projectID));
                        break;
                    case 'Projects':
                        data.data = await dbManager.InsertProject(new models.Project(null, json.startDate, json.endDate, json.deadline, json.progress, json.departmentID));
                        break;
                    case 'Rooms':
                        data.data = await dbManager.InsertRoom(new models.Room(null, json.number, json.departmentID));
                        break;
                    default:
                        break;
                }
                break;
            case 'Update':
                switch(req.params.Type) {
                    case 'Departments':
                        data.data = await dbManager.UpdateDeparmentById(new models.Department(json.departmentID, json.name, json.managerID));
                        break;
                    case 'Employees':
                        data.data = await dbManager.UpdateEmployeeById(new models.Employee(json.employeeID, json.name, json.departmentID, json.managerID, json.roomID));
                        break;
                    case 'EmployeesProjects':
                        data.data = await dbManager.UpdateEmployeeProjectById(new models.EmployeeProject(json.employeeID, json.projectID));
                        break;
                    case 'Projects':
                        data.data = await dbManager.UpdateProjectById(new models.Project(json.projectID, json.startDate, json.endDate, json.deadline, json.progress, json.departmentID));
                        break;
                    case 'Rooms':
                        data.data = await dbManager.UpdateRoomById(new models.Room(json.roomID, json.number, json.departmentID));
                        break;
                    default:
                        break;
                }
                break;
            case 'Delete':
                switch(req.params.Type) {
                    case 'Departments':
                        data.data = await dbManager.DeleteDeparmentById(json.departmentID);
                        break;
                    case 'Employees':
                        data.data = await dbManager.DeleteEmployeeById(json.employeeID);
                        break;
                    case 'EmployeesProjects':
                        data.data = await dbManager.DeleteEmployeeProjectById(json.employeeID, json.projectID);
                        break;
                    case 'Projects':
                        data.data = await dbManager.DeleteProjectById(json.projectID);
                        break;
                    case 'Rooms':
                        data.data = await dbManager.DeleteRoomById(json.roomID);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

        res.json(data);
    } catch (e) {
        res.json({status: 0, error: e});
    }
});

app.get('/api/:Type', async (req, res) => {
    try {
        data = null
        switch(req.params.Type) {
            case 'Departments':
                data = await dbManager.SelectAllDeparments();
                break;
            case 'Employees':
                data = await dbManager.SelectAllEmployees();
                break;
            case 'EmployeesProjects':
                data = await dbManager.SelectAllEmployeesProjects();
                break;
            case 'Projects':
                data = await dbManager.SelectAllProjects();
                break;
            case 'Rooms':
                data = await dbManager.SelectAllRooms();
                break;
            default:
                break;
        }
        
        res.json(data);
    } catch(e) {
        res.json({status: 0, error: e});
    }
});

app.get('/', (req, res) => {
    res.sendFile(__viewDir + 'index.html');
});

app.get('/:Type', (req, res) => {
    switch(req.params.Type) {
        case 'Departments':
            res.sendFile(__viewDir + 'departments.html');
            break;
        case 'Employees':
            res.sendFile(__viewDir + 'employees.html');
            break;
        case 'EmployeesProjects':
            res.sendFile(__viewDir + 'employees_projects.html');
            break;
        case 'Projects':
            res.sendFile(__viewDir + 'projects.html');
            break;
        case 'Rooms':
            res.sendFile(__viewDir + 'rooms.html');
            break;
        default:
            res.sendFile(__viewDir + 'index.html');
            break;
    }
});

/*
 * LISTENER
 */
console.log('Attempting to start server on port ' + PORT);
app.listen(PORT, () => {
    console.log('Express started on port:' + PORT + '.')
});
