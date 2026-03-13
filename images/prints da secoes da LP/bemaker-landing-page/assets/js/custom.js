(function ($) {
    "use strict"; // Start of use strict

  
    window.addEventListener("load", function () {
        document.querySelector(".preloader-container").style.display = "none";
    });


    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#mainNav",
        offset: 74,
    });

    // Collapse Navbar
    var navbarCollapse = function () {
        if ($("#mainNav").offset().top > 50) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar link is clicked 
    $('.navbar-nav>li>a').on('click', function () {
        $('.navbar-collapse').collapse('hide');
    });


    //  scroll actions
    $(window).scroll(navbarCollapse);
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });


    // Page Marker Actions
    if (document.body.getAttribute('data-theme') == "dark") {
        $('.position__image').attr('src', "./assets/images/markers/about-dark.svg");
    } else {
        $('.position__image').attr('src', "./assets/images/markers/about.svg");
    }

    $(window).scroll(function () {
        if ($(document).scrollTop() == 0 && $(document).scrollTop() < 333) {

            if (document.body.getAttribute('data-theme') == "dark") {
                $('.position__image').attr('src', "./assets/images/markers/about-dark.svg");
            } else {
                $('.position__image').attr('src', "./assets/images/markers/about.svg");
            }

        } else if ($(document).scrollTop() > 333 && $(document).scrollTop() < 3100) {
           
            if (document.body.getAttribute('data-theme') == "dark") {
                $('.position__image').attr('src', "./assets/images/markers/portfolio-dark.svg");
            } else {
                $('.position__image').attr('src', "./assets/images/markers/portfolio.svg");
            }

        } else if ($(document).scrollTop() > 3100 && $(document).scrollTop() < 3600) {
            if (document.body.getAttribute('data-theme') == "dark") {
                $('.position__image').attr('src', "./assets/images/markers/resume-dark.svg");
            } else {
                $('.position__image').attr('src', "./assets/images/markers/resume.svg");
            }

        } else if ($(document).scrollTop() > 3600) {
            if (document.body.getAttribute('data-theme') == "dark") {
                $('.position__image').attr('src', "./assets/images/markers/contact-dark.svg");
            } else {
                $('.position__image').attr('src', "./assets/images/markers/contact.svg");
            }
        }
    });


    //Switch theme 

    const toggleSwitch = document.querySelector('#darkmode-toggle');
    let switchTheme = (event) => {
        if (event.target.checked) {
            document.body.setAttribute('data-theme', 'dark');
            $('.position__image').attr('src', "./assets/images/markers/about-dark.svg");
        }else{
            document.body.removeAttribute('data-theme')
            $('.position__image').attr('src', "./assets/images/markers/about.svg");
        }
    }

    toggleSwitch.addEventListener('click', switchTheme)


    //initiliaze AOS
    AOS.init(
        {
            offset: 100,
            disable: function () {
                var maxWidth = 650;
                return window.innerWidth < maxWidth;
            }
        }
    );

// PORTFOLIO MODAL
$('.portfolio-trigger').on('click', function () {

  const type = $(this).data('type');
  const gallery = $(this).data('gallery');
  const videos = $(this).data('videos');
  const src = $(this).attr('src');

  // ELEMENTOS
  const modalImage = $('#modalImage');
  const modalGalleryImage = $('#modalGalleryImage');
  const modalVideo = $('#modalVideo');
  const galleryThumbs = $('#galleryThumbs');
  const videoThumbs = $('#videoThumbs');

  /* ===== RESET TOTAL ===== */
  modalImage.addClass('d-none').attr('src', '');
  modalGalleryImage.addClass('d-none').attr('src', '');
  modalVideo.addClass('d-none').attr('src', '');
  galleryThumbs.addClass('d-none').html('');
  videoThumbs.addClass('d-none').html('');

  modalVideo[0].pause();
  modalVideo[0].currentTime = 0;

  /* ===== IMAGEM ÚNICA ===== */
  if (type === 'image') {
    modalImage
      .attr('src', src)
      .removeClass('d-none');
  }

  /* ===== GALERIA DE IMAGENS (IGUAL AO VÍDEO) ===== */
  if (type === 'gallery' && gallery) {
    modalGalleryImage.removeClass('d-none');
    galleryThumbs.removeClass('d-none');

    // imagem inicial
    modalGalleryImage.attr('src', gallery[0]);

    gallery.forEach((imgSrc, index) => {
      const btn = $(`
        <button class="btn btn-sm btn-outline-light mx-1">
          ${index + 1}
        </button>
      `);

      btn.on('click', () => {
        modalGalleryImage.attr('src', imgSrc);
      });

      galleryThumbs.append(btn);
    });
  }

  /* ===== VÍDEO ===== */
  if (type === 'video' && videos) {
    modalVideo.removeClass('d-none');
    videoThumbs.removeClass('d-none');

    modalVideo.attr('src', videos[0]);
    modalVideo[0].load();
    modalVideo[0].play();

    videos.forEach((videoSrc, index) => {
      const btn = $(`
        <button class="btn btn-sm btn-outline-light mx-1">
          Vídeo ${index + 1}
        </button>
      `);

      btn.on('click', () => {
        modalVideo.attr('src', videoSrc);
        modalVideo[0].load();
        modalVideo[0].play();
      });

      videoThumbs.append(btn);
    });
  }
});

/* ===== LIMPA AO FECHAR ===== */
$('#portfolioModal').on('hidden.bs.modal', function () {
  const video = $('#modalVideo')[0];

  if (video) {
    video.pause();
    video.currentTime = 0;
  }

  $('#modalImage').attr('src', '').addClass('d-none');
  $('#modalGalleryImage').attr('src', '').addClass('d-none');
  $('#modalVideo').attr('src', '').addClass('d-none');
  $('#galleryThumbs').empty().addClass('d-none');
  $('#videoThumbs').empty().addClass('d-none');
});






})(jQuery); // End of use strict
