/* ------------------------------------------------------------------
   Espace client — mini-films d'écriture
   ------------------------------------------------------------------
   La clé "anon" ci-dessous est publique par design : elle ne donne
   accès à rien toute seule. La protection réelle vient des policies
   RLS définies dans Supabase (voir SUPABASE-SETUP.md).
   ------------------------------------------------------------------ */

const SUPABASE_URL = "https://mmnehkkmcrezsnzvnvzy.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tbmVoa2ttY3JlenNuenZudnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDQzMzQsImV4cCI6MjEwMDk4MDMzNH0.ISUDNV_S7xqnWF5elj1rUitYBj-6YFIYgK63bRfDBU0";

// Nom du bucket privé qui contient les vidéos
const BUCKET = "otiote";
// Sous-dossier dans le bucket ("" si les fichiers sont à la racine)
const FOLDER = "";
// Durée de validité des liens vidéo, en secondes (2 h)
const SIGNED_URL_TTL = 60 * 60 * 2;

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm", ".m4v"];

/* ------------------------------------------------------------------
   Ordre de l'alphabet hébraïque.
   C'est CE tableau qui décide de l'ordre d'affichage sur la page :
   les vidéos sont classées selon leur position ici, et non par ordre
   alphabétique de nom de fichier.

   "file"   = nom du fichier dans le bucket, SANS l'extension
   "letter" = lettre affichée sur la vignette (seul élément visible)
   "name"   = non affiché : sert d'infobulle au survol et de libellé
              pour les lecteurs d'écran

   Les lettres finales (sofit) sont placées juste après leur lettre de
   base. Pour changer l'ordre, il suffit de déplacer une ligne.
   Un fichier absent de ce tableau s'affiche quand même, à la fin.
   ------------------------------------------------------------------ */
const LETTER_ORDER = [
  { file: "aleph", letter: "א", name: "Alef" },
  { file: "aleph2", letter: "2 א", name: "Alef 2" },
  { file: "beit", letter: "ב", name: "Beit" },
  { file: "gml", letter: "ג", name: "Gimel" },
  { file: "dlt", letter: "ד", name: "Dalet" },
  { file: "he", letter: "ה", name: "He" },
  { file: "vav", letter: "ו", name: "Vav" },
  { file: "zayin", letter: "ז", name: "Zayin" },
  { file: "het", letter: "ח", name: "Het" },
  { file: "tet", letter: "ט", name: "Tet" },
  { file: "youd", letter: "י", name: "Youd" },
  { file: "haf", letter: "כ", name: "Haf" },
  { file: "haf-sofi", letter: "ך", name: "Haf sofit" },
  { file: "lamed", letter: "ל", name: "Lamed" },
  { file: "mem", letter: "מ", name: "Mem" },
  { file: "mem-sofi", letter: "ם", name: "Mem sofit" },
  { file: "noun", letter: "נ", name: "Noun" },
  { file: "noun-sofi", letter: "ן", name: "Noun sofit" },
  { file: "samer", letter: "ס", name: "Samekh" },
  { file: "ayin", letter: "ע", name: "Ayin" },
  { file: "pe", letter: "פ", name: "Pe" },
  { file: "pe-sofi", letter: "ף", name: "Pe sofit" },
  { file: "tsadik", letter: "צ", name: "Tsadik" },
  { file: "tsadik-sofi", letter: "ץ", name: "Tsadik sofit" },
  { file: "kouf", letter: "ק", name: "Kouf" },
  { file: "rech", letter: "ר", name: "Rech" },
  { file: "chin", letter: "ש", name: "Chin" },
  { file: "tav", letter: "ת", name: "Tav" },
];

const LETTER_BY_FILE = new Map(
  LETTER_ORDER.map((entry, index) => [entry.file, { ...entry, index }])
);

/* "haf-sofi.mp4" -> "haf-sofi" */
function baseName(filename) {
  return filename.replace(/\.[^.]+$/, "").trim().toLowerCase();
}

function letterInfo(filename) {
  return LETTER_BY_FILE.get(baseName(filename)) || null;
}

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const el = {
  login: document.getElementById("ec-login"),
  form: document.getElementById("ec-form"),
  email: document.getElementById("ec-email"),
  password: document.getElementById("ec-password"),
  togglePassword: document.getElementById("ec-toggle-password"),
  submit: document.getElementById("ec-submit"),
  error: document.getElementById("ec-error"),
  gallery: document.getElementById("ec-gallery"),
  user: document.getElementById("ec-user"),
  logout: document.getElementById("ec-logout"),
  status: document.getElementById("ec-status"),
  videos: document.getElementById("ec-videos"),
};

function showError(message) {
  el.error.textContent = message;
  el.error.hidden = false;
}

function clearError() {
  el.error.hidden = true;
}

function setPasswordVisible(visible) {
  el.password.type = visible ? "text" : "password";
  el.togglePassword.textContent = visible ? "Masquer" : "Afficher";
  el.togglePassword.setAttribute("aria-pressed", String(visible));
}

el.togglePassword.addEventListener("click", () => {
  setPasswordVisible(el.password.type === "password");
  el.password.focus();
});

/* Transforme "01-alef-final.mp4" en "Alef final" */
function prettyTitle(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[\s._-]*/, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

function isVideo(filename) {
  const lower = filename.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

async function loadVideos() {
  el.status.hidden = false;
  el.status.textContent = "Chargement des vidéos…";
  el.videos.innerHTML = "";

  const { data: files, error: listError } = await client.storage
    .from(BUCKET)
    .list(FOLDER, {
      limit: 500,
      sortBy: { column: "name", order: "asc" },
    });

  if (listError) {
    el.status.textContent =
      "Impossible de charger les vidéos : " + listError.message;
    return;
  }

  const videos = (files || []).filter((f) => isVideo(f.name));

  if (videos.length === 0) {
    el.status.textContent = "Aucune vidéo disponible pour le moment.";
    return;
  }

  const paths = videos.map((f) => (FOLDER ? `${FOLDER}/${f.name}` : f.name));

  const { data: signed, error: signError } = await client.storage
    .from(BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL);

  if (signError) {
    el.status.textContent =
      "Impossible de générer les liens : " + signError.message;
    return;
  }

  const playable = signed.filter((item) => item.signedUrl);

  if (playable.length === 0) {
    el.status.textContent = "Aucune vidéo lisible.";
    return;
  }

  /* Classement selon LETTER_ORDER. createSignedUrls ne garantit pas de
     conserver l'ordre d'entrée, on retrie donc ici. Les fichiers non
     répertoriés passent à la fin, par ordre alphabétique. */
  playable.sort((a, b) => {
    const nameA = a.path.split("/").pop();
    const nameB = b.path.split("/").pop();
    const rankA = letterInfo(nameA)?.index ?? Number.MAX_SAFE_INTEGER;
    const rankB = letterInfo(nameB)?.index ?? Number.MAX_SAFE_INTEGER;
    return rankA - rankB || nameA.localeCompare(nameB);
  });

  el.status.hidden = true;

  playable.forEach((item) => {
    const filename = item.path.split("/").pop();
    const info = letterInfo(filename);

    const card = document.createElement("div");
    card.className = "ec-video-card";

    const video = document.createElement("video");
    video.src = item.signedUrl;
    video.controls = true;
    video.preload = "none";
    video.setAttribute("controlsList", "nodownload");
    video.setAttribute("playsinline", "");

    const label = document.createElement("p");
    label.className = "ec-video-title";

    if (info) {
      /* Seule la lettre est affichée. Le nom translittéré reste accessible
         au survol et aux lecteurs d'écran, sans alourdir la vignette. */
      label.classList.add("ec-video-letter");
      label.textContent = info.letter;
      label.title = info.name;
      video.setAttribute("aria-label", info.name);
    } else {
      /* Fichier absent de LETTER_ORDER : on affiche son nom brut, ce qui
         signale immédiatement quelle entrée du tableau est à corriger. */
      label.textContent = prettyTitle(filename);
    }

    card.append(video, label);
    el.videos.appendChild(card);
  });
}

function showGallery(session) {
  el.login.hidden = true;
  el.gallery.hidden = false;
  el.user.textContent = session.user.email;
  loadVideos();
}

function showLogin() {
  el.gallery.hidden = true;
  el.login.hidden = false;
  el.videos.innerHTML = "";
  el.password.value = "";
  setPasswordVisible(false);
}

el.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  el.submit.disabled = true;
  el.submit.textContent = "CONNEXION…";

  const { data, error } = await client.auth.signInWithPassword({
    email: el.email.value.trim(),
    password: el.password.value,
  });

  el.submit.disabled = false;
  el.submit.textContent = "SE CONNECTER";

  if (error) {
    showError("Email ou mot de passe incorrect.");
    return;
  }

  showGallery(data.session);
});

el.logout.addEventListener("click", async () => {
  await client.auth.signOut();
  showLogin();
});

/* Reprend la session si le client s'est déjà connecté (stockée par supabase-js) */
(async () => {
  const { data } = await client.auth.getSession();
  if (data.session) {
    showGallery(data.session);
  }
})();
