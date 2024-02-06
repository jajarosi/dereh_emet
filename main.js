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