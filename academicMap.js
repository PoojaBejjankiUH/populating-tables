let academicMaps = JSON.parse(localStorage.getItem('academicMaps')) || { programs: [] };
let programs = academicMaps.programs.map(p => p.name);
const courses = JSON.parse(localStorage.getItem('courseList')) ?? [];
const electives = JSON.parse(localStorage.getItem('electivesList')) ?? {};

function displayAcademicMap() {
    const programTabs = document.getElementById('programTabs');
    const programTabsContent = document.getElementById('programTabsContent');
    programTabs.innerHTML = '';
    programTabsContent.innerHTML = '';
    programs.forEach((program, index) => {
        // Create tab
        const tab = document.createElement('li');
        tab.className = 'nav-item';
        tab.innerHTML = `
                <a class="nav-link ${index === 0 ? 'active' : ''}" id="tab-${index}" data-toggle="tab" href="#content-${index}" role="tab" aria-controls="content-${index}" aria-selected="${index === 0 ? 'true' : 'false'}">${program}</a>
            `;
        programTabs.appendChild(tab);
    
        // Create tab content
        const tabContent = document.createElement('div');
        tabContent.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
        tabContent.id = `content-${index}`;
        tabContent.setAttribute('role', 'tabpanel');
        tabContent.setAttribute('aria-labelledby', `tab-${index}`);
        programTabsContent.appendChild(tabContent);
    });
}

function fetchPrograms() {
    const anyProgramsSaved = programs.length > 0;
    if (anyProgramsSaved) {
        document.getElementById('programs-container').style.display = 'flex';
        document.getElementById('no-programs-found').style.display = 'none';
        displayAcademicMap();
    } else {
        document.getElementById('programs-container').style.display = 'none';
        document.getElementById('no-programs-found').style.display = 'flex';
    }
}

function createProgram() {
    const programName = document.getElementById('programInput').value.trim();
    if (programName && !programs.includes(programName)) {
        programs.push(programName);
        const newProgram = {
            name: programName,
            years: [
                { year: 1, semesterFall: { courses: [] }, semesterSpring: { courses: [] } },
                { year: 2, semesterFall: { courses: [] }, semesterSpring: { courses: [] } },
                { year: 3, semesterFall: { courses: [] }, semesterSpring: { courses: [] } },
                { year: 4, semesterFall: { courses: [] }, semesterSpring: { courses: [] } }
            ]
        };
        academicMaps.programs.push(newProgram);
        localStorage.setItem('programs', JSON.stringify(programs));
        localStorage.setItem('academicMaps', JSON.stringify(academicMaps));
        fetchPrograms();
    } else {
        alert("Program name is either empty or already exists.");
    }
}

function populateCourseDropdown() {
    const yearSelect = document.getElementById('year-select');
    const semesterSelect = document.getElementById('semester-select');
    const courseSelect = document.getElementById('course-select');

    const year = yearSelect.value;
    const semester = semesterSelect.value;

    if (year === "" || semester === "") {
        return;
    }

    // Fetch the available courses
    const allCourses = [...courses, ...Object.values(electives).flat()];
    
    courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
    allCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.courseCode;
        option.textContent = `${course.courseCode} - ${course.courseName}`;
        courseSelect.appendChild(option);
    });
}

function addCourseToAcademicMap() {
    const year = document.getElementById('year-select').value;
    const semester = document.getElementById('semester-select').value;
    const courseCode = document.getElementById('course-select').value;
    const programName = document.querySelector('.nav-link.active').innerText;

    const programIndex = academicMaps.programs.findIndex(p => p.name === programName);
    if (programIndex !== -1) {
        const yearData = academicMaps.programs[programIndex].years.find(y => y.year == year);
        if (yearData && courseCode) {
            yearData[semester].courses.push(courseCode);
            localStorage.setItem('academicMaps', JSON.stringify(academicMaps));
            alert("Course added successfully!");
        } else {
            alert("Please select a valid course.");
        }
    } else {
        alert("Program not found.");
    }
}

document.getElementById('year-select').addEventListener('change', populateCourseDropdown);
document.getElementById('semester-select').addEventListener('change', populateCourseDropdown);
document.addEventListener('DOMContentLoaded', fetchPrograms);
