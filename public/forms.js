function getSource() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length-1].src
}
const source = getSource();
const server = (source.includes('flip1') ? 'flip1' : (source.includes('flip2') ? 'flip2' : 'flip3'));
function getPort() {
    var start = source.substring(7).indexOf(':') + 1;
    var end = source.substring(start+7).indexOf('/');
    return source.substring(start+7, end+start+7);
}
const port = getPort();
const forms = ['browse', 'insert', 'update', 'delete', 'view'];
const tables = ['Departments', 'Employees', 'EmployeesProjects', 'Projects', 'Rooms'];

function ProgressChanged(element, outputId) {
    document.getElementById(outputId).innerHTML = element.value;
}

function ProcessSQLDate(date) {
    return (date == null ? null : date.substring(0,10));
}

currForm = 0
// switches displays of divs
function changeForm(form) {
    document.getElementById(forms[currForm]).style.display = 'none';
    document.getElementById(forms[form]).style.display = 'block';
    currForm = form;
}

function browseForm()   { changeForm(0); }
function newForm()      { changeForm(1); }

function updateForm(type, data) {
    var form = document.getElementById('updateData');
    switch(type) {
        case 0:
            form.departmentID.value = parseInt(data.departmentID);
            form.name.value = data.name;
            form.managerID.value = parseInt(data.managerID);
            break;
        case 1:
            form.employeeID.value = parseInt(data.employeeID);
            form.name.value = data.name;
            form.departmentID.value = parseInt(data.departmentID);
            form.managerID.value = parseInt(data.managerID);
            form.roomID.value = parseInt(data.roomID);
            break;
        case 2:
            form.oldEmployeeID.value = parseInt(data.employeeID);
            form.oldProjectID.value = parseInt(data.projectID);
            form.employeeID.value = parseInt(data.employeeID);
            form.projectID.value = parseInt(data.projectID);
            break;
        case 3:
            form.projectID.value = parseInt(data.projectID);
            form.startDate.value = data.startDate;
            form.endDate.value = data.endDate;
            form.deadline.value = data.deadline;
            form.progress.value = parseInt(data.progress);
            document.getElementById('updateProgressOutput').innerHTML = data.progress;
            form.departmentID = parseInt(data.departmentID);
            break;
        case 4:
            form.roomID.value = parseInt(data.roomID);
            form.number.value = parseInt(data.number);
            form.departmentID.value = parseInt(data.departmentID);
            break;
        default:
            break;
    }

    changeForm(2);
}

function deleteForm(type, data) {
    var form = document.getElementById('deleteData');
    switch(type) {
        case 0:
            form.departmentID.value = parseInt(data.departmentID);
            form.name.value = data.name;
            break;
        case 1:
            form.employeeID.value = parseInt(data.employeeID);
            form.name.value = data.name;
            break;
        case 2:
            form.employeeID.value = parseInt(data.employeeID);
            form.projectID.value = parseInt(data.projectID);
            break;
        case 3:
            form.projectID.value = parseInt(data.projectID);
            break;
        case 4:
            form.roomID.value = parseInt(data.roomID);
            form.number.value = parseInt(data.number);
            break;
        default:
            break;
    }
    changeForm(3);
}

function viewForm(type, data) {
    var form = document.getElementById('viewData');
    switch(type) {
        case 0:
            form.departmentID.value = parseInt(data.departmentID);
            form.name.value = data.name;
            form.managerID.value = parseInt(data.managerID);
            break;
        case 1:
            form.employeeID.value = parseInt(data.employeeID);
            form.name.value = data.name;
            form.departmentID.value = parseInt(data.departmentID);
            form.managerID.value = parseInt(data.managerID);
            form.roomID.value = parseInt(data.roomID);
            break;
        case 2:
            form.employeeID.value = parseInt(data.employeeID);
            form.projectID.value = parseInt(data.projectID);
            break;
        case 3:
            form.projectID.value = parseInt(data.projectID);
            form.startDate.value = data.startDate;
            form.endDate.value = data.endDate;
            form.deadline.value = data.deadline;
            form.progress.value = parseInt(data.progress);
            form.departmentID.value = parseInt(data.departmentID);
            break;
        case 4:
            form.roomID.value = parseInt(data.roomID);
            form.number.value = parseInt(data.number);
            form.departmentID.value = parseInt(data.departmentID);
            break;
        default:
            break;
    }
    changeForm(4);
}

async function sendRequest(reqType, type, data) {
    //send to api
    var url = '/api/' + reqType + '/' + tables[type];
    var res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    var json = await res.json();
    
    return json;
}

function handleResponse(res) {
    if(res.status == 0) { // error
        console.log(res.error);
        return null;
    } else { // success
        // 'reset' browse table
        resetBrowse();
        return res.data;
    }
}

async function handleData(type, action) {
    var formID = null;
    var requestType = null;
    switch(action) {
        case 0:
            formID = 'createData';
            requestType = 'Create';
            break;
        case 1:
            formID = 'updateData';
            requestType = 'Update';
            break;
        case 2:
            formID = 'deleteData';
            requestType = 'Delete';
            break;
    }
    var form = document.getElementById(formID);
    var formData = new FormData(form);
    var data = Object.fromEntries(formData.entries());

    Object.entries(data).forEach(entry => {
        if(entry[1] == '') data[entry[0]] = 'NULL';
    });
    
    //send request to api, inserting data, and getting response
    var resData = handleResponse(await sendRequest(requestType, type, data));
    if(resData != null) {
        switch(action) {
            case 0:
            case 1:
                try{
                    resData.startDate = ProcessSQLDate(resData.startDate);
                    resData.endDate = ProcessSQLDate(resData.endDate);
                    resData.deadline = ProcessSQLDate(resData.deadline);
                } catch(e) {
                    console.log(e);
                }
                viewForm(type, resData);
                break;
            case 2:
                browseForm();
                break;
        }
    }
}

async function resetBrowse() {
    var table = document.getElementById('browseTable').childNodes[1];
    var head = table.rows[0];
    table.innerHTML = head.outerHTML;
    await getData(parseInt(head.id));
}

async function getData(type) {
    var res = await fetch('http://' + server + '.engr.oregonstate.edu:' + port + '/api/' + tables[type]);
    var data = await res.json();
    
    var table = document.getElementById('browseTable').childNodes[1];
    
    switch(type) {
        case 0: //Departments
            data.forEach(department => {
                table.append(constructDepartmentRow(
                    department.departmentID,
                    department.name,
                    department.managerID
                    ));
            });
            break;
        case 1: //Employees
            data.forEach(employee => {
                table.append(constructEmployeeRow(
                    employee.employeeID,
                    employee.name,
                    employee.departmentID,
                    employee.managerID,
                    employee.roomID
                    ));
            });
            break;
        case 2: //EmployeesProjects
            updateEmployeeProjectOptions();
            data.forEach(empProj => {
                table.append(constructEmployeeProjectRow(
                    empProj.employeeID,
                    empProj.projectID
                    ));
            });
            break;
        case 3: //Projects
            data.forEach(project => {
                table.append(constructProjectRow(
                    project.projectID,
                    project.startDate,
                    project.endDate,
                    project.deadline,
                    project.progress,
                    project.departmentID
                    ));
            });
            break;
        case 4: //Rooms
            data.forEach(room => {
                table.append(constructRoomRow(
                    room.roomID,
                    room.number,
                    room.departmentID
                    ));
            });
            break;
        default:
            break;
    }
}

async function updateEmployeeProjectOptions(type) {
    var resEmp = await fetch('http://' + server + '.engr.oregonstate.edu:' + port + '/api/' + tables[1]);
    var dataEmp = await resEmp.json();
    var resProj = await fetch('http://' + server + '.engr.oregonstate.edu:' + port + '/api/' + tables[3]);
    var dataProj = await resProj.json();
    select = document.querySelectorAll('#employeeSelect');
    select.forEach(form => { // Update options for each form with id=employeeSelect
        dataEmp.forEach(employee => {
            let newOption = new Option(employee.employeeID, employee.employeeID);
            form.add(newOption, undefined);
        });
    });
    select = document.querySelectorAll('#projectSelect');
    select.forEach(form => { // Update options for each form with id=projectSelect
        dataProj.forEach(project => {
            let newOption = new Option(project.projectID, project.projectID);
            form.add(newOption, undefined);
        });
    });
}

function constructDepartmentRow(departmentID, name, managerID) {
    var data = JSON.stringify({departmentID, name, managerID});
    var tableRow = document.createElement('tr');

    var updateRow = document.createElement('td');
    updateRow.innerHTML = '<p onclick=\'updateForm(0,' + data + ')\'>Edit</p>';

    var deleteRow = document.createElement('td');
    deleteRow.innerHTML = '<p onclick=\'deleteForm(0,' + data + ')\'>Delete</p>';

    var viewRow = document.createElement('td');
    viewRow.innerHTML = '<p onclick=\'viewForm(0,' + data + ')\'>View</p>';

    var dptID = document.createElement('td');
    dptID.style.align = "right";
    dptID.innerHTML = '' + departmentID;

    var dptName = document.createElement('td');
    dptName.innerHTML = '' + name;

    var dptManagerID = document.createElement('td');
    dptManagerID.style.align = "right";
    dptManagerID.innerHTML = '' + managerID;

    tableRow.append(viewRow, updateRow, deleteRow, dptID, dptName, dptManagerID);
    return tableRow;
}

function constructEmployeeRow(employeeID, name, departmentID, managerID, roomID) {
    var data = JSON.stringify({employeeID, name, departmentID, managerID, roomID});
    var tableRow = document.createElement('tr');

    var updateRow = document.createElement('td');
    updateRow.innerHTML = '<p onclick=\'updateForm(1,' + data + ')\'>Edit</p>';

    var deleteRow = document.createElement('td');
    deleteRow.innerHTML = '<p onclick=\'deleteForm(1,' + data + ')\'>Delete</p>';

    var viewRow = document.createElement('td');
    viewRow.innerHTML = '<p onclick=\'viewForm(1,' + data + ')\'>View</p>';

    var empID = document.createElement('td');
    empID.style.align = "right";
    empID.innerHTML = '' + employeeID;

    var empName = document.createElement('td');
    empName.innerHTML = '' + name;

    var empDptID = document.createElement('td');
    empDptID.style.align = "right";
    empDptID.innerHTML = '' + departmentID;

    var empManID = document.createElement('td');
    empManID.style.align = "right";
    empManID.innerHTML = managerID;

    var empRoomID = document.createElement('td');
    empRoomID.style.align = "right";
    empRoomID.innerHTML = roomID;

    tableRow.append(viewRow, updateRow, deleteRow, empID, empName, empDptID, empManID, empRoomID);
    return tableRow;
}

function constructEmployeeProjectRow(employeeID, projectID) {
    var data = JSON.stringify({employeeID, projectID});
    var tableRow = document.createElement('tr');

    var updateRow = document.createElement('td');
    updateRow.innerHTML = '<p onclick=\'updateForm(2,' + data + ')\'>Edit</p>';

    var deleteRow = document.createElement('td');
    deleteRow.innerHTML = '<p onclick=\'deleteForm(2,' + data + ')\'>Delete</p>';

    var viewRow = document.createElement('td');
    viewRow.innerHTML = '<p onclick=\'viewForm(2,' + data + ')\'>View</p>';

    var empID = document.createElement('td');
    empID.style.align = "right";
    empID.innerHTML = '' + employeeID;

    var projID = document.createElement('td');
    projID.style.align = "left";
    projID.innerHTML = '' + projectID;

    tableRow.append(viewRow, updateRow, deleteRow, empID, projID);
    return tableRow;
}

function constructProjectRow(projectID, startDate, endDate, deadline, progress, departmentID) {
    startDate = ProcessSQLDate(startDate);
    endDate = ProcessSQLDate(endDate);
    deadline = ProcessSQLDate(deadline);
    var data = JSON.stringify({projectID, startDate, endDate, deadline, progress, departmentID});
    var tableRow = document.createElement('tr');

    var updateRow = document.createElement('td');
    updateRow.innerHTML = '<p onclick=\'updateForm(3,' + data + ')\'>Edit</p>';

    var deleteRow = document.createElement('td');
    deleteRow.innerHTML = '<p onclick=\'deleteForm(3,' + data + ')\'>Delete</p>';

    var viewRow = document.createElement('td');
    viewRow.innerHTML = '<p onclick=\'viewForm(3,' + data + ')\'>View</p>';

    var projID = document.createElement('td');
    projID.style.align = "right";
    projID.innerHTML = '' + projectID;

    var sDate = document.createElement('td');
    sDate.innerHTML = '' + startDate;

    var eDate = document.createElement('td');
    eDate.innerHTML = '' + endDate;

    var dDate = document.createElement('td');
    dDate.innerHTML = '' + deadline;

    var pgrs = document.createElement('td');
    pgrs.innerHTML = '' + progress;

    var dptID = document.createElement('td');
    dptID.innerHTML = '' + departmentID;

    tableRow.append(viewRow, updateRow, deleteRow, projID, sDate, eDate, dDate, pgrs, dptID);
    return tableRow;
}

function constructRoomRow(roomID, number, departmentID) {
    var data = JSON.stringify({roomID, number, departmentID});
    var tableRow = document.createElement('tr');

    var updateRow = document.createElement('td');
    updateRow.innerHTML = '<p onclick=\'updateForm(4,' + data + ')\'>Edit</p>';

    var deleteRow = document.createElement('td');
    deleteRow.innerHTML = '<p onclick=\'deleteForm(4,' + data + ')\'>Delete</p>';

    var viewRow = document.createElement('td');
    viewRow.innerHTML = '<p onclick=\'viewForm(4,' + data + ')\'>View</p>';

    var rID = document.createElement('td');
    rID.style.align = "right";
    rID.innerHTML = '' + roomID;

    var roomNum = document.createElement('td');
    roomNum.style.align = "right";
    roomNum.innerHTML = '' + number;

    var dptID = document.createElement('td');
    dptID.style.align = "right";
    dptID.innerHTML = '' + departmentID;

    tableRow.append(viewRow, updateRow, deleteRow, rID, roomNum, dptID);
    return tableRow;
}