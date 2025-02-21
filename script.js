let selectedFiles = [];
let currentCropper = null;
let currentImageIndex = null;

const dropZone = document.getElementById('dropZone');
const selectAllCheckbox = document.getElementById('selectAll');
const deleteSelectedButton = document.getElementById('deleteSelected');
const selectionControls = document.querySelector('.selection-controls');
const previewArea = document.getElementById('imagePreview');
const loadingOverlay = document.querySelector('.loading-overlay');
const processButton = document.getElementById('processButton');
const dateInput = document.getElementById('dateInput');

// Previne o comportamento padrão de drag & drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	dropZone.addEventListener(eventName, preventDefaults, false);
	document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
	e.preventDefault();
	e.stopPropagation();
}

// Adiciona visual feedback
['dragenter', 'dragover'].forEach(eventName => {
	dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
	dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
	dropZone.classList.add('drag-over');
}

function unhighlight(e) {
	dropZone.classList.remove('drag-over');
}

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
	const dt = e.dataTransfer;
	const files = dt.files;

	if (files.length > 25) {
		alert('Por favor, selecione no máximo 25 imagens.');
		return;
	}

	handleFiles(files);
}

function handleFiles(files) {
	files = [...files];
	selectedFiles = files;
	displayPreviews(files);
	updateProcessButton();
}

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

// Função para verificar se todos os elementos necessários existem
function checkRequiredElements() {
	const elements = {
		dropZone,
		selectAllCheckbox,
		deleteSelectedButton,
		selectionControls,
		previewArea,
		loadingOverlay
	};

	for (const [name, element] of Object.entries(elements)) {
		if (!element) {
			console.error(`Elemento não encontrado: ${name}`);
			return false;
		}
	}
	return true;
}

function displayPreviews(files) {
	if (!checkRequiredElements()) {
		console.error('Elementos necessários não encontrados');
		return;
	}

	// Mostrar loading
	loadingOverlay.style.display = 'flex';
	previewArea.innerHTML = '';

	// Só mostrar os controles de seleção se houver arquivos
	if (files && files.length > 0) {
		selectionControls.style.display = 'flex';
	} else {
		selectionControls.style.display = 'none';
	}

	const promises = files.map((file, index) => {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = function (e) {
				const container = document.createElement('div');
				container.className = 'preview-container';

				// Checkbox para seleção
				const checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.className = 'select-checkbox';
				checkbox.addEventListener('change', updateDeleteButton);

				const img = document.createElement('img');
				img.src = e.target.result;

				const editButton = document.createElement('button');
				editButton.className = 'edit-button';
				editButton.textContent = 'Editar';
				editButton.onclick = () => openCropModal(index);

				container.appendChild(checkbox);
				container.appendChild(img);
				container.appendChild(editButton);
				previewArea.appendChild(container);
				resolve();
			};
			reader.readAsDataURL(file);
		});
	});

	// Esconder loading quando todas as imagens forem carregadas
	Promise.all(promises).then(() => {
		loadingOverlay.style.display = 'none';
		updateProcessButton();
	});
}

function updateDeleteButton() {
	if (!deleteSelectedButton) return;

	const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
	deleteSelectedButton.disabled = selectedCheckboxes.length === 0;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
	if (!checkRequiredElements()) return;

	selectAllCheckbox.addEventListener('change', (e) => {
		const checkboxes = document.querySelectorAll('.select-checkbox');
		checkboxes.forEach(checkbox => {
			checkbox.checked = e.target.checked;
			checkbox.closest('.preview-container').classList.toggle('selected', e.target.checked);
		});
		updateDeleteButton();
	});

	deleteSelectedButton.addEventListener('click', () => {
		const newFiles = [];

		selectedFiles.forEach((file, index) => {
			const checkboxes = document.querySelectorAll('.select-checkbox');
			if (checkboxes[index] && !checkboxes[index].checked) {
				newFiles.push(file);
			}
		});

		selectedFiles = newFiles;
		displayPreviews(selectedFiles);
		updateProcessButton();
	});
});

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

	const processButton = document.getElementById('processButton');
	const buttonContent = processButton.querySelector('.button-content');
	const buttonLoader = processButton.querySelector('.button-loader');

	// Mostrar loading
	buttonContent.style.display = 'none';
	buttonLoader.style.display = 'block';
	processButton.disabled = true;

	try {
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
			const padding = 5;

			// Posicionar o texto
			const xPosition = canvas.width - textWidth - 10;
			const yPosition = 25;

			// Desenhar o fundo branco
			ctx.fillStyle = 'white';
			ctx.fillRect(
				xPosition - padding,
				yPosition - 20,
				textWidth + (padding * 2),
				30
			);

			// Desenhar o texto
			ctx.fillStyle = 'black';
			ctx.fillText(date, xPosition, yPosition);

			processedImages.push({
				name: file.name,
				data: canvas.toDataURL('image/jpeg', 0.9)
			});
		}

		document.getElementById('downloadButton').disabled = false;
		window.processedImages = processedImages;
	} catch (error) {
		alert('Erro ao processar as imagens: ' + error.message);
	} finally {
		// Esconder loading
		buttonContent.style.display = 'block';
		buttonLoader.style.display = 'none';
		processButton.disabled = false;
	}
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

// Atualizar o botão de processar
function updateProcessButton() {
	if (!processButton || !dateInput) return;

	const hasImages = selectedFiles.length > 0;
	const hasDate = dateInput.value.trim() !== '';

	processButton.disabled = !(hasImages && hasDate);
}

if (dateInput) {
	dateInput.addEventListener('input', updateProcessButton);
} 