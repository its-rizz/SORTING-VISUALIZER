// Variables for array and animation speed
let array = [];
let arraySize = 38;
let delay = 30;
let paused = false; // To control the pause/resume behavior
let sortingInProgress = false; // To check if sorting is in progress
let sortInterval; // To store the interval ID for sorting

// Array and speed control elements
const arraySizeInput = document.getElementById("arraySize");
const arraySizeValue = document.getElementById("arraySizeValue");
const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const comparisonSound = document.getElementById("comparisonSound");
const swapSound = document.getElementById("swapsound");

// Add event listeners to each button to change color on click
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveButton(button);
  });
});

// Update the displayed array size and animation speed
function updateArraySize() {
  arraySize = arraySizeInput.value;
  arraySizeValue.textContent = arraySize;
  generateArray();
}

function updateSpeed() {
  delay = 200 - speedInput.value;
  speedValue.textContent = `${delay} ms`;
}

// Generate a new random array and display it
function generateArray() {
  array = Array.from(
    { length: arraySize },
    () => Math.floor(Math.random() * 500) + 10
  );
  displayArray();
}

function disableButtons() {
  // Get all buttons and disable them
  const buttons = document.querySelectorAll(".action-btn");
  buttons.forEach((button) => (button.disabled = true));
}

function enableButtons() {
  // Get all buttons and enable them
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = false));
}

function enableCurrent(currentButton) {
  const button = document.getElementById(currentButton);
  if (button) {
    button.disabled = false;
  }
}

function displayArray(
  highlightedIndices = [],
  sortedIndices = [],
  allSorted = false
) {
  const container = document.getElementById("barsContainer");
  container.innerHTML = "";
  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;

    // Highlight the bar if it's in the highlightedIndices
    if (highlightedIndices.includes(index)) {
      bar.classList.add("highlight");
    }

    // Mark the bar as sorted if it's in the sortedIndices
    if (sortedIndices.includes(index)) {
      bar.classList.add("sorted");
    }

    // Change the color of all bars if sorting is complete
    if (allSorted) {
      bar.classList.add("final");
    }

    // Create label for height
    const label = document.createElement("div");
    label.classList.add("bar-label");
    label.innerText = value;
    bar.appendChild(label);

    container.appendChild(bar);
  });
}

// Sleep function to create delay for animations
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Refresh the array (reset to random values)
function refreshArray() {
  location.reload();
  enableButtons(); // Re-enable the sort buttons
}

// Swap function
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

async function bubbleSort() {
  disableButtons();
  enableCurrent("bubbleSortButton");
  paused = false;
  sortingInProgress = true;
  currentSortFunction = bubbleSort;
  let sortedIndices = []; // Track sorted elements

  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      const largerIndex = array[j] > array[j + 1] ? j : j + 1;
      displayArray([largerIndex], sortedIndices); // Highlight larger element and sorted elements

      comparisonSound.play();
      comparisonSound.play();
      comparisonSound.play();
      if (array[j] > array[j + 1]) {
        swap(array, j, j + 1);
        swapSound.play();
        comparisonSound.play();
        comparisonSound.play();
      }
      await sleep(delay);
    }

    // After each pass, mark the last unsorted element as sorted
    sortedIndices.push(array.length - i - 1);
    comparisonSound.play();
    displayArray([], sortedIndices); // Update display with newly sorted elements
  }

  // Final call to displayArray with allSorted flag set to true
  displayArray([], [], true);

  sortingInProgress = false;
  bubbleSortButton.classList.remove("clicked-btn");
  enableButtons();
}

// Selection Sort
async function selectionSort() {
  disableButtons();
  enableCurrent("selectionSortButton");
  paused = false;
  sortingInProgress = true;
  currentSortFunction = selectionSort;
  let sortedIndices = []; // Array to track sorted elements

  for (let i = 0; i < array.length; i++) {
    let minIdx = i;

    // Find the index of the minimum element in the remaining unsorted portion
    for (let j = i + 1; j < array.length; j++) {
      // Highlight the currently compared element and the minimum index
      displayArray([j, minIdx], sortedIndices);
      await sleep(delay);

      if (array[j] < array[minIdx]) {
        minIdx = j;
        displayArray([minIdx], sortedIndices); // Update display with new minimum
        await sleep(delay);
      }
    }

    // Swap the found minimum element with the first unsorted element
    swap(array, i, minIdx);

    // Mark the current element as sorted
    sortedIndices.push(i);
    displayArray([], sortedIndices); // Update display with sorted elements
    await sleep(delay);
  }

  // Final call to displayArray with allSorted flag to indicate sorting completion
  displayArray([], [], true);

  sortingInProgress = false;
  enableButtons();
}

async function insertionSort() {
  disableButtons();
  enableCurrent("insertionSortButton");
  paused = false;
  sortingInProgress = true;
  currentSortFunction = insertionSort;
  let sortedIndices = []; // Track sorted elements

  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    // Start moving elements greater than `key` one position ahead
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];

      // Highlight the current and previous elements being compared
      displayArray([j, j + 1], sortedIndices);
      await sleep(delay);

      j--;
    }

    // Insert `key` at the correct position
    array[j + 1] = key;

    // Mark elements from 0 to `i` as sorted
    sortedIndices.push(i);
    displayArray([], sortedIndices);
    await sleep(delay);
  }

  // Final call to displayArray with allSorted flag set to true
  displayArray([], [], true);

  sortingInProgress = false;
  enableButtons();
}

async function mergeSort() {
  disableButtons();
  enableCurrent("mergeSortButton");
  paused = false;
  sortingInProgress = true;
  currentSortFunction = mergeSort;
  await mergeSortHelper(0, array.length - 1);
  displayArray(
    [],
    array.map((_, index) => index),
    true
  ); // Display final sorted array
  sortingInProgress = false;
  enableButtons();
}

async function mergeSortHelper(left, right) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSortHelper(left, mid);
  await mergeSortHelper(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  let leftArr = array.slice(left, mid + 1);
  let rightArr = array.slice(mid + 1, right + 1);
  let i = 0,
    j = 0,
    k = left;

  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] <= rightArr[j]) {
      array[k] = leftArr[i];
      i++;
    } else {
      array[k] = rightArr[j];
      j++;
    }
    displayArray([], getSortedIndices(left, right)); // Highlight sorted subarray so far
    await sleep(delay);
    k++;
  }

  // Copy remaining elements of leftArr
  while (i < leftArr.length) {
    array[k] = leftArr[i];
    i++;
    displayArray([], getSortedIndices(left, right)); // Highlight sorted subarray so far
    await sleep(delay);
    k++;
  }

  // Copy remaining elements of rightArr
  while (j < rightArr.length) {
    array[k] = rightArr[j];
    j++;
    displayArray([], getSortedIndices(left, right)); // Highlight sorted subarray so far
    await sleep(delay);
    k++;
  }
}

// Helper function to get indices of the sorted subarray
function getSortedIndices(left, right) {
  const sortedIndices = [];
  for (let i = left; i <= right; i++) {
    sortedIndices.push(i);
  }
  return sortedIndices;
}

async function quickSort() {
  disableButtons();
  enableCurrent("quickSortButton");
  paused = false;
  sortingInProgress = true;
  currentSortFunction = quickSort;
  await quickSortHelper(0, array.length - 1);
  displayArray(
    [],
    array.map((_, index) => index),
    true
  ); // Display all elements as sorted
  sortingInProgress = false;
  enableButtons();
}

async function quickSortHelper(left, right) {
  if (left >= right) return;

  let pivotIdx = await partition(left, right);

  // Highlight sorted portion for this recursive call
  displayArray([], getSortedIndices(left, pivotIdx)); // Left side as sorted
  await quickSortHelper(left, pivotIdx - 1);

  displayArray([], getSortedIndices(pivotIdx + 1, right)); // Right side as sorted
  await quickSortHelper(pivotIdx + 1, right);
}

async function partition(left, right) {
  let pivot = array[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (array[j] < pivot) {
      i++;
      swap(array, i, j);

      // Display current comparison and pivot
      displayArray([i, j], [right]); // Highlight pivot and swap
      await sleep(delay);
    }
  }

  // Swap pivot to its correct location and highlight
  swap(array, i + 1, right);
  displayArray([i + 1], [right], true); // Final position for pivot
  await sleep(delay);

  return i + 1;
}

// Helper function to get indices of the sorted subarray
function getSortedIndices(left, right) {
  const sortedIndices = [];
  for (let i = left; i <= right; i++) {
    sortedIndices.push(i);
  }
  return sortedIndices;
}

async function heapSort() {
  disableButtons();
  enableCurrent("heapSortButton");
  paused = false;
  sortingInProgress = true;
  currentSortFunction = heapSort;

  // Build the heap (starting from the last non-leaf node)
  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    await heapify(array, array.length, i);
  }

  // Extract elements from the heap one by one
  for (let i = array.length - 1; i > 0; i--) {
    swap(array, 0, i); // Swap root with the last element
    displayArray([], [i], true); // Highlight the sorted element
    await sleep(delay);

    // Mark the sorted element as green
    displayArray(
      [],
      Array.from({ length: i }, (_, index) => index),
      true
    ); // Make all sorted elements green
    await sleep(delay);

    await heapify(array, i, 0); // Heapify the reduced heap
  }

  // Highlight all sorted elements after the sort is complete
  displayArray(
    [],
    array.map((_, index) => index),
    true
  );
  sortingInProgress = false;
  enableButtons();
}

async function heapify(arr, n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  // Highlight comparisons and swaps during heapify
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    // Swap and highlight the elements being swapped
    swap(arr, i, largest);
    displayArray([i, largest], []); // Highlight swapped elements
    await sleep(delay);
    await heapify(arr, n, largest); // Recursively heapify the affected subtree
  }

  // Highlight the current heap structure
  displayArray([i, left, right], []);
  await sleep(delay);
}

async function cycleSort() {
  disableButtons();
  enableCurrent("cycleSortButton");
  paused = false;
  sortingInProgress = true;
  currentSortFunction = cycleSort;
  let n = array.length;

  // Track sorted elements
  let sortedIndices = [];

  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = array[cycleStart];
    let pos = cycleStart;

    // Highlight the current element being compared (red)
    let comparisonIndices = [cycleStart];

    // Find position of current element in cycle
    for (let i = cycleStart + 1; i < n; i++) {
      comparisonIndices.push(i); // Adding elements being compared to the red list
      if (array[i] < item) pos++;
    }

    // Update the color of the compared elements (red)
    displayArray(comparisonIndices, [], false);
    await sleep(delay);

    if (pos === cycleStart) continue;

    // Avoid duplicate elements
    while (item === array[pos]) pos++;

    let temp = array[pos];
    array[pos] = item;
    item = temp;

    // Highlight the swapped elements (red)
    displayArray([cycleStart, pos], [], false);
    await sleep(delay);

    // Update the color of the elements in the cycle that have been sorted (green)
    displayArray([], [cycleStart, pos], true);
    await sleep(delay);

    // Continue the cycle until item reaches the correct position
    while (pos !== cycleStart) {
      pos = cycleStart;

      // Highlight the current element being compared (red)
      comparisonIndices = [cycleStart];

      for (let i = cycleStart + 1; i < n; i++) {
        comparisonIndices.push(i); // Adding elements being compared to the red list
        if (array[i] < item) pos++;
      }

      // Update the color of the compared elements (red)
      displayArray(comparisonIndices, [], false);
      await sleep(delay);

      while (item === array[pos]) pos++;

      temp = array[pos];
      array[pos] = item;
      item = temp;

      // Highlight the swapped elements (red)
      displayArray([cycleStart, pos], [], false);
      await sleep(delay);

      // Highlight the sorted elements (green)
      sortedIndices.push(pos);
      displayArray([], sortedIndices, true);
      await sleep(delay);
    }

    // Mark the cycle start position as sorted
    sortedIndices.push(cycleStart);
    displayArray([], sortedIndices, true);
    await sleep(delay);
  }

  // Finally, highlight all sorted elements in green
  displayArray(
    [],
    Array.from({ length: n }, (_, index) => index),
    true
  );

  sortingInProgress = false;
  enableButtons();
}

async function radixSort() {
  disableButtons();
  enableCurrent("radixSortButton");
  paused = false;
  sortingInProgress = true;
  currentSortFunction = radixSort;
  let max = Math.max(...array);

  // Loop through each digit (exp)
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countingSortByDigit(exp);
  }
  sortingInProgress = false;
  enableButtons();
}

// Counting sort by digit (used by Radix Sort)
async function countingSortByDigit(exp) {
  let output = new Array(array.length).fill(0);
  let count = new Array(10).fill(0);

  // Step 1: Count occurrences of each digit (highlight comparisons in red)
  let comparisonIndices = [];
  for (let i = 0; i < array.length; i++) {
    let index = Math.floor(array[i] / exp) % 10;
    count[index]++;
    comparisonIndices.push(i); // Mark the current element as compared
  }
  displayArray(comparisonIndices, [], false); // Show compared elements in red
  await sleep(delay);

  // Step 2: Update count array to accumulate positions
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Step 3: Build the output array (highlight the elements as they are placed in output)
  let placingIndices = [];
  for (let i = array.length - 1; i >= 0; i--) {
    let index = Math.floor(array[i] / exp) % 10;
    output[count[index] - 1] = array[i];
    placingIndices.push(i); // Mark the current element being placed in output
    count[index]--;
  }

  // Display the elements being placed in output (red color for swapped elements)
  displayArray(placingIndices, [], false);
  await sleep(delay);

  // Step 4: Copy the sorted elements back into the original array
  let sortedIndices = [];
  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    sortedIndices.push(i); // Mark the fully sorted element
    displayArray([], sortedIndices, true); // Highlight sorted elements in green
    await sleep(delay);
  }
}
