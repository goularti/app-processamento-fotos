let selectedFiles = [];
let currentCropper = null;
let currentImageIndex = null;

document.getElementById('imageInput').addEventListener('change', handleFileSelect);
document.getElementById('processButton').addEventListener('click', processImages);
document.getElementById('downloadButton').addEventListener('click', downloadImages);

function handleFileSelect(event) {
	const files = Array.from(event.target.files);

	if (files.length > 25) {
		alert('Por favor, selecione no máximo 25 imagens.');
		return;
	}

	selectedFiles = files;
	displayPreviews(files);
}

function displayPreviews(files) {
	const previewArea = document.getElementById('imagePreview');
	previewArea.innerHTML = '';

	files.forEach((file, index) => {
		const reader = new FileReader();
		reader.onload = function (e) {
			const container = document.createElement('div');
			container.className = 'preview-container';

			const img = document.createElement('img');
			img.src = e.target.result;

			const editButton = document.createElement('button');
			editButton.className = 'edit-button';
			editButton.textContent = 'Editar';
			editButton.onclick = () => openCropModal(index);

			container.appendChild(img);
			container.appendChild(editButton);
			previewArea.appendChild(container);
		}
		reader.readAsDataURL(file);
	});
}

function openCropModal(index) {
	currentImageIndex = index;
	const modal = document.getElementById('cropModal');
	const cropImage = document.getElementById('cropImage');

	const reader = new FileReader();
	reader.onload = function (e) {
		cropImage.src = e.target.result;
		modal.style.display = 'block';

		if (currentCropper) {
			currentCropper.destroy();
		}

		currentCropper = new Cropper(cropImage, {
			aspectRatio: NaN, // Livre
			viewMode: 1,
			autoCropArea: 1,
		});
	}
	reader.readAsDataURL(selectedFiles[index]);
}

// Fechar modal
document.querySelector('.close').onclick = function () {
	document.getElementById('cropModal').style.display = 'none';
	if (currentCropper) {
		currentCropper.destroy();
		currentCropper = null;
	}
}

// Botão de cortar
document.getElementById('cropButton').onclick = function () {
	if (!currentCropper) return;

	const canvas = currentCropper.getCroppedCanvas();
	canvas.toBlob((blob) => {
		const file = new File([blob], selectedFiles[currentImageIndex].name, {
			type: 'image/jpeg',
			lastModified: new Date().getTime()
		});

		selectedFiles[currentImageIndex] = file;
		displayPreviews(selectedFiles);

		document.getElementById('cropModal').style.display = 'none';
		currentCropper.destroy();
		currentCropper = null;
	}, 'image/jpeg');
}

async function processImages() {
	const date = document.getElementById('dateInput').value;
	if (!date) {
		alert('Por favor, insira uma data.');
		return;
	}

	const processedImages = [];

	for (const file of selectedFiles) {
		const img = await createImage(file);
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = img.width;
		canvas.height = img.height;

		// Desenhar a imagem
		ctx.drawImage(img, 0, 0);

		// Configurar o estilo do texto
		ctx.font = '20px Arial';

		// Calcular a largura do texto
		const textWidth = ctx.measureText(date).width;
		const padding = 5; // Padding para o fundo branco

		// Posicionar o texto
		const xPosition = canvas.width - textWidth - 10;
		const yPosition = 25;

		// Desenhar o fundo branco
		ctx.fillStyle = 'white';
		ctx.fillRect(
			xPosition - padding,
			yPosition - 20, // Subtrai 20 para cobrir a altura do texto
			textWidth + (padding * 2), // Largura do texto + padding dos dois lados
			30 // Altura do retângulo
		);

		// Desenhar o texto
		ctx.fillStyle = 'black'; // Cor do texto
		ctx.fillText(date, xPosition, yPosition);

		processedImages.push({
			name: file.name,
			data: canvas.toDataURL('image/jpeg', 0.9)
		});
	}

	document.getElementById('downloadButton').disabled = false;
	window.processedImages = processedImages;
}

function createImage(file) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = URL.createObjectURL(file);
	});
}

async function downloadImages() {
	const zip = new JSZip();
	const processedImages = window.processedImages;

	processedImages.forEach((image, index) => {
		const base64Data = image.data.replace(/^data:image\/\w+;base64,/, "");
		zip.file(`processed_${image.name}`, base64Data, { base64: true });
	});

	const content = await zip.generateAsync({ type: "blob" });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(content);
	link.download = 'processed_images.zip';
	link.click();
} 