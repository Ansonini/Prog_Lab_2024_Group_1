// function loadScript(scriptUrl) {
//     // Remove any existing script element
//     const existingScript = document.getElementById('dynamicScript');
//     if (existingScript) {
//         existingScript.remove();
//     }

//     // Create a new script element
//     const script = document.createElement('script');
//     script.src = scriptUrl;
//     script.id = 'dynamicScript';
//     document.body.appendChild(script);
// }

// loadScript('assets/js/jgTesting1.js');

// // Set up event listeners for buttons
// document.getElementById('loadJs1').addEventListener('click', () => loadScript('assets/js/jgTesting1.js'));
// document.getElementById('loadJs2').addEventListener('click', () => loadScript('assets/js/jgTesting2.js'));
// document.getElementById('loadJs3').addEventListener('click', () => loadScript('assets/js/jgTesting3.js'));

// declare the upcoming request so that they can be canceled and replaced
var currentAjaxRequest1 = null;
var currentAjaxRequest2 = null;
var currentAjaxRequest3 = null;
var currentAjaxRequest4 = null;
var currentAjaxRequest5 = null;

function loadTab(jsFile, tabElement) {
    // Remove 'selected' class from all tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('selected'));
    
    // Add 'selected' class to the clicked tab
    tabElement.classList.add('selected');
    
    // Create a script element
    const script = document.createElement('script');
    script.src = jsFile;
    
    // Remove any existing script elements
    document.querySelectorAll('script[data-dynamic]').forEach(s => s.remove());
    
    // Mark the new script element as dynamic
    script.setAttribute('data-dynamic', 'true');
    
    // Append the new script to the body
    document.body.appendChild(script);
}



// Load the default tab (first tab) on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tab').click();
});


// function to open and close the sidebar
function openSideBar() {
    document.getElementById("sidebar").style.width = "40%";
}

function closeSideBar() {
    document.getElementById("sidebar").style.width = "0";
}
// Saving the Text in the Note Section as a .txt file
function saveText() {
    const noteText = document.getElementById('noteField').value;

    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);

    const blob = new Blob([noteText], {type: 'text/plain'});

    const link = document.createElement('a');

    link.download = `note_${formattedDate}.txt`

    link.href = window.URL.createObjectURL(blob);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

// Saving all the graphs as images
function saveGraphs() {
    const charts = document.querySelectorAll('.chart-container');
    charts.forEach((chart, index) => {
        html2canvas(chart, {
            backgroundColor: '#FFFFFF', // Set background color to white
            onrendered: function(canvas) {
                const link = document.createElement('a');
                link.download = `chart_${index + 1}.jpeg`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        });
    });
}