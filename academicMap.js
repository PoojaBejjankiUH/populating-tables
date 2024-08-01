let academicMaps = {
    programs: []
}
let anyProgramsSaved = false;
const programs = [];

const courses = JSON.parse(localStorage.getItem('courseList')) ?? {};
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
    anyProgramsSaved = programs?.length ? true : false;
    if (anyProgramsSaved) {
        document.getElementById('programs-container').style.display = 'flex';
        document.getElementById('no-programs-found').style.display = 'none';
        displayAcademicMap();
    } else {
        document.getElementById('programs-container').style.display = 'none';
        document.getElementById('no-programs-found').style.display = 'flex';
    }
}

function createProgram(event) {
    if (!programs.includes(event)) {
        programs.push(event);
        const newProgram =
        {
            name: `${event}`,
            years:
                [{
                    "year": 1,
                    "semesterFall": {
                        "courses": [
                        ]
                    },
                    "semesterSpring": {
                        "courses": [
                        ]
                    }

                },
                {
                    "year": 2,
                    "semesterFall": {
                        "courses": [
                        ]
                    },
                    "semesterSpring": {
                        "courses": [
                        ]
                    }
                },
                {
                    "year": 3,
                    "semesterFall": {
                        "courses": [
                        ]
                    },
                    "semesterSpring": {
                        "courses": [
                        ]
                    }
                },
                {
                    "year": 4,
                    "semesterFall": {
                        "courses": [
                        ]
                    },
                    "semesterSpring": {
                        "courses": [
                        ]
                    }
                }]
        };
        academicMaps.programs.push(newProgram);
        fetchPrograms();
    }
}

fetchPrograms();

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
        option.dataset.courseName = course.courseName;
        option.dataset.credits = course.credits;
        courseSelect.appendChild(option);
    });
}

function addCourseToAcademicMap() {
    const year = document.getElementById('year-select').value;
    const semester = document.getElementById('semester-select').value;
    const courseCode = document.getElementById('course-select').value;
    const program = document.getElementsByClassName('nav-link active')[0].innerText;

    const index = academicMaps.programs.findIndex(program => program.name === program)
    academicMaps.programs[index].years.find(years => years.year == year)?.[`${semester}`].courses.push(courseCode);
}
document.getElementById('year-select').addEventListener('change', populateCourseDropdown);
document.getElementById('semester-select').addEventListener('change', populateCourseDropdown);


