
      // Mobile menu JS: opens and closes the mobile full-screen menu.
      (function () {
        var menu = document.getElementById("mobileMenu");
        var toggles = Array.from(document.querySelectorAll(".mobile-menu-toggle"));
        var menuLinks = Array.from(document.querySelectorAll(".mobile-menu-card, .mobile-menu-visit, .mobile-menu-phone"));
        var locationMenu = document.getElementById("mobileLocationMenu");
        var locationToggles = Array.from(document.querySelectorAll(".mobile-location-toggle"));
        var locationLinks = Array.from(document.querySelectorAll(".mobile-location-item, #mobileLocationMenu .mobile-menu-visit, #mobileLocationMenu .mobile-menu-phone"));
        var bookingMenu = document.getElementById("mobileBookingMenu");
        var bookingToggles = Array.from(document.querySelectorAll(".mobile-booking-toggle"));
        var bookingForm = bookingMenu ? bookingMenu.querySelector(".mobile-booking-form") : null;

        function setMenuState(isOpen) {
          menu.classList.toggle("is-open", isOpen);
          menu.setAttribute("aria-hidden", String(!isOpen));
          document.body.classList.toggle("menu-open", isOpen || (locationMenu && locationMenu.classList.contains("is-open")) || (bookingMenu && bookingMenu.classList.contains("is-open")));
          toggles.forEach(function (toggle) {
            toggle.classList.toggle("is-active", isOpen);
            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.querySelector("span").textContent = isOpen ? "Close" : "Menu";
            toggle.querySelector("i").className = isOpen ? "bi bi-x-lg" : "bi bi-list";
          });
        }

        function setLocationMenuState(isOpen) {
          if (!locationMenu) {
            return;
          }

          locationMenu.classList.toggle("is-open", isOpen);
          locationMenu.setAttribute("aria-hidden", String(!isOpen));
          document.body.classList.toggle("menu-open", isOpen || menu.classList.contains("is-open") || (bookingMenu && bookingMenu.classList.contains("is-open")));

          locationToggles.forEach(function (toggle) {
            toggle.classList.toggle("is-active", isOpen);
            toggle.setAttribute("aria-expanded", String(isOpen));
          });
        }

        function setBookingMenuState(isOpen) {
          if (!bookingMenu) {
            return;
          }

          bookingMenu.classList.toggle("is-open", isOpen);
          bookingMenu.setAttribute("aria-hidden", String(!isOpen));
          document.body.classList.toggle("menu-open", isOpen || menu.classList.contains("is-open") || (locationMenu && locationMenu.classList.contains("is-open")));

          bookingToggles.forEach(function (toggle) {
            toggle.classList.toggle("is-active", isOpen);
            toggle.setAttribute("aria-expanded", String(isOpen));
          });
        }

        toggles.forEach(function (toggle) {
          toggle.addEventListener("click", function () {
            setLocationMenuState(false);
            setBookingMenuState(false);
            setMenuState(!menu.classList.contains("is-open"));
          });
        });

        menuLinks.forEach(function (link) {
          link.addEventListener("click", function () {
            setMenuState(false);
          });
        });

        locationToggles.forEach(function (toggle) {
          toggle.addEventListener("click", function () {
            setMenuState(false);
            setBookingMenuState(false);
            setLocationMenuState(!locationMenu.classList.contains("is-open"));
          });
        });

        locationLinks.forEach(function (link) {
          link.addEventListener("click", function () {
            setLocationMenuState(false);
          });
        });

        bookingToggles.forEach(function (toggle) {
          toggle.addEventListener("click", function () {
            setMenuState(false);
            setLocationMenuState(false);
            setBookingMenuState(!bookingMenu.classList.contains("is-open"));
          });
        });

        if (bookingForm) {
          bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();
            setBookingMenuState(false);
          });
        }
      })();

      // Featured offices carousel JS: handles drag, slide, arrows, and active card movement.
      document.querySelectorAll("[data-featured-carousel]").forEach(function (carousel) {
        var viewport = carousel.querySelector(".featured-carousel-viewport");
        var track = carousel.querySelector(".featured-carousel-track");
        var slides = Array.from(carousel.querySelectorAll(".featured-slide"));
        var prevButton = carousel.querySelector(".featured-arrow-prev");
        var nextButton = carousel.querySelector(".featured-arrow-next");
        var index = 0;
        var startX = 0;
        var currentTranslate = 0;
        var dragDelta = 0;
        var isDragging = false;

        function slidesPerView() {
          return window.innerWidth >= 992 ? 2 : 1;
        }

        function slideWidth() {
          return viewport.clientWidth / slidesPerView();
        }

        function maxIndex() {
          return Math.max(0, slides.length - slidesPerView());
        }

        function clampTranslate(value) {
          var minTranslate = -slideWidth() * maxIndex();
          return Math.min(0, Math.max(minTranslate, value));
        }

        function update() {
          if (index > maxIndex()) {
            index = maxIndex();
          }

          currentTranslate = -slideWidth() * index;
          track.style.transform = "translateX(" + currentTranslate + "px)";

          prevButton.disabled = index === 0;
          nextButton.disabled = index === maxIndex();
        }

        function pointerX(event) {
          return event.touches ? event.touches[0].clientX : event.clientX;
        }

        function startDrag(event) {
          isDragging = true;
          startX = pointerX(event);
          dragDelta = 0;
          viewport.classList.add("is-dragging");
        }

        function moveDrag(event) {
          if (!isDragging) {
            return;
          }

          dragDelta = pointerX(event) - startX;
          track.style.transform = "translateX(" + clampTranslate(currentTranslate + dragDelta) + "px)";
        }

        function endDrag() {
          if (!isDragging) {
            return;
          }

          isDragging = false;
          viewport.classList.remove("is-dragging");

          if (Math.abs(dragDelta) > slideWidth() * 0.18) {
            if (dragDelta < 0) {
              index = Math.min(maxIndex(), index + 1);
            } else {
              index = Math.max(0, index - 1);
            }
          }

          update();
        }

        prevButton.addEventListener("click", function () {
          index = Math.max(0, index - 1);
          update();
        });

        nextButton.addEventListener("click", function () {
          index = Math.min(maxIndex(), index + 1);
          update();
        });

        viewport.addEventListener("mousedown", startDrag);
        viewport.addEventListener("mousemove", moveDrag);
        window.addEventListener("mouseup", endDrag);
        viewport.addEventListener("mouseleave", endDrag);
        viewport.addEventListener("touchstart", startDrag, { passive: true });
        viewport.addEventListener("touchmove", moveDrag, { passive: true });
        viewport.addEventListener("touchend", endDrag);

        window.addEventListener("resize", update);
        update();
      });

      // Photo gallery lightbox JS: opens gallery images in overlay and closes on click/Escape.
      (function () {
        var lightbox = document.getElementById("galleryLightbox");
        var lightboxImage = lightbox ? lightbox.querySelector(".gallery-lightbox-image") : null;
        var closeButton = lightbox ? lightbox.querySelector(".gallery-lightbox-close") : null;
        var prevButton = lightbox ? lightbox.querySelector(".gallery-lightbox-prev") : null;
        var nextButton = lightbox ? lightbox.querySelector(".gallery-lightbox-next") : null;
        var countLabel = document.getElementById("galleryLightboxCount");
        var titleLabel = document.getElementById("galleryLightboxTitle");
        var tiles = Array.from(document.querySelectorAll(".gallery-grid .gallery-tile"));
        var activeImages = [];
        var activeIndex = 0;

        if (!lightbox || !lightboxImage || !closeButton || !prevButton || !nextButton || !countLabel || !titleLabel || !tiles.length) {
          return;
        }

        function updateLightboxImage() {
          if (!activeImages.length) {
            return;
          }

          lightboxImage.src = activeImages[activeIndex];
          lightboxImage.alt = activeImages[activeIndex] || "";
          countLabel.textContent = (activeIndex + 1) + " / " + activeImages.length;
        }

        function goToSlide(nextIndex) {
          if (!activeImages.length) {
            return;
          }

          activeIndex = (nextIndex + activeImages.length) % activeImages.length;
          updateLightboxImage();
        }

        function closeLightbox() {
          lightbox.classList.remove("is-open");
          lightbox.setAttribute("aria-hidden", "true");
          document.body.classList.remove("lightbox-open");
        }

        tiles.forEach(function (tile) {
          tile.addEventListener("click", function () {
            var image = tile.querySelector("img");
            var images = (tile.dataset.images || "")
              .split(",")
              .map(function (item) { return item.trim(); })
              .filter(Boolean);

            if (!image || !images.length) {
              return;
            }

            activeImages = images;
            activeIndex = 0;
            titleLabel.textContent = image.alt || "Workspace preview";
            updateLightboxImage();
            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.classList.add("lightbox-open");
          });
        });

        closeButton.addEventListener("click", closeLightbox);
        prevButton.addEventListener("click", function (event) {
          event.stopPropagation();
          goToSlide(activeIndex - 1);
        });
        nextButton.addEventListener("click", function (event) {
          event.stopPropagation();
          goToSlide(activeIndex + 1);
        });

        lightbox.addEventListener("click", function (event) {
          if (event.target === lightbox) {
            closeLightbox();
          }
        });

        document.addEventListener("keydown", function (event) {
          if (event.key === "ArrowLeft" && lightbox.classList.contains("is-open")) {
            goToSlide(activeIndex - 1);
          }

          if (event.key === "ArrowRight" && lightbox.classList.contains("is-open")) {
            goToSlide(activeIndex + 1);
          }

          if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
          }
        });
      })();

      // Key numbers counter JS: animates number counters when they enter the viewport.
      document.querySelectorAll(".counter-value").forEach(function (counter) {
        var target = Number(counter.dataset.target || 0);
        var suffix = counter.dataset.suffix || "";
        var format = counter.dataset.format || "number";
        var started = false;

        function render(value) {
          if (format === "compact") {
            counter.textContent = (value / 1000).toFixed(1).replace(".", ",") + suffix;
            return;
          }

          counter.textContent = Math.round(value) + suffix;
        }

        function animate() {
          if (started) {
            return;
          }

          started = true;
          var start = 0;
          var duration = 1400;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) {
              startTime = timestamp;
            }

            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = start + (target - start) * eased;

            render(current);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              render(target);
            }
          }

          window.requestAnimationFrame(step);
        }

        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                animate();
                observer.unobserve(counter);
              }
            });
          },
          { threshold: 0.4 }
        );

        observer.observe(counter);
      });

      // Life @ The Office Pass carousel JS: controls previous/next navigation and responsive slide layout.
      document.querySelectorAll("[data-life-carousel]").forEach(function (carousel) {
        var track = carousel.querySelector(".life-carousel-track");
        var slides = Array.from(carousel.querySelectorAll(".life-slide"));
        var prevButton = carousel.querySelector(".life-arrow-prev");
        var nextButton = carousel.querySelector(".life-arrow-next");
        var items = slides.map(function (slide) {
          var image = slide.querySelector("img");
          var heading = slide.querySelector("h3");
          var body = slide.querySelector("p");

          return {
            image: image ? image.getAttribute("src") : "",
            alt: image ? image.getAttribute("alt") : "",
            title: heading ? heading.textContent : "",
            description: body ? body.textContent : ""
          };
        });
        var activeIndex = 1;

        function mod(value, length) {
          return (value % length + length) % length;
        }

        function renderDesktop() {
          var leftItem = items[mod(activeIndex - 1, items.length)];
          var centerItem = items[mod(activeIndex, items.length)];
          var rightItem = items[mod(activeIndex + 1, items.length)];
          var ordered = [leftItem, centerItem, rightItem];

          slides.forEach(function (slide, position) {
            var card = slide.querySelector(".life-card");
            var image = slide.querySelector("img");
            var heading = slide.querySelector("h3");
            var body = slide.querySelector("p");
            var item = ordered[position];
            var isCenter = position === 1;

            image.setAttribute("src", item.image);
            image.setAttribute("alt", item.alt);
            heading.textContent = item.title;

            if (body) {
              body.textContent = item.description;
            } else if (isCenter && item.description) {
              var paragraph = document.createElement("p");
              paragraph.textContent = item.description;
              card.appendChild(paragraph);
            } else if (!isCenter && body) {
              body.remove();
            }

            card.classList.toggle("life-card-main", isCenter);
            card.classList.toggle("life-card-side", !isCenter);
            slide.classList.toggle("life-slide-center", isCenter);
            slide.classList.toggle("life-slide-side", !isCenter);

            var existingBody = slide.querySelector("p");
            if (!isCenter && existingBody) {
              existingBody.remove();
            }
            if (isCenter && !slide.querySelector("p")) {
              var newBody = document.createElement("p");
              newBody.textContent = item.description;
              card.appendChild(newBody);
            }
          });
        }

        function renderMobile() {
          slides.forEach(function (slide, position) {
            var item = items[mod(activeIndex + position, items.length)];
            var card = slide.querySelector(".life-card");
            var image = slide.querySelector("img");
            var heading = slide.querySelector("h3");
            var body = slide.querySelector("p");

            image.setAttribute("src", item.image);
            image.setAttribute("alt", item.alt);
            heading.textContent = item.title;

            if (body) {
              body.textContent = item.description;
            } else if (item.description) {
              var paragraph = document.createElement("p");
              paragraph.textContent = item.description;
              card.appendChild(paragraph);
            }

            card.classList.add("life-card-main");
            card.classList.remove("life-card-side");
            slide.classList.add("life-slide-center");
            slide.classList.remove("life-slide-side");
          });
        }

        function update() {
          if (window.innerWidth >= 992) {
            track.style.transform = "translateX(0)";
            renderDesktop();
          } else {
            var offset = 100 * activeIndex;
            track.style.transform = "translateX(-" + offset + "%)";
            renderMobile();
          }
        }

        prevButton.addEventListener("click", function () {
          activeIndex = mod(activeIndex - 1, items.length);
          update();
        });

        nextButton.addEventListener("click", function () {
          activeIndex = mod(activeIndex + 1, items.length);
          update();
        });

        window.addEventListener("resize", update);
        update();
      });


        // Office listing filter JS: handles city dropdown, workspace dropdown, chips, and dynamic office cards.
      (function () {
        var directory = document.querySelector("[data-city-office-directory]");
        if (!directory) return;

        var citySelect = directory.querySelector("#cityFilter");
        var workspaceSelect = directory.querySelector("#workspaceFilter");
        var chipRow = directory.querySelector("[data-city-chip-row]");
        var resultsTitle = directory.querySelector("[data-city-results-title]");
        var resultsLink = directory.querySelector("[data-city-results-link]");
        var officeGrid = directory.querySelector("[data-city-office-grid]");
        var emptyState = directory.querySelector("[data-city-office-empty]");
        var titleElement = document.querySelector("#city-locations .section-title");
        var copyElement = document.querySelector(".city-listing-copy");
        var legacyCards = Array.from(directory.querySelectorAll(".col-md-6.col-xl-4"));

        legacyCards.forEach(function (item) {
          item.classList.add("d-none");
        });

        var cityMeta = {
          Gurgaon: {
            sectionTitle: "Offices Across Gurgaon",
            description: "Strategically located offices across Cyber City, Golf Course Road, HUDA City Centre and key business hubs.",
            locations: ["Sector 27", "Sector 44", "MG Road", "Sector 54"]
          },
          Delhi: {
            sectionTitle: "Offices Across Delhi",
            description: "Flexible offices across Connaught Place, Saket, Aerocity and other high-demand business zones.",
            locations: ["Connaught Place", "Saket", "Nehru Place", "Aerocity"]
          },
          Noida: {
            sectionTitle: "Offices Across Noida",
            description: "Premium office spaces in metro-connected sectors built for startups, SMEs and enterprise teams.",
            locations: ["Sector 3", "Sector 16", "Sector 62", "Sector 132"]
          }
        };

        var offices = [
          { city: "Gurgaon", location: "Sector 27", workspace: "Coworking", name: "One Horizon Center", price: "18,999", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80" },
          { city: "Gurgaon", location: "Sector 27", workspace: "Meeting Room", name: "DLF Crest Hub", price: "6,999", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80" },
          { city: "Gurgaon", location: "Sector 44", workspace: "Managed Office", name: "Unitech Cyber Park", price: "24,999", image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80" },
          { city: "Gurgaon", location: "Sector 44", workspace: "Private Office", name: "Business Tower 44", price: "28,499", image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80" },
          { city: "Gurgaon", location: "MG Road", workspace: "Coworking", name: "MG Road Studios", price: "16,999", image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=80" },
          { city: "Gurgaon", location: "MG Road", workspace: "Managed Office", name: "Metro Plaza Suites", price: "23,999", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80" },
          { city: "Gurgaon", location: "Sector 54", workspace: "Private Office", name: "Golf Course Square", price: "27,999", image: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?auto=format&fit=crop&w=900&q=80" },
          { city: "Gurgaon", location: "Sector 54", workspace: "Meeting Room", name: "Summit Sector 54", price: "7,499", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80" },
          { city: "Delhi", location: "Connaught Place", workspace: "Coworking", name: "Connaught Circle Hub", price: "19,499", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80" },
          { city: "Delhi", location: "Saket", workspace: "Managed Office", name: "Saket Atrium", price: "25,999", image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80" },
          { city: "Delhi", location: "Nehru Place", workspace: "Private Office", name: "Nehru Place Tower", price: "22,999", image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80" },
          { city: "Delhi", location: "Aerocity", workspace: "Meeting Room", name: "Aerocity Connect", price: "8,499", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80" },
          { city: "Noida", location: "Sector 3", workspace: "Coworking", name: "Noida Basecamp", price: "15,999", image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=80" },
          { city: "Noida", location: "Sector 16", workspace: "Managed Office", name: "Sector 16 Centre", price: "21,999", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80" },
          { city: "Noida", location: "Sector 62", workspace: "Private Office", name: "Tech Park 62", price: "24,499", image: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?auto=format&fit=crop&w=900&q=80" },
          { city: "Noida", location: "Sector 132", workspace: "Meeting Room", name: "Expressway Rooms", price: "6,499", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80" }
        ];

        var selectedLocation = "All Offices";

        Object.keys(cityMeta).forEach(function (city) {
          var option = document.createElement("option");
          option.value = city;
          option.textContent = city;
          citySelect.appendChild(option);
        });
        citySelect.value = "Gurgaon";

        function updateHeader() {
          var city = citySelect.value;
          titleElement.textContent = cityMeta[city].sectionTitle;
          copyElement.textContent = cityMeta[city].description;
        }

        function renderChips() {
          var labels = ["All Offices"].concat(cityMeta[citySelect.value].locations);
          chipRow.innerHTML = "";

          labels.forEach(function (label) {
            var button = document.createElement("button");
            button.type = "button";
            button.className = "city-chip" + (label === selectedLocation ? " is-active" : "");
            button.dataset.location = label;
            button.textContent = label.toUpperCase();
            chipRow.appendChild(button);
          });
        }

        function getFilteredOffices() {
          return offices.filter(function (office) {
            var byCity = office.city === citySelect.value;
            var byWorkspace = workspaceSelect.value === "All" || office.workspace === workspaceSelect.value;
            var byLocation = selectedLocation === "All Offices" || office.location === selectedLocation;
            return byCity && byWorkspace && byLocation;
          });
        }

        function updateResultsHeader(items) {
          if (!items.length) {
            resultsTitle.textContent = "No offices available";
            resultsLink.setAttribute("href", "#contact");
            return;
          }

          var firstOffice = items[0];
          resultsTitle.textContent = selectedLocation === "All Offices"
            ? "All " + citySelect.value + " Offices"
            : firstOffice.location + ", " + citySelect.value;
          resultsLink.setAttribute("href", "#contact");
        }

        function renderCards(items) {
          officeGrid.innerHTML = "";

          if (!items.length) {
            officeGrid.classList.add("d-none");
            emptyState.classList.remove("d-none");
            return;
          }

          officeGrid.classList.remove("d-none");
          emptyState.classList.add("d-none");

          items.forEach(function (office) {
            var column = document.createElement("div");
            column.className = "col-md-6 col-xl-4";
            column.innerHTML =
              '<article class="office-card featured-office-card p-3 city-office-list-card">' +
                '<img src="' + office.image + '" alt="' + office.name + '">' +
                '<div class="office-card-body">' +
                  '<h3>' + office.name + '</h3>' +
                  '<p class="mb-1 city-office-meta d-none">' + office.location + ' | ' + office.workspace + '</p>' +
                  '<p class="mb-1">Price Starting</p>' +
                  '<div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">' +
                    '<div class="price-tag">&#8377;' + office.price + ' <span>/month</span></div>' +
                    '<a href="#contact" class="btn btn-outline-danger rounded-pill px-4">BOOK A VISIT</a>' +
                  '</div>' +
                '</div>' +
              '</article>';
            officeGrid.appendChild(column);
          });
        }

        function updateDirectory() {
          updateHeader();
          renderChips();
          var items = getFilteredOffices();
          updateResultsHeader(items);
          renderCards(items);
        }

        citySelect.addEventListener("change", function () {
          selectedLocation = "All Offices";
          updateDirectory();
        });

        workspaceSelect.addEventListener("change", updateDirectory);

        chipRow.addEventListener("click", function (event) {
          var button = event.target.closest(".city-chip");
          if (!button) return;
          selectedLocation = button.dataset.location;
          updateDirectory();
        });

        updateDirectory();
      })();


      // scm form js

      const scmForm = document.querySelector("[data-scm-form]");
      if (scmForm) {
        const stepOne = scmForm.querySelector(".scm-form-step-one");
        const stepTwo = scmForm.querySelector(".scm-form-step-two");
        const stepThree = scmForm.querySelector(".scm-form-step-three");
        const stepOneForm = scmForm.querySelector("[data-scm-step-one-form]");
        const stepTwoForm = scmForm.querySelector("[data-scm-step-two-form]");
        const nextButton = scmForm.querySelector("[data-scm-next]");
        const nextMiddleButton = scmForm.querySelector("[data-scm-next-middle]");
        const skipButton = scmForm.querySelector("[data-scm-skip]");
        const choiceButtons = scmForm.querySelectorAll(".scm-choice-chip");

        const showStep = (step) => {
          stepOne?.classList.toggle("is-active", step === 1);
          stepTwo?.classList.toggle("is-active", step === 2);
          stepThree?.classList.toggle("is-active", step === 3);
        };

        stepOneForm?.addEventListener("submit", (event) => {
          event.preventDefault();
          showStep(2);
        });

        stepTwoForm?.addEventListener("submit", (event) => {
          event.preventDefault();
          showStep(3);
        });

        nextButton?.addEventListener("click", () => showStep(2));
        nextMiddleButton?.addEventListener("click", () => showStep(3));
        skipButton?.addEventListener("click", () => showStep(1));

        choiceButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const group = button.closest(".scm-choice-group");
            group?.querySelectorAll(".scm-choice-chip").forEach((chip) => chip.classList.remove("is-selected"));
            button.classList.add("is-selected");
          });
        });

        stepThree?.querySelector(".scm-details-form")?.addEventListener("submit", (event) => {
          event.preventDefault();
          showStep(1);
        });
      }

      // scm form js

      // career testimonial read more js

      document.querySelectorAll(".career-testimonial-copy p").forEach((paragraph) => {
        if (paragraph.dataset.readmoreBound === "true") return;
        paragraph.dataset.readmoreBound = "true";

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "career-testimonial-toggle";
        toggle.textContent = "Read More";

        toggle.addEventListener("click", () => {
          const expanded = paragraph.classList.toggle("is-expanded");
          toggle.textContent = expanded ? "Read Less" : "Read More";
        });

        paragraph.insertAdjacentElement("afterend", toggle);
      });

      // career testimonial read more js

      // location landmark card selection js

      document.querySelectorAll(".location-landmark-grid").forEach((grid) => {
        grid.addEventListener("click", (event) => {
          const card = event.target.closest(".location-landmark-card");
          if (!card || !grid.contains(card)) return;

          grid.querySelectorAll(".location-landmark-card").forEach((item) => {
            item.classList.remove("selected");
          });

          card.classList.add("selected");
        });
      });

      // location landmark card selection js

      // photo video gallery lightbox js

      (function () {
        var lightbox = document.getElementById("videoGalleryLightbox");
        var frame = lightbox ? lightbox.querySelector("iframe") : null;
        var closeButton = lightbox ? lightbox.querySelector(".video-gallery-close") : null;
        var cards = Array.from(document.querySelectorAll(".video-gallery-card"));

        if (!lightbox || !frame || !closeButton || !cards.length) {
          return;
        }

        function closeVideoLightbox() {
          lightbox.classList.remove("is-open");
          lightbox.setAttribute("aria-hidden", "true");
          frame.src = "";
          document.body.classList.remove("lightbox-open");
        }

        cards.forEach(function (card) {
          card.addEventListener("click", function () {
            var videoUrl = card.dataset.video;
            if (!videoUrl) return;

            frame.src = videoUrl;
            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.classList.add("lightbox-open");
          });
        });

        closeButton.addEventListener("click", closeVideoLightbox);

        lightbox.addEventListener("click", function (event) {
          if (event.target === lightbox) {
            closeVideoLightbox();
          }
        });

        document.addEventListener("keydown", function (event) {
          if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeVideoLightbox();
          }
        });
      })();

      // photo video gallery lightbox js
