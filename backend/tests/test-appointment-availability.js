const {
    checkRequestedSlot
} = require("../src/services/appointmentAvailabilityService");


const run = async () => {

    try {

       const result = await checkRequestedSlot({
    preferredDate: "2026-09-15",
    preferredTime: "10:00"
});

        console.log(
            JSON.stringify(result, null, 2)
        );

    } catch (error) {

        console.error(error);

    }
};


run();