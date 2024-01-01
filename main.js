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
    });
});


