// DOOR JAI KRISHNASING VOOR INFORMATICA PO2

window.addEventListener("resize", () => {
  canvasX = setCanvasLocation();
  canvas.position(canvasX, 0);
});

// SETUP
const canvasWidth = 800;
const canvasHeight = 600;
const rectSideWidth = 150;
const rectSideHeight = 450;
const rectHeight = 150;
const NOISE_INTENSITY = 60;
const SPACE_OPACITY = 120;
const FONT_SIZE = {largeFont: 28, mediumFont: 24, smallFont: 17};
const imagesArray = [
  {location: "images/1.jpg", img: null},
  {location: "images/2.jpg", img: null},
  {location: "images/3.jpg", img: null},
  {location: "images/4.jpg", img: null},
];
const imagesCopyArray = [];
const emojiSrc = [];
const MIN_AMOUNT_EMOJIS = 50;
const MAX_AMOUNT_EMOJIS = 80;
const circleCenterX = 385;
const circleCenterY = 235;
const circleRadius = 210;
const colors = {PRIMARY_COLOR: "#930ff7", SECONDARY_COLOR: "#ffffff"};

let canvasX = setCanvasLocation();
let currentIndex = 0;
let emojiButtons = [];
let emojis = [];
let initialTemperature = 0;

// AFBEELDINGEN & PICTOGRAMMEN
const downloadIcon = "icons/download_icon.png";
const rightIcon = "icons/right_icon.png";
const leftIcon = "icons/left_icon.png";
const resetIcon = "icons/reset_icon.png";
const customFontLocation = "fonts/BurbankBigCondensed-Black.otf";
const uploadIcon = "icons/upload_icon.png";
const snowIcon = "icons/snow_icon.png";
const spaceIcon = "icons/space_icon.png";
const birthdayIcon = "icons/birthday_icon.png";
const flameIcon = "icons/flame_icon.png";
const custom_filter_icon_1 = "icons/custom_filter_1_icon.png";
const custom_filter_icon_2 = "icons/custom_filter_2_icon.png";
const custom_filter_icon_3 = "icons/custom_filter_3_icon.png";
const custom_filter_icon_4 = "icons/custom_filter_4_icon.png";
const custom_filter_icon_5 = "icons/custom_filter_5_icon.png";

let spaceImage, birthdayImage, flameImage, snowImage;

// API
const url = "https://emojihub.yurace.pro/api/all";

// CUSTOM FILTERS VARIABELEN
let customFilters;

let custom_filter_button_1,
  custom_filter_button_2,
  custom_filter_button_3,
  custom_filter_button_4,
  custom_filter_button_5;

let custom_filter_text_1,
  custom_filter_text_2,
  custom_filter_text_3,
  custom_filter_text_4,
  custom_filter_text_5;

let custom_filter_1_active = false;
let custom_filter_2_active = false;
let custom_filter_3_active = false;
let custom_filter_4_active = false;
let custom_filter_5_active = false;

// OVERLAYS VAN ACTIVITEITSSTATUS
let spaceActive = false;
let flameActive = false;
let noiseActive = false;
let birthdayActive = false;
let invertActive = false;
let snowActive = false;

// TEXT & BUTTON VARIABELEN
let temperatureText;
let customFiltersText;
let customOverlaysText;
let alphaText;
let flameText;
let hueText;
let emojiText;
let birthdayText;
let spaceText;
let snowText;
let saturationText;

let downloadButton;
let uploadButton;
let nextButton;
let prevButton;
let invertButton;
let spaceButton;
let flameButton;
let snowButton;
let randomNoiseButton;
let birthDayButton;
let emojiButton;
let resetButton;

// SLIDERS
let saturationSlider, alphaSlider, temperatureSlider, hueSlider;

// ANDERE DINGEN
let ui,
  canvas,
  filters,
  bottomRectTexture,
  sideRectTexture,
  customFont,
  canvasElem,
  currentEmoji;

// API FETCHING VOOR EMOJIS

async function fetchData() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response failed");
    }

    const emojiData = await response.json();

    for (const emojiInfo of emojiData) {
      const [codePoint] = [...emojiInfo.unicode];
      const emojiCharacter = parseInt(codePoint.replace("U+", ""), 16);

      emojiSrc.push(String.fromCodePoint(emojiCharacter));
    }
  } catch (err) {
    console.error(err);
  }
}

// TEKEN DE EMOJI OP CANVAS

function drawEmojisOnCanvas() {
    emojis = [];
    currentEmoji = emojiSrc[randomNumberBetween(0, emojiSrc.length)];

    if (!currentEmoji) currentEmoji = "\u{1F4AB}";

    const randomNumber = randomNumberBetween(
      MIN_AMOUNT_EMOJIS,
      MAX_AMOUNT_EMOJIS
    );

    for (let i = 0; i < randomNumber; i++) {
      const angle = (i / randomNumber) * Math.PI * 2;
      const randomX = circleCenterX + circleRadius * Math.cos(angle);
      const randomY = circleCenterY + circleRadius * Math.sin(angle);

      emojis.push({x: randomX, y: randomY});
    }
}

function drawEmojis() {
  textFont("Noto Color Emoji");
  textSize(25);

  for (const emoji of emojis) {
    text(`${currentEmoji}`, emoji.x, emoji.y);
  }
}

// GEBRUIKERSINVOER BEHANDELEN -> AFBEELDINGEN UPLOADEN OM TE WIJZIGEN

function fileSelected(file) {
  if (file) {
    const img = createImg(file.data, "userImage", () => {
      const Image = loadImage(file.data, () => {
        imagesArray.push({location: file.data, img: Image});
        copyArray(imagesArray, imagesCopyArray);
        resetImage();
      });
    });

    img.hide();
    alert("De afbeelding is succesvol geüpload");
  } else {
    alert("Error");
  }
}

function preload() {
  for (let i = 0; i < imagesArray.length; i++) {
    imagesArray[i].img = loadImage(imagesArray[i].location);
  }

  customFont = loadFont(customFontLocation);
  snowImage = loadImage("images/snow.png");
  bottomRectTexture = loadImage("images/board.jpeg");
  sideRectTexture = loadImage("images/side_rect.jpg");
  spaceImage = loadImage("images/space_image.jpg");
  birthdayImage = loadImage("images/birthday_image.png");
  flameImage = loadImage("images/flame_image.png");
}

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.position(canvasX, 0);

  canvasElem = document.getElementById("defaultCanvas0");

  canvasElem
    ? (canvasElem.willReadFrequently = true)
    : console.error("Canvas element not found.");

  ui = new UI(
    canvasWidth,
    canvasHeight,
    canvasX,
    rectSideWidth,
    rectSideHeight,
    rectHeight,
    imagesArray,
    imagesCopyArray
  );

  filters = new Filters();
  customFilters = new CustomFilters();

  fetchData();

  ui.drawUI();
}

function draw() {
  background(0);

  ui.setupUI();

  imagesCopyArray[currentIndex].img.loadPixels();

  ui.updateUIElements(canvasX);

  filters.changeAlpha(imagesCopyArray[currentIndex].img, alphaSlider.value());

  imagesCopyArray[currentIndex].img.updatePixels();

  for (let i = 1; i <= 5; i++) {
    eval(`custom_filter_button_${i}`).mousePressed(() => {
      eval(`custom_filter_${i}_active = true`);
    });
  }

  for (let i = 2; i <= 5; i++) {
    const customFilterActive = eval(`custom_filter_${i}_active`);

    if (customFilterActive) {
      customFilters[`customFilter${i}`]();
    }
  }

  if (snowActive) {
    drawSnow();
  }

  if (spaceActive) {
    drawSpace();
  }

  if (birthdayActive) {
    drawBirthday();
  }

  if (flameActive) {
    drawFlame();
  }

  if (noiseActive) {
      filters.randomNoiseFilter(
        imagesCopyArray[currentIndex].img,
        NOISE_INTENSITY
      );
  }

  if (invertActive) {
    filters.invertFilter(imagesCopyArray[currentIndex].img);
  }

  if (custom_filter_1_active) {
    for (let i = 0; i < 4; i++) {
      customFilters.customFilter1(imagesCopyArray[currentIndex].img);
    }
  }

  snowButton.mousePressed(() => {
    snowActive = true;
  });

  spaceButton.mousePressed(() => {
    spaceActive = true;
  });

  birthDayButton.mousePressed(() => {
    birthdayActive = true;
  });

  flameButton.mousePressed(() => {
    flameActive = true;
  });

  randomNoiseButton.mousePressed(() => {
    noiseActive = true;
  });

  invertButton.mousePressed(() => {
    invertActive = true;
  });

  drawEmojis();
}

// DE GEBRUIKERSINTERFACE MAKEN (UI)

class UI {
  constructor(canvasWidth, canvasHeight, canvasX, rectSideWidth, rectSideHeight, rectHeight, imagesArray, copyArray) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.canvasX = canvasX;
    this.rectSideWidth = rectSideWidth;
    this.rectSideHeight = rectSideHeight;
    this.rectHeight = rectHeight;
    this.imagesArray = imagesArray;
    this.copyArray = copyArray;
    this.img;
    this.fileInput = createFileInput(fileSelected).hide();
  }
  

  setupUI() {
    this.drawSideRect();

    this.drawBottomRect();

    // DEFAULTS

    fill(colors.SECONDARY_COLOR);
    textFont(customFont);

    // ALPHA TEXT

    stroke(0);
    textSize(FONT_SIZE.mediumFont);
    alphaText = text("HELDERHEID", 38, canvasHeight - 110);

    // SATURATION TEXT
    textSize(FONT_SIZE.mediumFont);
    saturationText = text("SATURATION", 36, canvasHeight - 50);

    // EMOJI TEXT
    textSize(FONT_SIZE.mediumFont);
    emojiText = text("EMOJI", canvasWidth - 140, 87);

    // SNOW TEXT
    textSize(FONT_SIZE.mediumFont);
    snowText = text("SNEEUW", canvasWidth - 75, 156);

    // SPACE TEXT
    textSize(FONT_SIZE.mediumFont);
    spaceText = text("RUIMTE", canvasWidth - 140, 215);

    // BIRTHDAY TEXT
    textSize(FONT_SIZE.smallFont);
    birthdayText = text("VERJAARDAG", canvasWidth - 75, 274);

    // FLAME TEXT
    textSize(24);
    flameText = text("VLAM", canvasWidth - 130, 335);

    // HUE SLIDER TEXT
    textSize(FONT_SIZE.mediumFont);
    hueText = text("HUE", 250, canvasHeight - 50);

    // TEMPERATURE TEXT
    textSize(FONT_SIZE.mediumFont);
    temperatureText = text("TEMPERATURE", 210, this.canvasHeight - 110);

    // FILTER 1
    textSize(FONT_SIZE.largeFont);
    custom_filter_text_1 = text("1, 2, 3", 18, this.canvasHeight - 512);

    // FILTER 2
    textSize(FONT_SIZE.largeFont);
    custom_filter_text_2 = text("GELD", 70, this.canvasHeight - 445);

    // FILTER 3
    textSize(FONT_SIZE.mediumFont);
    custom_filter_text_3 = text("THANOS", 8, this.canvasHeight - 375);

    // CUSTOM FILTER TEXT
    textSize(FONT_SIZE.mediumFont);
    customFiltersText = text("CUSTOM FILTERS", 6, 30);

    // OVERLAYS TEXT
    textSize(FONT_SIZE.mediumFont);
    customOverlaysText = text(
      "OVERLAYS",
      this.canvasWidth - this.rectSideWidth + 35,
      30
    );

    // FILTER 4
    textSize(FONT_SIZE.mediumFont);
    custom_filter_text_4 = text("WAT???", 70, this.canvasHeight - 305);

    // FILTER 5
    textSize(FONT_SIZE.smallFont);
    custom_filter_text_5 = text("PIXELSCHILD", 5, this.canvasHeight - 235);

    this.drawImage();
  }

  drawUI() {
    this.drawUIElements();

    saturationSlider.input(() =>
      filters.changeSaturation(
        imagesCopyArray[currentIndex].img,
        saturationSlider.value()
      )
    );

    hueSlider.input(() => {
      filters.changeHue(imagesCopyArray[currentIndex].img, hueSlider.value());
    });

    temperatureSlider.input(() => {
      const newTemp = temperatureSlider.value();
      const tempChange = newTemp - initialTemperature;
  
      filters.temperatureFilter(imagesCopyArray[currentIndex].img, tempChange);
      initialTemperature = newTemp;
    });
  }

  drawImage() {
    copyArray(this.imagesArray, this.copyArray);
    this.img = this.copyArray[currentIndex].img;

    image(this.img, this.rectSideWidth, 0, this.canvasWidth - this.rectSideWidth * 2, this.canvasHeight - this.rectHeight);

  }

  drawSideRect() {
    fill(0);
    noStroke();
    rect(0, 0, this.rectSideWidth, this.rectSideHeight);
    image(sideRectTexture, 0, 0, this.rectSideWidth, this.rectSideHeight);

    rect(this.canvasWidth - this.rectSideWidth, 0, this.rectSideWidth, this.rectSideHeight);
    image(sideRectTexture, this.canvasWidth - this.rectSideWidth, 0, this.rectSideWidth, this.rectSideHeight);
    
  }

  drawBottomRect() {
    fill(120);

    noStroke();
    rect(0, this.canvasHeight - this.rectHeight, this.canvasWidth, this.rectHeight);
    image(bottomRectTexture, 0, this.canvasHeight - this.rectHeight, this.canvasWidth, this.rectHeight);
    
  }

  drawUIElements() {
    alphaSlider = createSlider(150, 255, 255, 1);
    hueSlider = createSlider(0, 360, 0, 1);
    saturationSlider = createSlider(10, 100, 55, 1);
    temperatureSlider = createSlider(0, 200, 100, 1);
    snowButton = createButton("");
    spaceButton = createButton("");
    birthDayButton = createButton("");
    flameButton = createButton("");
    custom_filter_button_1 = createButton("");
    custom_filter_button_2 = createButton("");
    custom_filter_button_3 = createButton("");
    custom_filter_button_4 = createButton("");
    custom_filter_button_5 = createButton("");
    nextButton = createButton("");
    prevButton = createButton("");
    invertButton = createButton("INVERT");
    randomNoiseButton = createButton("NOISE");
    resetButton = createButton("");
    uploadButton = createButton("");

    downloadButton = createButton("");
    downloadButton.style("background", `url(${downloadIcon})`);
    downloadButton.style("background-size", "40px");
    downloadButton.style("background-repeat", "no-repeat");
    downloadButton.style("background-position", "center center");
    downloadButton.style("background-color", `${colors.PRIMARY_COLOR}`);
    downloadButton.style("padding", "30px");
    downloadButton.style("border-radius", "9999px");
    downloadButton.style("border-style", "solid");
    downloadButton.style("border-color", "white");
    downloadButton.style("cursor", "pointer");

    emojiButton = createButton(`&#128512;`);
    emojiButton.style("background", "none");
    emojiButton.style("align-items", "center");
    emojiButton.style("font-size", "30px");
    emojiButton.style("border-style", "solid");
    emojiButton.style("border-color", `${colors.PRIMARY_COLOR}`);
    emojiButton.style("border-radius", "9999px");
    emojiButton.style("padding", "5px");
    emojiButton.style("cursor", "pointer");

    this.styleFilterSliders(alphaSlider, colors.PRIMARY_COLOR);
    this.styleFilterSliders(saturationSlider, colors.PRIMARY_COLOR);
    this.styleFilterSliders(temperatureSlider, colors.PRIMARY_COLOR);
    this.styleFilterSliders(hueSlider, colors.PRIMARY_COLOR);
    this.styleButton(randomNoiseButton, {backgroundColor: true, border: '1px solid black'});
    this.styleButton(uploadButton, {backgroundUrl: uploadIcon, backgroundSize: 35, padding: 20, border: 'none'});
    this.styleButton(resetButton, { backgroundUrl: resetIcon, backgroundSize: 30, padding: 15, border: "none" });
    this.styleButton(invertButton, { backgroundColor: true, border: "1px solid black" });
    this.styleButton(nextButton, { backgroundUrl: rightIcon, padding: 35, backgroundSize: 40, border: "none" });
    this.styleButton(prevButton, { backgroundUrl: leftIcon, padding: 35, backgroundSize: 40, border: "none" });
    this.styleFilterButton(flameButton, flameIcon, 50, 25, colors.PRIMARY_COLOR);
    this.styleFilterButton(birthDayButton, birthdayIcon, 30, 25, colors.PRIMARY_COLOR);
    this.styleFilterButton(spaceButton, spaceIcon, 30, 25, colors.PRIMARY_COLOR);
    this.styleFilterButton(snowButton, snowIcon, 30, 25, colors.PRIMARY_COLOR);
    this.styleFilterButton(custom_filter_button_1, custom_filter_icon_1, 45, 25, colors.PRIMARY_COLOR);
    this.styleFilterButton(custom_filter_button_2, custom_filter_icon_2, 45, 25, colors.PRIMARY_COLOR);
    this.styleFilterButton(custom_filter_button_3, custom_filter_icon_3, 45, 25, colors.PRIMARY_COLOR);
    this.styleFilterButton(custom_filter_button_4, custom_filter_icon_4, 45, 25, colors.PRIMARY_COLOR);
    this.styleFilterButton(custom_filter_button_5, custom_filter_icon_5, 30, 25, colors.PRIMARY_COLOR);

  }

  updateUIElements(canvasX) {
    alphaSlider.position(canvasX + (5 / 200) * canvasWidth, this.canvasHeight - 100);

    nextButton.position(canvasX + this.canvasWidth / 2 + 60, this.canvasHeight - this.rectHeight + this.rectHeight / 3);

    nextButton.mousePressed(nextImage);
    
    prevButton.position(canvasX + this.canvasWidth / 2 - 35, this.canvasHeight - this.rectHeight + this.rectHeight / 3);

    prevButton.mousePressed(prevImage);

    downloadButton.position(canvasX + this.canvasWidth / 2, this.canvasHeight - this.rectHeight + this.rectHeight / 4);

    downloadButton.mousePressed(downloadImage);
    
    resetButton.position(canvasX + this.canvasWidth / 2 + 18, canvasHeight - this.rectHeight / 4);

    resetButton.mousePressed(resetImage);
    
    saturationSlider.position(canvasX + (5 / 200) * canvasWidth, canvasHeight - 40);
    
    uploadButton.position(canvasX + this.canvasWidth / 2 + 14, canvasHeight - this.rectSideWidth);

    uploadButton.mousePressed(() => { this.fileInput.elt.click(); });
    
    emojiButton.position(canvasX + this.canvasWidth - this.rectSideWidth / 2, 50);

    emojiButton.mousePressed(drawEmojisOnCanvas);
    
    snowButton.position(canvasX + this.canvasWidth - this.rectSideWidth + 10, 120);
    
    spaceButton.position(canvasX + this.canvasWidth - this.rectSideWidth / 2, 180);
    
    birthDayButton.position(canvasX + this.canvasWidth - this.rectSideWidth + 10, 240);
    
    flameButton.position(canvasX + this.canvasWidth - this.rectSideWidth / 2, 300);
    
    hueSlider.position(canvasX + (50 / 200) * this.canvasWidth, canvasHeight - 40);

    randomNoiseButton.position(canvasX + this.canvasWidth - 250, this.canvasHeight - 100);

    invertButton.position(canvasX + this.canvasWidth + -140, this.canvasHeight - 100);

    temperatureSlider.position(canvasX + (50 / 200) * this.canvasWidth, canvasHeight - 100);
    
    custom_filter_button_1.position(canvasX + 80, 50);
    custom_filter_button_2.position(canvasX + 10, 120);
    custom_filter_button_3.position(canvasX + 80, 190);
    custom_filter_button_4.position(canvasX + 10, 260);
    custom_filter_button_5.position(canvasX + 80, 330);
  }

  styleFilterButton(button, backgroundImage, size, padding, color) {
    button.style("background", `url(${backgroundImage})`);
    button.style("background-size", `${size}px`);
    button.style("background-repeat", `no-repeat`);
    button.style("background-position", `center center`);
    button.style("padding", `${padding}px`);
    button.style("border-radius", `9999px`);
    button.style("border-style", `solid`);
    button.style("border-color", `${color}`);
    button.style("cursor", `pointer`);
  }

  styleFilterSliders(slider, backgroundColor) {
    slider.style("cursor", "pointer");
    slider.style("appearance", "none");
    slider.style("background-color", `${backgroundColor}`);
    slider.style("border", "1px solid black");
  }

  styleButton(button, options = {}) {
    button.style("border", `${options.border}`);
    button.style("cursor", "pointer");

    if (options.backgroundColor) {
      button.style("background-color", `${colors.PRIMARY_COLOR}`);
      button.style("color", `${colors.SECONDARY_COLOR}`);
      button.style("padding-top", "10px");
      button.style("padding-bottom", "10px");
      button.style("padding-left", "20px");
      button.style("padding-right", "20px");
    }

    if (options.backgroundUrl) {
      button.style("background", `url(${options.backgroundUrl})`);
      button.style("background-repeat", "no-repeat");
      button.style("background-size", `${options.backgroundSize}px`);
      button.style("padding", `${options.padding}px`);
    }
  }
}

// FILTERS 

class Filters {
  constructor() {}

  changeAlpha(img, value) {
    for (let i = 3; i < img.pixels.length; i += 4) {
      img.pixels[i] = value;
    }
  }

  changeSaturation(img, value) {
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
      let [r, g, b] = [img.pixels[i], img.pixels[i + 1], img.pixels[i + 2]];
      let [h, s, l] = rgbToHsl(r, g, b);
      let [newR, newG, newB] = hslToRgb(h, value / 100, l / 100);
      img.pixels[i] = newR;
      img.pixels[i + 1] = newG;
      img.pixels[i + 2] = newB;
    }
    img.updatePixels();
  }

  changeHue(img, value) {
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
      let [r, g, b, a] = [
        img.pixels[i],
        img.pixels[i + 1],
        img.pixels[i + 2],
        img.pixels[i + 3],
      ];
      let [h, s, l] = rgbToHsl(r, g, b);

      h = (h + value) % 360;

      let [newR, newG, newB] = hslToRgb(h, s / 100, l / 100);

      img.pixels[i] = newR;
      img.pixels[i + 1] = newG;
      img.pixels[i + 2] = newB;
      img.pixels[i + 3] = a;
    }
    img.updatePixels();
  }

  randomNoiseFilter(img, intensity) {
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
      let [r, g, b] = [img.pixels[i], img.pixels[i + 1], img.pixels[i + 2]];
      const noiseR = random(-intensity, intensity);
      const noiseG = random(-intensity, intensity);
      const noiseB = random(-intensity, intensity);

      img.pixels[i] = constrain(r + noiseR, 0, 255);
      img.pixels[i + 1] = constrain(g + noiseG, 0, 255);
      img.pixels[i + 2] = constrain(b + noiseB, 0, 255);
    }
    img.updatePixels();
    noiseActive = false;
  }

  invertFilter(img) {
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
      img.pixels[i] = 255 - img.pixels[i];
      img.pixels[i + 1] = 255 - img.pixels[i + 1];
      img.pixels[i + 2] = 255 - img.pixels[i + 2];
    }
    img.updatePixels();
    invertActive = false;
  }

  temperatureFilter(img, temp) {
    img.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
      let r = img.pixels[i];
      let g = img.pixels[i + 1];
      let b = img.pixels[i + 2];

      r = r + temp;
      b = b - temp;

      img.pixels[i] = constrain(r, 0, 255);
      img.pixels[i + 1] = constrain(g, 0, 255);
      img.pixels[i + 2] = constrain(b, 0, 255);
    }

    img.updatePixels();
  }
}



class CustomFilters {
  constructor() {}

  customFilter1(img) {
    currentIndex = 3;
    img.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
      img.pixels[i] = img.pixels[i] / 1;
      img.pixels[i + 1] = img.pixels[i + 1] / 2;
      img.pixels[i + 2] = img.pixels[i + 2] / 3;
    }

    img.updatePixels();
  
    custom_filter_1_active = false;
  }

  customFilter2() {
    resetImage();
    currentIndex = 0;
    filters.changeHue(imagesCopyArray[currentIndex].img, 325);
    filters.changeSaturation(imagesCopyArray[currentIndex].img, 70);
    filters.randomNoiseFilter(imagesCopyArray[currentIndex].img, 60);
    flameActive = true;

    drawEmojisOnCanvas();
    currentEmoji = "\u{1F4B5}";

    custom_filter_2_active = false;
  }

  customFilter3() {
    resetImage();
    currentIndex = 1;
    filters.changeHue(imagesCopyArray[currentIndex].img, 260);
    filters.changeSaturation(imagesCopyArray[currentIndex].img, 65);
    custom_filter_3_active = false;
  }

  customFilter4() {
    resetImage();
    currentIndex = 2;
    filters.temperatureFilter(imagesCopyArray[currentIndex].img, -100);
    filters.changeSaturation(imagesCopyArray[currentIndex].img, 120);
    snowActive = true;
    custom_filter_4_active = false;
  }

  customFilter5() {
    currentIndex = 3;
    filters.changeHue(imagesCopyArray[currentIndex].img, 300);
    filters.changeSaturation(imagesCopyArray[currentIndex].img, 240);
    filters.randomNoiseFilter(imagesCopyArray[currentIndex].img, 160);
    invertActive = true;
    custom_filter_5_active = false;
  }
}

function nextImage() {
  currentIndex = (currentIndex + 1) % imagesArray.length;
  resetImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
  resetImage();
}

function copyArray(arr, copy) {
  for (let i = 0; i < arr.length; i++) {
    copy[i] = arr[i];
  }
}

function drawSnow() {
  snowImage.resize(canvasWidth - rectSideWidth * 2, canvasHeight - rectHeight);
  image(snowImage, rectSideWidth, 0);
}

function drawSpace() {
  spaceImage.resize(canvasWidth - rectSideWidth * 2, canvasHeight - rectHeight);
  image(spaceImage, rectSideWidth, 0);

  spaceImage.loadPixels();

  for (let i = 3; i < spaceImage.pixels.length; i += 4) {
    spaceImage.pixels[i] = SPACE_OPACITY;
  }

  spaceImage.updatePixels();
}

function drawBirthday() {
  birthdayImage.resize(canvasWidth - rectSideWidth * 2, 200);
  image(birthdayImage, rectSideWidth, 0);
}

function drawFlame() {
  flameImage.resize(canvasWidth - rectSideWidth * 2, 500);
  image(flameImage, rectSideWidth, -50);
}

function downloadImage() {
  const modifiedImage = createImage(canvasWidth, canvasHeight);
  modifiedImage.copy(canvas, 150, 0, canvasWidth - 300, canvasHeight - 150, 0, 0, canvasWidth, canvasHeight);


  modifiedImage.save(`image${currentIndex}.jpg`);
}

function resetImage() {
  alphaSlider.value(255);
  saturationSlider.value(55);
  hueSlider.value(0);
  temperatureSlider.value(100);

  if (imagesArray[currentIndex].location) {
    imagesCopyArray[currentIndex].img = loadImage(
      imagesArray[currentIndex].location
    );
  } else {
    console.error("Cannot reset the image");
  }

  emojis = [];

  snowActive = false;
  spaceActive = false;
  birthdayActive = false;
  flameActive = false;
  currentEmoji = "\u{1F4AB}";

  ui.drawImage();
}

function setCanvasLocation() {
  return innerWidth / 2 - canvasWidth / 2;
}


function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const cMax = Math.max(r, g, b);
  const cMin = Math.min(r, g, b);

  const d = cMax - cMin;

  let h, s, l;

  l = (cMax + cMin) / 2;

  if (d === 0) {
    h = s = 0;
  } else {
    s = d / (1 - Math.abs(2 * l - 1));
  }

  switch (cMax) {
    case r:
      h = 60 * (((g - b) / d) % 6);
      break;
    case g:
      h = 60 * ((b - r) / d + 2);
      break;
    case b:
      h = 60 * ((r - g) / d + 4);
      break;
  }

  h = (h + 360) % 360;

  return [h, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;

  let r, g, b;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
