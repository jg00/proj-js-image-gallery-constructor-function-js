function getElement(selection) {
  const element = document.querySelector(selection);
  if (element) {
    return element;
  }
  throw new Error(
    `Please check "${selection}" selector, no such element exists`
  );
}

function Gallery(element) {
  this.container = element;

  // possible to have lots of sections each with it's own unique list of images
  this.list = [...element.querySelectorAll(".img")];

  // there will always be one modal
  this.modal = getElement(".modal");
  this.modalImg = getElement(".main-img");
  this.imageName = getElement(".image-name");
  this.modalImages = getElement(".modal-images");
  this.closeBtn = getElement(".close-btn");
  this.nextBtn = getElement(".next-btn");
  this.prevBtn = getElement(".prev-btn");

  // let self = this; // just another approach where we are not using 'instance variable' and use self to call functions ex: self.openModal().  no need to bind(this) if using this approach.

  // bind function
  // console.log(this); // At set up time 'this' references the constructor function object itself.  However, on an event invoked at a later time, 'this' refer to the object to the left ie the button Node object.
  // Note that another reason we bind to the constructor function object is now we have access to the members like this.modal (ie the element nodes).
  // If we did not bind then when the click event occurs then to the left of the function when ran is the object the event listener is attached to.
  // this.openModal = this.openModal.bind(this); // no longer needed b/c in the event set up we created another function and bound 'this' there directly

  // Note: that the reason we bind these inside the constructor function and not inside the .prototype.closeModal for example is because when we close the modal we want also need to remove the event listeners
  this.closeModal = this.closeModal.bind(this);
  this.nextImage = this.nextImage.bind(this);
  this.prevImage = this.prevImage.bind(this);
  this.chooseImage = this.chooseImage.bind(this);

  // events
  // this.container.addEventListener("click", this.openModal); // Remember this.openModal is just a reference to the function object and 'this' within it when event invoked will be the button object (ie will depend on the object to the left) and that is why we .bind() to specify we want 'this' to point to the constructor function object at runtime.

  // We need to send the event, current image id, list so we needed to create a function (which is a new object) but when called 'this' again references the object to the left (ie this.container object)
  this.container.addEventListener(
    "click",
    // this is a new function {} created where 'this' by default points to whatever object is the left of it 'when' the function is ran
    function (e) {
      // console.log(this); // points back to container section element so we bind this function directly or you could set up named function but we are not planning on removing this event so no need.

      // for capturing image clicked info
      if (e.target.classList.contains("img")) {
        // console.log(e);
        this.openModal(e.target, this.list); // as this point 'how' is this function invoked? Because we bound 'this' to the constructor function object then we have access to it's members.
      }
    }.bind(this)
  );

  // this.closeBtn.addEventListener("click", this.closeModal); // this event listener should really be in the .openModal code below
}

// This is just a set up and not a call to the function; we will need to pass in the current image and the list. why? so we can use it to display the main image and the rest of the image in the modal.
Gallery.prototype.openModal = function (selectedImage, list) {
  // console.log(this); // points to container section element before bound solution implemented
  // console.log(selectedImage, list);

  // Reason why we created a separate function is because we will reuse it in the modal when we click next or prev buttons
  this.setMainImage(selectedImage); // Nice thing here is at this point 'this' already points to the constructor function object

  // Probably reason why we did not create a separate function is because we are not really calling it again in any other place like the modal
  this.modalImages.innerHTML = list
    .map(function (image) {
      return `<img
    src="${image.src}"
    title="${image.title}"
    class="${
      selectedImage.dataset.id === image.dataset.id
        ? "modal-img selected"
        : "modal-img"
    }"
    data-id="${image.dataset.id}"
    alt="city"
  />`;
    })
    .join("");

  this.modal.classList.add("open");

  // Now once we "open the modal" this is when we should add event listeners related the modal functionality
  // Now we need to bind 'this' to constructor function object for .closeModal, .nextImage, .prevImage BUT we don't want to do them inside of each
  // because we want to remove "all" of these modal related the event listeners when we "close the modal"
  this.closeBtn.addEventListener("click", this.closeModal);
  this.nextBtn.addEventListener("click", this.nextImage);
  this.prevBtn.addEventListener("click", this.prevImage);

  this.modalImages.addEventListener("click", this.chooseImage);
};

Gallery.prototype.setMainImage = function (selectedImage) {
  // console.log(this); // 'this' at this point already points to Gallery b/c in the event when .openModal() was invoked 'this' was already bound correctly.
  console.log(selectedImage);
  this.modalImg.src = selectedImage.src;
  this.imageName.textContent = selectedImage.title;
};

Gallery.prototype.closeModal = function () {
  // console.log(this);
  this.modal.classList.remove("open");

  // Proper place to clean up event listeners we added when we opened the modal
  this.closeBtn.removeEventListener("click", this.closeModal);
  this.nextBtn.removeEventListener("click", this.nextImage);
  this.prevBtn.removeEventListener("click", this.prevImage);
  this.chooseImage.removeEventListener("click", this.chooseImage);
};

Gallery.prototype.nextImage = function () {
  const selected = this.modalImages.querySelector(".selected");
  const next =
    selected.nextElementSibling || this.modalImages.firstElementChild;
  selected.classList.remove("selected");
  next.classList.add("selected");
  this.setMainImage(next);
};

Gallery.prototype.prevImage = function () {
  const selected = this.modalImages.querySelector(".selected");
  const prev =
    selected.previousElementSibling || this.modalImages.lastElementChild;
  selected.classList.remove("selected");
  prev.classList.add("selected");
  this.setMainImage(prev);
};

Gallery.prototype.chooseImage = function (e) {
  if (e.target.classList.contains("modal-img")) {
    const selected = this.modalImages.querySelector(".selected");
    selected.classList.remove("selected");
    e.target.classList.add("selected");
    this.setMainImage(e.target);
  }
};

const nature = new Gallery(getElement(".nature"));
const city = new Gallery(getElement(".city"));
