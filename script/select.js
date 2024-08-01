//select enabel/desabel
document.addEventListener('DOMContentLoaded', function() {
    const customSelectWrappers = document.querySelectorAll('.custom-select-wrapper');

    customSelectWrappers.forEach(wrapper => {
        const selectElement = wrapper.querySelector('.custom-select');
        const customSelectTrigger = wrapper.querySelector('.custom-select-trigger');

        // Create a custom options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-select-options';

        // Populate custom options container with options from the native select
        Array.from(selectElement.options).forEach(option => {
            const customOption = document.createElement('div');
            customOption.className = 'option';
            customOption.textContent = option.textContent;
            customOption.addEventListener('click', function() {
                selectElement.value = option.value;
                selectElement.dispatchEvent(new Event('change'));
                optionsContainer.style.display = 'none';
            });
            optionsContainer.appendChild(customOption);
        });

        wrapper.appendChild(optionsContainer);

        // Toggle custom options container visibility on trigger click
        customSelectTrigger.addEventListener('click', function() {
            const isVisible = optionsContainer.style.display === 'block';
            optionsContainer.style.display = isVisible ? 'none' : 'block';
        });

        // Close custom options container when clicking outside
        document.addEventListener('click', function(event) {
            if (!wrapper.contains(event.target)) {
                optionsContainer.style.display = 'none';
            }
        });
    });
});