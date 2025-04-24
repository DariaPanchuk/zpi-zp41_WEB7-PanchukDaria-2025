import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { convertMs, addLeadingZero } from "./utils.js";
import "./timer.css";

const refs = {
    dateTimePicker: document.querySelector("#datetime-picker"),
    startButton: document.querySelector("[data-start]"),
    days: document.querySelector("[data-days]"),
    hours: document.querySelector("[data-hours]"),
    minutes: document.querySelector("[data-minutes]"),
    seconds: document.querySelector("[data-seconds]"),
};

let userSelectedDate = null;
let timerId = null;
refs.startButton.setAttribute("disabled", true);

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        if (selectedDate <= new Date()) {
            iziToast.error({
                title: 'Error',
                message: 'Illegal operation',
                backgroundColor: '#F44336',
                titleColor: '#ffffff',
                messageColor: '#ffffff',
                close: true,
                progressBar: true,
                progressBarColor: '#B51B1B',
                position: 'topRight',
                timeout: 50000,
                class: 'custom-error-toast',
            });
            refs.startButton.setAttribute("disabled", true);
            refs.dateTimePicker.removeAttribute("disabled");
        } else {
            userSelectedDate = selectedDate;
            refs.startButton.removeAttribute("disabled");
        }
    },
};

flatpickr(refs.dateTimePicker, options);

function startTimer() {
    if (!userSelectedDate) return;

    refs.startButton.setAttribute("disabled", true);
    refs.dateTimePicker.setAttribute("disabled", true);

    timerId = setInterval(() => {
        const timeLeft = userSelectedDate - new Date();
        if (timeLeft <= 0) {
            clearInterval(timerId);
            iziToast.success({
                title: "Finished",
                message: "Countdown reached zero!",
            });
            refs.startButton.setAttribute("disabled", true);
            refs.dateTimePicker.removeAttribute("disabled");
            updateTimer(0);
        } else {
            updateTimer(timeLeft);
        }
    }, 1000);
}

function updateTimer(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);
    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
}

document.querySelector("[data-start]").addEventListener("click", startTimer);