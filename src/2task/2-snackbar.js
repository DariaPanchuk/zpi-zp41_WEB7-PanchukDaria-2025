import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import "./snackbar.css";

const refs = {
    form: document.querySelector('.form'),
    delay: document.querySelector('[name="delay"]'),
    state: document.querySelectorAll('[name="state"]'),
    submit: document.querySelector(".submit-btn"),
}

function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve({ delay });
            } else {
                reject({ delay });
            }
        }, delay);
    });
}

function submitForm() {
    refs.form.addEventListener("submit", (event) => {
        event.preventDefault();
        const delay = Number(refs.delay.value);
        const state = Array.from(refs.state).find(input => input.checked)?.value;
    
        createPromise(delay, state)
        .then(({ delay }) => {
            iziToast.success({
                title: 'Success',
                message: `Fulfilled promise in ${delay}ms`,
                position: 'topRight',
                backgroundColor: '#59A10D',
                titleColor: '#ffffff',
                messageColor: '#ffffff',
                close: true,
                progressBar: true,
                progressBarColor: '#326101',
                position: 'topRight',
                timeout: delay,
                class: 'custom-success-toast',
            });
        })
        .catch(({ delay }) => {
            iziToast.error({
                title: 'Error',
                message: `Rejected promise in ${delay}ms`,
                backgroundColor: '#F44336',
                titleColor: '#ffffff',
                messageColor: '#ffffff',
                close: true,
                progressBar: true,
                progressBarColor: '#9C1C1C',
                position: 'topRight',
                timeout: delay,
                class: 'custom-error-toast',
            });
        });
    
        refs.form.reset();
    });
}

submitForm();