$(document).ready(function () {
    // Gestionnaire d'événements pour les liens externes
    $(".external-link").click(function () {
        var url = $(this).data("url");
        window.open(url, '_blank');
    });

    // Masquer toutes les sections sauf la section "home"
    $("section:not(#home)").hide();

    // Gestionnaire d'événements pour les liens internes
    $("a").on("click", function () {
        const dataSection = $(this).attr("data-section")
        // console.log(dataSection)
        $("section").hide()
        $("#" + dataSection).show()
        $('.navbar-collapse').collapse('hide');
    });

    $('.navbar-toggler').on('click', function () {
        $('.navbar-collapse').collapse('toggle');
    });
    $('.dropdown-item').on('click', function (event) {
        $('.dropdown-menu').hide();
    });
    $('.dropdown').hover(function () {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
    }, function () {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
    });

    $("#loginForm").on("submit", function (event) {
        event.preventDefault(); // Empêche l'envoi du formulaire

        var username = $("#username").val();
        var password = $("#password").val();

        const users = [
            { username: "admin", password: "1234" },
            { username: "user1", password: "password1" }
        ];

        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            // Connexion réussie, affiche la section alertes
            $("#connectionAlertes").hide();
            $("#contenusAlertes").show();
        } else {
            alert("Identifiant ou mot de passe incorrect.");
        }
    });
});



const videoList = [
    {
        source: "https://www.youtube.com/embed/PFIHPSb4OPE?si=Rh8htL6sU01FyRyF",
        title: "CHAATNEZ 1 - QU’EST-CE QUE LA MITSVA DU CHAATNEZ ? - Rav Chalom Levy et Fabrice Mamou"
    },
    {
        source: "https://www.youtube.com/embed/CXpwIje_CPs?si=R77DMwoL1Zp2erJ2",
        title: "CHAATNEZ 2 - QU’EST-CE QUE LE CHAATNEZ DANS UN VETEMENT ? - Rav Chalom Levy et Fabrice Mamou"
    },
    {
        source: "https://www.youtube.com/embed/-HC5FzW20ZY?si=UD7fJxtD7j0sW9AT",
        title: "CHAATNEZ 3 - OU SE TROUVE LE CHAATNEZ DANS UN VETEMENT ? - Rav Chalom Levy et Fabrice Mamou"
    },
    {
        source: "https://www.youtube.com/embed/lc5UWxMDTpA?si=FO4BGSNSvchJdWsQ",
        title: "CHAATNEZ 4 - LE CHAATNEZ, PAS SEULEMENT DANS LES VETEMENTS ? - Rav Chalom Levy et Fabrice Mamou"
    },
    {
        source: "https://www.youtube.com/embed/mnIL8dEoNNM?si=SbIfbYQ5vXXYB1iv",
        title: "CHAATNEZ 5 - LA RECUPERATION DES VETEMENTS USAGES - Rav Chalom Levy et Fabrice Mamou"
    },
    {
        source: "https://www.youtube.com/embed/AjBrOD4COK4?si=Yy-FNvt1XKnegIub",
        title: "CHAATNEZ 6 - LE COL ETAIT CHAATNEZ, QUI VA LE REPARER ? - Rav Chalom Levy et Fabrice Mamou"
    },
    {
        source: "https://www.youtube.com/embed/4D_Tdhf8Jeo?si=QntSArehLSibodMI",
        title: "CHAATNEZ 7 - LA CASQUETTE ETAIT CHAATNEZ - Rav Chalom Levy et Fabrice Mamou"
    },
    {
        source: "https://www.youtube.com/embed/G3xcMoOgI_o?si=_REaDrVYm7oSyWz7",
        title: "CHAATNEZ 8 - LE CHAATNEZ : L’HISTOIRE DE KAIN ET EVEL - Rav Chalom Levy et Fabrice Mamou"
    },
    {
        source: "https://www.youtube.com/embed/5vBuk4-td-8?si=Bcr6oZrz9vlkZI9-",
        title: "CHAATNEZ 9 - LA VRAIE NATURE DU CHAATNEZ : ASSIMILER ! - Rav Chalom Levy et Fabrice Mamou"
    },
    {
        source: "https://www.youtube.com/embed/qDzV4WktEPU?si=rcMAr94NXsUnLXHZ",
        title: "CHAATNEZ 10 - ATTENTION A VOS CHAUSSURES UGG ! - Rav Chalom Levy et Fabrice Mamou"
    },
    {
        source: "https://www.youtube.com/embed/_3nI_Fd6Ju4?si=J2Coq6GQDQiRauo7",
        title: "CHAATNEZ 11 - LE METIER DE VERIFICATEUR ? - Rav Chalom Levy et Fabrice Mamou"
    },
    {
        source: "https://www.youtube.com/embed/sZ5wjzS-waY?si=qmpDIrxuc_anOXV3",
        title: "CHAATNEZ 12 - LE BILAN - Rav Chalom Levy et Fabrice Mamou"
    },
]
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('videoList').innerHTML = videoList.map((item) => {
        return (
            `
                <div class="video-list">
                <iframe width="100%" height="100%" src=${item.source}
                        title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                        allowfullscreen class="main-video"></iframe>
                </div>
                <div class="list-title">   
                <p>${item.title}</p>
                </div>
            `
        )
    }).join('')
});

function togglePdf(elementId) {
    const iframe = document.getElementById(`pdfViewer${elementId}`);
    const button = document.querySelector(`#${elementId} .switchBtn`);

    if (iframe.style.display === 'none') {
        iframe.style.display = 'block';
        button.textContent = 'Fermer le PDF';
    } else {
        iframe.style.display = 'none';
        button.textContent = 'Afficher le PDF';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('alertes.json')
        .then(response => response.json())
        .then(data => {
            const alertes = data.alertes;
            const brandsList = document.getElementById('brands-list');

            brandsList.innerHTML = '';

            alertes.sort((a, b) => a.brand.localeCompare(b.brand));

            // Afficher les marques
            alertes.forEach(alerte => {
                const listItem = document.createElement('li');
                listItem.textContent = alerte.brand;
                listItem.onclick = () => showModal(alerte);
                brandsList.appendChild(listItem);
            });
        });

    function showModal(alerte) {
        const modal = document.getElementById('modal');
        const pdfCanvas = document.getElementById('pdf-canvas');
        const modalImage = document.getElementById('modal-image');
        const prevButton = document.getElementById('prev-image');
        const nextButton = document.getElementById('next-image');

        let hasPdf = Boolean(alerte.alerte_pdf);
        let hasImages = Array.isArray(alerte.images) && alerte.images.length > 0;
        let currentIndex = hasPdf ? -1 : 0; // Si PDF présent, commencer par -1 sinon 0
        let pdfDoc = null;
        let currentPage = 1;

        function showMedia() {
            if (currentIndex === -1 && hasPdf) {
                // Afficher le PDF
                loadPdf(alerte.alerte_pdf);
                modalImage.style.display = "none";
                pdfCanvas.style.display = "block";
            } else if (hasImages) {
                // Afficher une image
                modalImage.src = alerte.images[currentIndex];
                pdfCanvas.style.display = "none";
                modalImage.style.display = "block";
            }

            // Gérer l'affichage des boutons
            prevButton.style.display = (currentIndex > -1 || (currentIndex === 0 && hasPdf)) ? "block" : "none";
            nextButton.style.display = (currentIndex < alerte.images.length - 1) ? "block" : "none";
        }

        function loadPdf(pdfUrl) {
            pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
                pdfDoc = pdf;
                renderPage(currentPage);
            }).catch(err => {
                console.error("Erreur de chargement du PDF : ", err);
            });
        }

        function renderPage(pageNum) {
            pdfDoc.getPage(pageNum).then(page => {
                const viewport = page.getViewport({ scale: 1.5 });
                const context = pdfCanvas.getContext('2d');
                pdfCanvas.height = viewport.height;
                pdfCanvas.width = viewport.width;

                page.render({
                    canvasContext: context,
                    viewport: viewport
                });
            });
        }

        prevButton.onclick = () => {
            if (currentIndex > 0) {
                currentIndex--; // Reculer dans les images
            } else if (currentIndex === 0 && hasPdf) {
                currentIndex = -1; // Revenir au PDF
            }
            showMedia();
        };

        nextButton.onclick = () => {
            if (currentIndex < alerte.images.length - 1) {
                currentIndex++; // Avancer dans les images
            }
            showMedia();
        };

        showMedia();

        modal.style.display = "block";

        document.querySelector(".close").onclick = () => {
            modal.style.display = "none";
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    }
});


const scriptURL = 'https://script.google.com/macros/s/AKfycbwKjn-fDHCdf6-FKvJtEgPLHFb6Dhj9R1aGt5LkLAkrxIN7gDK5wjJCneKoR5M6AyU/exec';

document.addEventListener('DOMContentLoaded', function () {
  const addBtn = document.getElementById("addStoryBtn");
  const storyForm = document.getElementById("storyForm");
  const storyInput = document.getElementById("storyInput");
  const submitBtn = document.getElementById("submitStoryBtn");
  const container = document.getElementById("storiesContainer");

  // Affiche le formulaire lorsqu'on clique sur "+"
  addBtn.addEventListener("click", () => {
    storyForm.style.display = "block";
    storyInput.focus();
  });

  // Soumettre une nouvelle histoire
  submitBtn.addEventListener("click", async () => {
    const story = storyInput.value.trim();
    if (!story) return alert("Merci d'écrire quelque chose.");

    try {
      await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify({ story })
      });

      // Réinitialiser le formulaire
      storyForm.style.display = "none";
      storyInput.value = "";

      // Recharger les histoires
      loadStories();
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'histoire :", error);
      alert("Une erreur est survenue. Réessaie plus tard.");
    }
  });

  // Charger toutes les histoires existantes
  async function loadStories() {
    container.innerHTML = ""; // Vide le conteneur
    try {
      const response = await fetch(scriptURL);
      const stories = await response.json();

      if (stories.length === 0) {
        const msg = document.createElement("p");
        msg.className = "no-stories";
        msg.textContent = "Aucune histoire pour l’instant. Soyez le premier à partager la vôtre !";
        msg.style.textAlign = "center";
        msg.style.fontStyle = "italic";
        container.appendChild(msg);
      } else {
        stories.forEach(s => {
          const div = document.createElement("div");
          div.className = "story";
          div.textContent = s.story;
          container.appendChild(div);
        });
      }
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
      const errMsg = document.createElement("p");
      errMsg.textContent = "Erreur de chargement. Vérifie ta connexion.";
      errMsg.style.color = "red";
      errMsg.style.textAlign = "center";
      container.appendChild(errMsg);
    }
  }

  // Charger les histoires à l'ouverture
  loadStories();
});
