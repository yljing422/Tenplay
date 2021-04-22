(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

// function addHrefToDirection(court) {
//     const direction = document.getElementById("direction");
//     console.log(direction)
//     direction.setAttribute("href", `https://www.google.com/maps/place/${court.name},+${court.city},+${court.state}`);
// }

// document.getElementById("click").onClick = function() {
//     var link = document.getElementById("direction");
//     link.setAttribute("href", `https://www.google.com/maps/place/${court.name},+${court.city},+${court.state}`);
// }