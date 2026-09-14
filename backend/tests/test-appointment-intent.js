const {
    getAppointmentIntent
} = require("../src/services/appointmentIntentService");

const tests = [

    {
        name: "No appointment request",

        data: {
            wantsAppointment: false,
            preferredDate: null,
            preferredTime: null
        }
    },

    {
        name: "Appointment but no date",

        data: {
            wantsAppointment: true,
            preferredDate: null,
            preferredTime: null
        }
    },

    {
        name: "Date but no time",

        data: {
            wantsAppointment: true,
            preferredDate: "2026-09-14",
            preferredTime: null
        }
    },

    {
        name: "Date and time available",

        data: {
            wantsAppointment: true,
            preferredDate: "2026-09-14",
            preferredTime: "10:00"
        }
    }
];

for (const test of tests) {

    console.log(`\n${test.name}`);

    console.log(
        getAppointmentIntent(test.data)
    );
}