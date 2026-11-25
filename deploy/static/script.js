const fileInput = document.getElementById('fileInput');
const uploadForm = document.getElementById('uploadForm');
const outputDiv = document.getElementById('output');

fileInput.addEventListener('change', () => {
    outputDiv.innerHTML = ''; // Clear output before new upload
});

uploadForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!fileInput.files.length) {
        alert('Please select an image.');
        return;
    }

    document.getElementById('wavyLoader').style.display = 'flex';

    // Clear previous contents of both rows
    document.getElementById('top-row').innerHTML = '';
    document.getElementById('bottom-row').innerHTML = '';

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    const selectedModel = document.getElementById('modelSelect').value;
    formData.append('model', selectedModel);

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        // Content image URL
        const contentImageUrl = URL.createObjectURL(fileInput.files[0]);
        // Style image URL, loaded from your STATIC folder or a known location
        // Assuming your style images are served somewhere accessible, e.g., '/static/styles/<model>.jpg'
        const styleImageUrl = `/static/styles/${selectedModel}.jpg`;

        // Stylized output URL
        const outputImageUrl = '/get_image/' + encodeURIComponent(data.output_image_path.split('/').pop());

        // Create and append content image container
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('image-container');
        contentDiv.innerHTML = `<img src="${contentImageUrl}" alt="Content Image"><div class="image-caption">Content Image</div>`;

        // Create and append style image container
        const styleDiv = document.createElement('div');
        styleDiv.classList.add('image-container');
        styleDiv.innerHTML = `<img src="${styleImageUrl}" alt="Style Image"><div class="image-caption">Style Image</div>`;

        // Append to top row
        document.getElementById('top-row').appendChild(contentDiv);
        document.getElementById('top-row').appendChild(styleDiv);

        // Create and append stylized output image container to bottom row
        const outputDiv = document.createElement('div');
        outputDiv.classList.add('image-container');
        outputDiv.style.margin = '0 auto';
        outputDiv.innerHTML = `<img src="${outputImageUrl}" alt="Stylized Image"><div class="image-caption">Stylized Output Image</div>`;

        document.getElementById('bottom-row').appendChild(outputDiv);

    } catch (error) {
        alert('There was an error during stylization. Please try again.');
        console.error(error);
    } finally {
        document.getElementById('wavyLoader').style.display = 'none';
    }
});

// Example toggle
 // show
// or
 // hide
