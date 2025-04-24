import axios from 'axios';

const fetch = async (query, page) => {
    const accessKey = "31440578-d40e7eed5873a4f1028e16656";
    const response = await axios.get(
        `https://pixabay.com/api/`, {
        params: {
            key: accessKey,
            q: query,
            page,
            per_page: 9,
            orientation: 'horizontal',
        },
    });
    return response.data;
}

export { fetch };